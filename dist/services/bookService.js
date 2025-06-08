"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCategoryFromBook = exports.addCategoryToBook = exports.searchBooksByTitle = exports.getBooksByAuthor = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllBooks = async (options = {}) => {
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
            db_1.default.book.findMany({
                where: whereCondition,
                include: { categories: { include: { category: true } } },
                skip,
                take: limit,
            }),
            db_1.default.book.count({ where: whereCondition }),
        ]);
        return { data, total };
    }
    const [data, total] = await Promise.all([
        db_1.default.book.findMany({
            include: { categories: { include: { category: true } } },
            skip,
            take: limit,
        }),
        db_1.default.book.count(),
    ]);
    return { data, total };
};
exports.getAllBooks = getAllBooks;
const getBookById = async (id) => {
    return await db_1.default.book.findUnique({
        where: { id },
        include: { categories: { include: { category: true } } },
    });
};
exports.getBookById = getBookById;
const createBook = async (data) => {
    return await db_1.default.book.create({ data });
};
exports.createBook = createBook;
const updateBook = async (id, data) => {
    const book = await db_1.default.book.findUnique({ where: { id } });
    if (!book)
        return null;
    return await db_1.default.book.update({ where: { id }, data });
};
exports.updateBook = updateBook;
const deleteBook = async (id) => {
    const book = await db_1.default.book.findUnique({ where: { id } });
    if (!book)
        return false;
    await db_1.default.book.delete({ where: { id } });
    return true;
};
exports.deleteBook = deleteBook;
const getBooksByAuthor = async (author) => {
    return await db_1.default.book.findMany({
        where: { author: { contains: author, mode: 'insensitive' } },
        include: { categories: { include: { category: true } } },
    });
};
exports.getBooksByAuthor = getBooksByAuthor;
const searchBooksByTitle = async (title) => {
    return await db_1.default.book.findMany({
        where: { title: { contains: title, mode: 'insensitive' } },
        include: { categories: { include: { category: true } } },
    });
};
exports.searchBooksByTitle = searchBooksByTitle;
const addCategoryToBook = async (bookId, categoryId) => {
    // Pastikan buku dan kategori ada
    const book = await db_1.default.book.findUnique({ where: { id: bookId } });
    const category = await db_1.default.category.findUnique({ where: { id: categoryId } });
    if (!book || !category)
        return null;
    // Cek apakah sudah ada relasi
    const existing = await db_1.default.bookCategory.findUnique({
        where: {
            bookId_categoryId: {
                bookId,
                categoryId,
            },
        },
    });
    if (!existing) {
        await db_1.default.bookCategory.create({
            data: { bookId, categoryId },
        });
    }
    return await db_1.default.book.findUnique({
        where: { id: bookId },
        include: { categories: { include: { category: true } } },
    });
};
exports.addCategoryToBook = addCategoryToBook;
const removeCategoryFromBook = async (bookId, categoryId) => {
    const existing = await db_1.default.bookCategory.findUnique({
        where: {
            bookId_categoryId: {
                bookId,
                categoryId,
            },
        },
    });
    if (!existing)
        return false;
    await db_1.default.bookCategory.delete({
        where: {
            bookId_categoryId: {
                bookId,
                categoryId,
            },
        },
    });
    return true;
};
exports.removeCategoryFromBook = removeCategoryFromBook;
