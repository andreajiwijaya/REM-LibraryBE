import prisma from '../config/db';
import { Review } from '@prisma/client';

type ReviewData = {
  userId: number;
  bookId: number;
  rating: number;
  comment: string;
};

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const createReview = async (data: ReviewData): Promise<Review> => {
  return prisma.review.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const updateReview = async (
  id: number,
  data: Partial<Omit<ReviewData, 'userId' | 'bookId'>>
): Promise<Review | null> => {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.review.update({
    where: { id },
    data,
  });
};

export const deleteReview = async (id: number): Promise<boolean> => {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.review.delete({ where: { id } });
  return true;
};

export const getReviewById = async (id: number): Promise<Review | null> => {
  return prisma.review.findUnique({ where: { id } });
};

export const getAllReviews = async (
  options: PaginationOptions = {}
): Promise<{ data: Review[]; total: number; page: number; limit: number }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.review.count(),
    prisma.review.findMany({
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    }),
  ]);

  return { data, total, page, limit };
};

export const getReviewsByBookId = async (
  bookId: number,
  options: PaginationOptions = {}
): Promise<{ data: Review[]; total: number; page: number; limit: number }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.review.count({ where: { bookId } }),
    prisma.review.findMany({
      where: { bookId },
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    }),
  ]);

  return { data, total, page, limit };
};
