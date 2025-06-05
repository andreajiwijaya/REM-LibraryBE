import prisma from '../config/db';
import { Category } from '@prisma/client';

interface CategoryData {
  name: string;
  description?: string | null;
}

interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllCategories = async (
  options: CategoryQueryOptions = {}
): Promise<{
  data: Category[];
  total: number;
  page: number;
  limit: number;
}> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;
  const search = options.search?.trim();

  const where = search && search.length > 0
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : undefined;

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    prisma.category.count({ where }),
  ]);

  return { data, total, page, limit };
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return await prisma.category.findUnique({ where: { id } });
};

export const createCategory = async (data: CategoryData): Promise<Category> => {
  return await prisma.category.create({ data });
};

export const updateCategory = async (
  id: number,
  data: Partial<CategoryData>
): Promise<Category | null> => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return null;
  return await prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return false;
  await prisma.category.delete({ where: { id } });
  return true;
};
