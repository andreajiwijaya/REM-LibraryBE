import prisma from '../config/db';
import { Borrow, User } from '@prisma/client';

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

// --- FUNGSI UTAMA YANG DIPERBAIKI ---
export const getAllBorrows = async (options: GetAllBorrowsOptions) => {
  const { page, limit, status, searchTerm } = options;
  const skip = (page - 1) * limit;

  // Membuat kondisi 'where' secara dinamis untuk Prisma
  const whereClause: any = {};

  // Logika untuk filter status
  if (status && status !== 'Semua') {
    if (status === 'Terlambat') {
      whereClause.dueDate = { lt: new Date() };
      whereClause.status = 'Dipinjam'; 
    } else {
      whereClause.status = status;
    }
  }

  // Logika untuk pencarian (search)
  if (searchTerm) {
    whereClause.OR = [
      { book: { title: { contains: searchTerm, mode: 'insensitive' } } },
      // Menggunakan relasi User untuk mencari berdasarkan username
      { user: { username: { contains: searchTerm, mode: 'insensitive' } } },
    ];
  }
  
  // Menjalankan dua query (count dan findMany) dalam satu transaksi untuk efisiensi
  const [total, data] = await prisma.$transaction([
    prisma.borrow.count({ where: whereClause }),
    prisma.borrow.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: { 
        // Hanya pilih field yang dibutuhkan untuk mengurangi ukuran payload
        user: { select: { id: true, username: true } }, 
        book: { select: { id: true, title: true } } 
      },
      orderBy: { borrowDate: 'desc' },
    }),
  ]);

  // Menghitung total halaman untuk paginasi
  const totalPages = Math.ceil(total / limit);

  // Mengembalikan data dengan format yang diharapkan frontend
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
// --- BATAS FUNGSI YANG DIPERBAIKI ---


export const getBorrowById = async (id: number): Promise<Borrow | null> => {
  return prisma.borrow.findUnique({
    where: { id },
    include: { user: true, book: true },
  });
};

export const createBorrow = async (data: BorrowData): Promise<Borrow> => {
  return prisma.borrow.create({ data });
};

export const updateBorrow = async (id: number, data: Partial<BorrowData>): Promise<Borrow | null> => {
  const borrow = await prisma.borrow.findUnique({ where: { id } });
  if (!borrow) return null;

  return prisma.borrow.update({
    where: { id },
    data,
  });
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