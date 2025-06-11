import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as borrowService from '../services/borrowService';

// --- FUNGSI INI YANG DIPERBARUI ---
export const getAllBorrows = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    // Ambil parameter baru dari query
    const status = req.query.status as string | undefined;
    const searchTerm = req.query.searchTerm as string | undefined;

    // Panggil service dengan semua parameter
    const result = await borrowService.getAllBorrows({
      page,
      limit,
      status,
      searchTerm,
    });
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get borrows', error: error.message });
  }
};
// --- BATAS FUNGSI YANG DIPERBARUI ---


export const getMyBorrows = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const borrows = await borrowService.getBorrowsByUserId(userId);
    res.json(borrows);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get your borrows', error: error.message });
  }
};

export const getBorrowById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid borrow ID' });
      return;
    }

    const borrow = await borrowService.getBorrowById(id);
    if (!borrow) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }

    if (req.user?.role !== 'admin' && borrow.userId !== req.user?.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    res.json(borrow);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get borrow record', error: error.message });
  }
};

export const createBorrow = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { bookId, dueDate, notes } = req.body;

    const newBorrow = await borrowService.createBorrow({
      userId,
      bookId,
      borrowDate: new Date(),
      dueDate: new Date(dueDate),
      status: 'dipinjam',
      fineAmount: 0,
      extended: false,
      notes: notes || null,
      handledBy: null,
    });

    res.status(201).json(newBorrow);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create borrow record', error: error.message });
  }
};

export const returnBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid borrow ID' });
      return;
    }

    const borrow = await borrowService.getBorrowById(id);
    if (!borrow) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }

    if (req.user?.role !== 'admin' && borrow.userId !== req.user?.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    if (borrow.returnDate) {
      res.status(400).json({ message: 'Book already returned' });
      return;
    }

    const updated = await borrowService.updateBorrow(id, {
      returnDate: new Date(),
      status: 'dikembalikan',
      handledBy: req.user?.id,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to return borrow record', error: error.message });
  }
};

export const updateBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid borrow ID' });
      return;
    }

    const updatedBorrow = await borrowService.updateBorrow(id, req.body);
    if (!updatedBorrow) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }

    res.json(updatedBorrow);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update borrow record', error: error.message });
  }
};

export const deleteBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid borrow ID' });
      return;
    }

    const deleted = await borrowService.deleteBorrow(id);
    if (!deleted) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }

    res.json({ message: 'Borrow record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete borrow record', error: error.message });
  }
};

export const getBorrowsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const borrows = await borrowService.getBorrowsByUserId(userId);
    res.json(borrows);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get borrows by user', error: error.message });
  }
};

export const getBorrowsByBookId = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.bookId);
    if (isNaN(bookId)) {
      res.status(400).json({ message: 'Invalid book ID' });
      return;
    }

    const borrows = await borrowService.getBorrowsByBookId(bookId);
    res.json(borrows);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get borrows by book', error: error.message });
  }
};

export const getOverdueBorrows = async (req: Request, res: Response): Promise<void> => {
  try {
    const borrows = await borrowService.getOverdueBorrows();
    res.json(borrows);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get overdue borrows', error: error.message });
  }
};