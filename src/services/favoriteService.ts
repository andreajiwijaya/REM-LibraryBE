import prisma from '../config/db';
import { Favorite } from '@prisma/client';

interface FavoriteData {
  userId: number;
  bookId: number;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getUserFavorites = async (
  userId: number,
  options: PaginationOptions = {}
): Promise<{ data: Favorite[]; total: number; page: number; limit: number }> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.favorite.count({ where: { userId } }),
    prisma.favorite.findMany({
      where: { userId },
      include: { book: true },
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    }),
  ]);

  return { data, total, page, limit };
};

export const isBookFavoritedByUser = async (userId: number, bookId: number): Promise<boolean> => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
  });
  return !!favorite;
};

export const createFavorite = async (data: FavoriteData): Promise<Favorite> => {
  const exists = await isBookFavoritedByUser(data.userId, data.bookId);
  if (exists) {
    throw new Error('Book already favorited by this user');
  }
  return await prisma.favorite.create({ data });
};

export const deleteFavorite = async (id: number): Promise<boolean> => {
  const favorite = await prisma.favorite.findUnique({ where: { id } });
  if (!favorite) return false;
  await prisma.favorite.delete({ where: { id } });
  return true;
};

export const countFavoritesByBook = async (bookId: number): Promise<number> => {
  return await prisma.favorite.count({ where: { bookId } });
};
