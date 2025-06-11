"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCategoryFromBook = exports.addCategoryToBook = exports.searchBooksByTitle = exports.getBooksByAuthor = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const express_validator_1 = require("express-validator");
const bookService = __importStar(require("../services/bookService"));
// 1. Get all books (optional pagination + filter by category)
const getAllBooks = async (req, res) => {
    try {
        const { page, limit, category } = req.query;
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const { data, total } = await bookService.getAllBooks({
            page: pageNum,
            limit: limitNum,
            category: category,
        });
        const totalPages = Math.ceil(total / limitNum);
        res.json({
            data,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get books', error: error.message });
    }
};
exports.getAllBooks = getAllBooks;
// 2. Get book by ID
const getBookById = async (req, res) => {
    try {
        const book = await bookService.getBookById(parseInt(req.params.id));
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get book', error: error.message });
    }
};
exports.getBookById = getBookById;
// 3. Create new book
const createBook = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const newBook = await bookService.createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create book', error: error.message });
    }
};
exports.createBook = createBook;
// 4. Update book by ID
const updateBook = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const updatedBook = await bookService.updateBook(parseInt(req.params.id), req.body);
        if (!updatedBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(updatedBook);
    }
    catch (error) {
        console.error("🛑 UpdateBook Error:", error);
        res.status(500).json({ message: 'Failed to update book', error: error.message });
    }
};
exports.updateBook = updateBook;
// 5. Delete book by ID
const deleteBook = async (req, res) => {
    try {
        const deleted = await bookService.deleteBook(parseInt(req.params.id));
        if (!deleted) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete book', error: error.message });
    }
};
exports.deleteBook = deleteBook;
// 6. Get books by author
const getBooksByAuthor = async (req, res) => {
    try {
        const author = req.params.author;
        const books = await bookService.getBooksByAuthor(author);
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get books by author', error: error.message });
    }
};
exports.getBooksByAuthor = getBooksByAuthor;
// 7. Get books by title keyword (search)
const searchBooksByTitle = async (req, res) => {
    try {
        const title = req.query.title;
        if (!title) {
            res.status(400).json({ message: 'Missing title query parameter' });
            return;
        }
        const books = await bookService.searchBooksByTitle(title);
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to search books', error: error.message });
    }
};
exports.searchBooksByTitle = searchBooksByTitle;
// 8. Add category to book
const addCategoryToBook = async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const { categoryId } = req.body;
        if (!categoryId) {
            res.status(400).json({ message: 'Missing categoryId in body' });
            return;
        }
        const updatedBook = await bookService.addCategoryToBook(bookId, categoryId);
        if (!updatedBook) {
            res.status(404).json({ message: 'Book or category not found' });
            return;
        }
        res.json(updatedBook);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add category to book', error: error.message });
    }
};
exports.addCategoryToBook = addCategoryToBook;
// 9. Remove category from book
const removeCategoryFromBook = async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const categoryId = parseInt(req.params.categoryId);
        const success = await bookService.removeCategoryFromBook(bookId, categoryId);
        if (!success) {
            res.status(404).json({ message: 'Book or category not found' });
            return;
        }
        res.json({ message: 'Category removed from book successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to remove category from book', error: error.message });
    }
};
exports.removeCategoryFromBook = removeCategoryFromBook;
