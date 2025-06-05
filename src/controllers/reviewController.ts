import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await reviewService.getAllReviews({ page, limit });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get reviews', error: error.message });
  }
};

export const getReviewsByBookId = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = Number(req.params.bookId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await reviewService.getReviewsByBookId(bookId, { page, limit });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get reviews by book', error: error.message });
  }
};

export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await reviewService.getReviewById(parseInt(req.params.id));
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get review', error: error.message });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookId, rating, comment } = req.body;
    const review = await reviewService.createReview({ userId, bookId, rating, comment });
    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await reviewService.updateReview(parseInt(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await reviewService.deleteReview(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};
