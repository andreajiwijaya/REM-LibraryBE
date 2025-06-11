import prisma from '../config/db';
import { Borrow, User } from '@prisma/client';

// Tarif denda per hari (misalnya: Rp 1.000)
const FINE_RATE_PER_DAY = 1000;

// Interface untuk data peminjaman baru
interface BorrowData {
  userId: number;
  bookId: number;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  status?: string;
  fineAmount?: number | null;
  extended?: boolean;
  notes?: string | null;
  handledBy?: number | null;
}

// Interface untuk opsi query getAllBorrows
interface GetAllBorrowsOptions {
  page: number;
  limit: number;
  status?: string;
  searchTerm?: string;
}

// Fungsi ini sudah optimal, tidak perlu diubah
export const getAllBorrows = async (options: GetAllBorrowsOptions) => {
  const { page, limit, status, searchTerm } = options;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (status && status !== 'Semua') {
    if (status === 'Terlambat') {
      whereClause.dueDate = { lt: new Date() };
      whereClause.status = 'Dipinjam'; 
    } else {
      whereClause.status = status;
    }
  }

  if (searchTerm) {
    whereClause.OR = [
      { book: { title: { contains: searchTerm, mode: 'insensitive' } } },
      { user: { username: { contains: searchTerm, mode: 'insensitive' } } },
    ];
  }
  
  const [total, data] = await prisma.$transaction([
    prisma.borrow.count({ where: whereClause }),
    prisma.borrow.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: { 
        user: { select: { id: true, username: true } }, 
        book: { select: { id: true, title: true } } 
      },
      orderBy: { borrowDate: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { 
    data, 
    meta: {
      total, 
      page, 
      limit,
      totalPages
    }
  };
};

// --- FUNGSI UTAMA YANG DIPERBAIKI ---
export const updateBorrow = async (id: number, data: Partial<BorrowData>): Promise<Borrow | null> => {
  const borrow = await prisma.borrow.findUnique({ where: { id } });
  if (!borrow) return null;
  
  const dataToUpdate = { ...data };

  // Logika otomatisasi denda saat buku dikembalikan
  if (data.status === 'Dikembalikan' && !data.returnDate) {
    const returnDate = new Date();
    dataToUpdate.returnDate = returnDate; // Set tanggal kembali hari ini

    // Cek apakah pengembalian terlambat
    if (returnDate > borrow.dueDate) {
      const diffTime = Math.abs(returnDate.getTime() - borrow.dueDate.getTime());
      // Hitung selisih hari dan bulatkan ke atas
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Hitung denda dan masukkan ke data yang akan di-update
      dataToUpdate.fineAmount = diffDays * FINE_RATE_PER_DAY;
    }
  }

  return prisma.borrow.update({
    where: { id },
    data: dataToUpdate,
  });
};

export const getBorrowById = async (id: number): Promise<Borrow | null> => {
  return prisma.borrow.findUnique({
    where: { id },
    include: { user: true, book: true },
  });
};

export const createBorrow = async (data: BorrowData): Promise<Borrow> => {
  return prisma.borrow.create({ data });
};

export const deleteBorrow = async (id: number): Promise<boolean> => {
  const borrow = await prisma.borrow.findUnique({ where: { id } });
  if (!borrow) return false;
  await prisma.borrow.delete({ where: { id } });
  return true;
};

export const getBorrowsByUserId = async (userId: number): Promise<Borrow[]> => {
  return prisma.borrow.findMany({
    where: { userId },
    include: { book: true },
  });
};

export const getBorrowsByBookId = async (bookId: number): Promise<Borrow[]> => {
  return prisma.borrow.findMany({
    where: { bookId },
    include: { user: true },
  });
};

export const getOverdueBorrows = async (): Promise<Borrow[]> => {
  const now = new Date();
  return prisma.borrow.findMany({
    where: {
      returnDate: null,
      dueDate: { lt: now },
    },
    include: { user: true, book: true },
  });
};