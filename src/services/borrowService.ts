import prisma from '../config/db';
import { Borrow } from '@prisma/client';

interface BorrowData {
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate?: Date | null;
}

export const getAllBorrows = async ({ page, limit }: { page: number; limit: number }): Promise<{
  data: Borrow[];
  total: number;
  page: number;
  limit: number;
}> => {
  const [total, data] = await Promise.all([
    prisma.borrow.count(),
    prisma.borrow.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, book: true },
      orderBy: { borrowDate: 'desc' },
    }),
  ]);

  return { data, total, page, limit };
};

export const getBorrowById = async (id: number): Promise<Borrow | null> => {
  return await prisma.borrow.findUnique({
    where: { id },
    include: { user: true, book: true },
  });
};

export const createBorrow = async (data: BorrowData): Promise<Borrow> => {
  return await prisma.borrow.create({ data });
};

export const updateBorrow = async (id: number, data: Partial<BorrowData>): Promise<Borrow | null> => {
  const borrow = await prisma.borrow.findUnique({ where: { id } });
  if (!borrow) return null;
  return await prisma.borrow.update({ where: { id }, data });
};

export const deleteBorrow = async (id: number): Promise<boolean> => {
  const borrow = await prisma.borrow.findUnique({ where: { id } });
  if (!borrow) return false;
  await prisma.borrow.delete({ where: { id } });
  return true;
};

export const getBorrowsByUserId = async (userId: number): Promise<Borrow[]> => {
  return await prisma.borrow.findMany({
    where: { userId },
    include: { book: true },
  });
};

export const getBorrowsByBookId = async (bookId: number): Promise<Borrow[]> => {
  return await prisma.borrow.findMany({
    where: { bookId },
    include: { user: true },
  });
};

export const getOverdueBorrows = async (): Promise<Borrow[]> => {
  const now = new Date();
  const overdueDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  return await prisma.borrow.findMany({
    where: {
      returnDate: null,
      borrowDate: { lt: overdueDate },
    },
    include: { user: true, book: true },
  });
};
