import prisma from '../config/db';
import { Book } from '@prisma/client';

interface BookData {
  title: string;
  author: string;
  description: string;
  categoryIds?: number[]; // optional biar gak error kalau gak dikirim
}

interface GetAllBooksOptions {
  page?: number;
  limit?: number;
  category?: string;
}

export const getAllBooks = async (options: GetAllBooksOptions = {}): Promise<{ data: Book[]; total: number }> => {
  const { page = 1, limit = 10, category } = options;
  const skip = (page - 1) * limit;

  if (category) {
    const whereCondition = {
      categories: {
        some: {
          category: {
            name: category,
          },
        },
      },
    };

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        where: whereCondition,
        include: { categories: { include: { category: true } } },
        skip,
        take: limit,
      }),
      prisma.book.count({ where: whereCondition }),
    ]);

    return { data, total };
  }

  const [data, total] = await Promise.all([
    prisma.book.findMany({
      include: { categories: { include: { category: true } } },
      skip,
      take: limit,
    }),
    prisma.book.count(),
  ]);

  return { data, total };
};

export const getBookById = async (id: number): Promise<Book | null> => {
  return await prisma.book.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  });
};

export const createBook = async (data: BookData): Promise<Book> => {
  return await prisma.book.create({ data });
};

export const updateBook = async (id: number, data: Partial<BookData>): Promise<Book | null> => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return null;

  const updatedBook = await prisma.book.update({
    where: { id },
    data: {
      title: data.title,
      author: data.author,
      description: data.description,
    },
  });

  await prisma.bookCategory.deleteMany({
    where: { bookId: id },
  });

  if (data.categoryIds && data.categoryIds.length > 0) {
    const bookCategoryData = data.categoryIds.map((categoryId) => ({
      bookId: id,
      categoryId,
    }));

    await prisma.bookCategory.createMany({
      data: bookCategoryData,
      skipDuplicates: true,
    });
  }

  return updatedBook;
};


export const deleteBook = async (id: number): Promise<boolean> => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return false;
  await prisma.book.delete({ where: { id } });
  return true;
};

export const getBooksByAuthor = async (author: string): Promise<Book[]> => {
  return await prisma.book.findMany({
    where: { author: { contains: author, mode: 'insensitive' } },
    include: { categories: { include: { category: true } } },
  });
};

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
  return await prisma.book.findMany({
    where: { title: { contains: title, mode: 'insensitive' } },
    include: { categories: { include: { category: true } } },
  });
};

export const addCategoryToBook = async (bookId: number, categoryId: number): Promise<Book | null> => {
  // Pastikan buku dan kategori ada
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!book || !category) return null;

  // Cek apakah sudah ada relasi
  const existing = await prisma.bookCategory.findUnique({
    where: {
      bookId_categoryId: {
        bookId,
        categoryId,
      },
    },
  });

  if (!existing) {
    await prisma.bookCategory.create({
      data: { bookId, categoryId },
    });
  }

  return await prisma.book.findUnique({
    where: { id: bookId },
    include: { categories: { include: { category: true } } },
  });
};

export const removeCategoryFromBook = async (bookId: number, categoryId: number): Promise<boolean> => {
  const existing = await prisma.bookCategory.findUnique({
    where: {
      bookId_categoryId: {
        bookId,
        categoryId,
      },
    },
  });

  if (!existing) return false;

  await prisma.bookCategory.delete({
    where: {
      bookId_categoryId: {
        bookId,
        categoryId,
      },
    },
  });

  return true;
};