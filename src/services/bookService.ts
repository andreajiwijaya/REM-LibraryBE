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

export const updateBook = async (id: number, data: BookData): Promise<Book | null> => {
  // Gunakan transaksi untuk memastikan semua operasi berhasil atau gagal bersama.
  const result = await prisma.$transaction(async (tx) => {
    // --- Langkah Validasi Tambahan ---
    // 1. Validasi dulu bahwa semua categoryIds yang dikirim benar-benar ada di database.
    if (data.categoryIds && data.categoryIds.length > 0) {
      const existingCategories = await tx.category.findMany({
        where: { id: { in: data.categoryIds } },
        select: { id: true },
      });

      // Jika jumlah kategori yang ditemukan tidak sama dengan jumlah ID yang dikirim, berarti ada ID yang tidak valid.
      if (existingCategories.length !== data.categoryIds.length) {
        // Temukan ID mana yang tidak valid untuk pesan error yang lebih jelas
        const existingIds = existingCategories.map(c => c.id);
        const invalidIds = data.categoryIds.filter(catId => !existingIds.includes(catId));
        throw new Error(`Kategori dengan ID berikut tidak ditemukan: ${invalidIds.join(', ')}`);
      }
    }
    // --- Akhir Langkah Validasi ---


    // 2. Update data dasar buku (hanya jika ada datanya)
    const bookDataToUpdate: { title?: string; author?: string; description?: string } = {};
    if (data.title) bookDataToUpdate.title = data.title;
    if (data.author) bookDataToUpdate.author = data.author;
    if (data.description) bookDataToUpdate.description = data.description;

    if (Object.keys(bookDataToUpdate).length > 0) {
        await tx.book.update({
          where: { id },
          data: bookDataToUpdate,
        });
    }

    // 3. Hapus semua relasi kategori yang lama untuk buku ini.
    await tx.bookCategory.deleteMany({
      where: { bookId: id },
    });

    // 4. Jika ada categoryIds yang baru, buat relasi yang baru.
    if (data.categoryIds && data.categoryIds.length > 0) {
      const bookCategoryData = data.categoryIds.map((categoryId) => ({
        bookId: id,
        categoryId: categoryId,
      }));

      await tx.bookCategory.createMany({
        data: bookCategoryData,
      });
    }

    // 5. Ambil kembali data buku yang sudah lengkap dengan relasi kategori terbarunya.
    const finalBook = await tx.book.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true, // Asumsi: Model BookCategory punya relasi 'category' ke model Category
          },
        },
      },
    });

    if (!finalBook) {
      throw new Error('Gagal menemukan buku setelah proses update.');
    }

    return finalBook;
  });

  return result;
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