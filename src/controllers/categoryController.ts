import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await categoryService.getAllCategories({ page, limit, search });

    res.json({
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get categories', error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.getCategoryById(parseInt(req.params.id));
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get category', error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.createCategory({ name, description });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await categoryService.updateCategory(parseInt(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await categoryService.deleteCategory(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};
