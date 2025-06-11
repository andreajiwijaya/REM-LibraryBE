import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as bookService from '../services/bookService';

// 1. Get all books (optional pagination + filter by category)
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, category } = req.query;
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const { data, total } = await bookService.getAllBooks({
      page: pageNum,
      limit: limitNum,
      category: category as string | undefined,
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
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get books', error: error.message });
  }
};

// 2. Get book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await bookService.getBookById(parseInt(req.params.id));
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get book', error: error.message });
  }
};

// 3. Create new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const newBook = await bookService.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
};

// 4. Update book by ID
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
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
  } catch (error: any) {
    console.error("🛑 UpdateBook Error:", error);
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

// 5. Delete book by ID
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await bookService.deleteBook(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

// 6. Get books by author
export const getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const author = req.params.author;
    const books = await bookService.getBooksByAuthor(author);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get books by author', error: error.message });
  }
};

// 7. Get books by title keyword (search)
export const searchBooksByTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const title = req.query.title as string;
    if (!title) {
      res.status(400).json({ message: 'Missing title query parameter' });
      return;
    }
    const books = await bookService.searchBooksByTitle(title);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to search books', error: error.message });
  }
};

// 8. Add category to book
export const addCategoryToBook = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to add category to book', error: error.message });
  }
};

// 9. Remove category from book
export const removeCategoryFromBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.id);
    const categoryId = parseInt(req.params.categoryId);
    const success = await bookService.removeCategoryFromBook(bookId, categoryId);
    if (!success) {
      res.status(404).json({ message: 'Book or category not found' });
      return;
    }
    res.json({ message: 'Category removed from book successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to remove category from book', error: error.message });
  }
};