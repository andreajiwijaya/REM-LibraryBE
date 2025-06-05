import { Router } from 'express';
import authRoutes from './authRoute';
import userRoutes from './userRoute';
import bookRoutes from './bookRoute';
import borrowRoutes from './borrowRoute';
import favoriteRoutes from './favoriteRoute';
import reviewRoutes from './reviewRoute';
import categoryRoutes from './categoryRoute';

const router = Router();

router.get('/', (_, res) => {
  res.json({ message: '📚 Welcome to REM-Library API' });
});

// Route grouping
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/borrows', borrowRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/categories', categoryRoutes);

export default router;
