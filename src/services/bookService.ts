import { PrismaClient, Book } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Interface untuk data buku baru atau yang diupdate
interface BookData {
  title: string;
  author: string;
  description: string;
  categoryIds?: number[]; // categoryIds bersifat opsional
}

// Interface untuk opsi query getAllBooks
interface GetAllBooksOptions {
  page?: number;
  limit?: number;
  category?: string;
}

// 1. Get all books (dengan paginasi dan filter)
export const getAllBooks = async (options: GetAllBooksOptions = {}): Promise<{ data: Book[]; total: number }> => {
  const { page = 1, limit = 10, category } = options;
  const skip = (page - 1) * limit;

  const whereCondition = category ? {
    categories: {
      some: {
        category: {
          name: category,
        },
      },
    },
  } : {};

  const [data, total] = await prisma.$transaction([
    prisma.book.findMany({
      where: whereCondition,
      include: { categories: { include: { category: true } } },
      skip,
      take: limit,
      orderBy: { id: 'desc' } // Mengurutkan berdasarkan buku terbaru
    }),
    prisma.book.count({ where: whereCondition }),
  ]);

  return { data, total };
};

// 2. Get book by ID
export const getBookById = async (id: number): Promise<Book | null> => {
  return prisma.book.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  });
};

// 3. Create new book (DIPERBAIKI)
export const createBook = async (data: BookData): Promise<Book> => {
  const { title, author, description, categoryIds } = data;

  // Validasi bahwa categoryIds (jika ada) benar-benar ada di database
  if (categoryIds && categoryIds.length > 0) {
    const categoriesCount = await prisma.category.count({
      where: { id: { in: categoryIds } },
    });
    if (categoriesCount !== categoryIds.length) {
      throw new Error('Satu atau lebih ID kategori tidak valid.');
    }
  }

  // Menggunakan nested writes untuk membuat buku beserta relasi kategorinya
  return prisma.book.create({
    data: {
      title,
      author,
      description,
      // Jika ada categoryIds, buat relasi di tabel BookCategory
      categories: categoryIds && categoryIds.length > 0 ? {
        create: categoryIds.map(catId => ({
          category: {
            connect: { id: catId },
          },
        })),
      } : undefined, // Jika tidak ada, jangan buat relasi
    },
    include: {
        categories: { include: { category: true } }
    }
  });
};

// 4. Update book by ID (DIPERBAIKI)
// 4. Update book by ID (DIPERBAIKI LAGI)
export const updateBook = async (id: number, data: Partial<BookData>): Promise<Book | null> => {
  try { // Tambahkan try...catch di level paling atas
    const { title, author, description, categoryIds } = data;

    const bookExists = await prisma.book.findUnique({ where: { id } });
    if (!bookExists) {
      console.log(`[DEBUG] Buku dengan ID: ${id} tidak ditemukan.`);
      return null;
    }
    
    if (categoryIds && categoryIds.length > 0) {
      const categoriesCount = await prisma.category.count({
        where: { id: { in: categoryIds } },
      });
      if (categoriesCount !== categoryIds.length) {
        throw new Error('Satu atau lebih ID kategori tidak valid.');
      }
    }

    console.log(`[DEBUG] Memulai transaksi untuk update buku ID: ${id}`);
    return prisma.$transaction(async (tx) => {
      const dataToUpdate: { title?: string; author?: string; description?: string } = {};
      if (title !== undefined) dataToUpdate.title = title;
      if (author !== undefined) dataToUpdate.author = author;
      if (description !== undefined) dataToUpdate.description = description;

      if (Object.keys(dataToUpdate).length > 0) {
        console.log(`[DEBUG] Melakukan update data dasar...`);
        await tx.book.update({ where: { id }, data: dataToUpdate });
      }

      console.log(`[DEBUG] Menghapus relasi kategori lama...`);
      await tx.bookCategory.deleteMany({ where: { bookId: id } });

      if (categoryIds && categoryIds.length > 0) {
        console.log(`[DEBUG] Membuat relasi kategori baru...`);
        await tx.bookCategory.createMany({
          data: categoryIds.map((catId) => ({
            bookId: id,
            categoryId: catId,
          })),
        });
      }

      console.log(`[DEBUG] Mengambil data final...`);
      const finalBook = await tx.book.findUnique({
        where: { id },
        include: { categories: { include: { category: true } } },
      });

      if (!finalBook) {
        throw new Error("Gagal mengambil data buku setelah update.");
      }
      
      console.log(`[DEBUG] Transaksi berhasil.`);
      return finalBook;
    });
  } catch (error) {
    // BLOK INI AKAN MENANGKAP SEMUANYA
    console.error('🔥🔥🔥 TERJADI ERROR FATAL DI FUNGSI updateBook:', error);
    // Kita sengaja melempar ulang error agar proses tetap gagal dan menghasilkan 500,
    // tapi kita sudah mencatatnya di log.
    throw error;
  }
};


// 5. Delete book by ID
export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    await prisma.book.delete({ where: { id } });
    return true;
  } catch (error) {
    // Error bisa terjadi jika buku tidak ditemukan
    return false;
  }
};


// Fungsi lainnya tetap sama...

export const getBooksByAuthor = async (author: string): Promise<Book[]> => {
  return prisma.book.findMany({
    where: { author: { contains: author, mode: 'insensitive' } },
    include: { categories: { include: { category: true } } },
  });
};

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
  return prisma.book.findMany({
    where: { title: { contains: title, mode: 'insensitive' } },
    include: { categories: { include: { category: true } } },
  });
};

export const addCategoryToBook = async (bookId: number, categoryId: number): Promise<Book | null> => {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!book || !category) return null;

  await prisma.bookCategory.create({
    data: { bookId, categoryId },
    // skipDuplicates tidak ada di create, gunakan upsert atau findFirst untuk mengecek
  });

  return getBookById(bookId);
};

export const removeCategoryFromBook = async (bookId: number, categoryId: number): Promise<boolean> => {
  const result = await prisma.bookCategory.deleteMany({
    where: { bookId, categoryId },
  });

  return result.count > 0;
};