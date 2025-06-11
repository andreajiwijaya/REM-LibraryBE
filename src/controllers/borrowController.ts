import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as borrowService from '../services/borrowService';

// Fungsi ini sudah optimal dan mendukung filter & search
export const getAllBorrows = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const searchTerm = req.query.searchTerm as string | undefined;

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

// Fungsi ini menjadi satu-satunya cara untuk mengubah data peminjaman.
export const updateBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid borrow ID' });
      return;
    }

    const dataToUpdate = req.body;
    
    if ((req as any).user?.id) {
        dataToUpdate.handledBy = (req as any).user.id;
    }

    const updatedBorrow = await borrowService.updateBorrow(id, dataToUpdate);
    
    if (!updatedBorrow) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }

    res.json(updatedBorrow);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update borrow record', error: error.message });
  }
};


export const getMyBorrows = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
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

    const user = (req as any).user;
    if (user?.role !== 'admin' && borrow.userId !== user?.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    res.json(borrow);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get borrow record', error: error.message });
  }
};

// --- FUNGSI INI YANG DIPERBAIKI ---
export const createBorrow = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // dueDate tidak lagi diambil dari body
    const { bookId, notes } = req.body;

    // Tentukan tanggal pinjam dan jatuh tempo secara otomatis
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7); // Atur jatuh tempo 7 hari dari sekarang

    const newBorrow = await borrowService.createBorrow({
      userId,
      bookId,
      borrowDate: borrowDate,
      dueDate: dueDate, // Gunakan tanggal yang sudah dihitung
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