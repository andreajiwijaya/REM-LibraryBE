import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as userService from '../services/userService';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await userService.getAllUsers({ page, limit, search });

    const sanitizedUsers = result.data.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }));

    res.json({
      data: sanitizedUsers,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { id, username, email, role } = user;
    res.json({ id, username, email, role });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    if (!password || password.trim() === '') {
      res.status(400).json({ message: 'Password is required' });
      return;
    }

    if (!email || email.trim() === '') {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.createUser({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const { id } = newUser;
    res.status(201).json({ id, username, email, role });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await userService.updateUser(parseInt(req.params.id), req.body);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { id, username, email, role } = updatedUser;
    res.json({ id, username, email, role });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await userService.deleteUser(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;

    // Panggil service untuk ambil data user berdasarkan userId
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { id, username, email, role } = user;
    res.json({ id, username, email, role });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get current user', error: error.message });
  }
};