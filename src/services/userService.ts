import prisma from '../config/db';
import { User } from '@prisma/client';

interface UserData {
  username: string;
  password: string;
  role?: string;
}

interface UserQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllUsers = async (
  options: UserQueryOptions = {}
): Promise<{
  data: User[];
  total: number;
  page: number;
  limit: number;
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const search = options.search?.trim();

  const where =
    search && search.length > 0
      ? {
          OR: [
            {
              username: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              role: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : undefined;

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, limit };
};

export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

export const createUser = async (data: UserData): Promise<User> => {
  return await prisma.user.create({ data });
};

export const updateUser = async (
  id: number,
  data: Partial<UserData>
): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return await prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return false;
  await prisma.user.delete({ where: { id } });
  return true;
};
