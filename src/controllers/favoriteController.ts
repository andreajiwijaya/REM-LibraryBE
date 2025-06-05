import { Request, Response } from 'express';
import * as favoriteService from '../services/favoriteService';

export const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await favoriteService.getUserFavorites(userId, { page, limit });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get user favorites', error: error.message });
  }
};

export const createFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookId } = req.body;
    const favorite = await favoriteService.createFavorite({ userId, bookId });
    res.status(201).json(favorite);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create favorite' });
  }
};

export const deleteFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await favoriteService.deleteFavorite(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Favorite not found' });
      return;
    }
    res.json({ message: 'Favorite deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete favorite', error: error.message });
  }
};

export const checkFavoriteStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const bookId = Number(req.params.bookId);
    const isFavorited = await favoriteService.isBookFavoritedByUser(userId, bookId);
    res.json({ isFavorited });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to check favorite status', error: error.message });
  }
};

export const getFavoriteCountByBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = Number(req.params.bookId);
    const count = await favoriteService.countFavoritesByBook(bookId);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get favorite count', error: error.message });
  }
};
