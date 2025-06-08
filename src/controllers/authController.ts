import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    // Validasi role jika dikirim
    if (role && role !== 'user' && role !== 'admin') {
      res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
      return;
    }

    const newUser = await authService.registerUser({ username, email, password, role });
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id,
      role: newUser.role,
    });
  } catch (error: any) {
    if (
      error.message === 'Username already exists' ||
      error.message === 'Email already exists'
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, user } = await authService.loginUser(req.body);
    res.json({ token, user });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
