import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// User & Admin bisa lihat
router.get('/', roleMiddleware(['admin', 'user']), categoryController.getAllCategories);
router.get('/:id', roleMiddleware(['admin', 'user']), categoryController.getCategoryById);

// Admin saja bisa ubah data
router.post('/', roleMiddleware(['admin']), categoryController.createCategory);
router.put('/:id', roleMiddleware(['admin']), categoryController.updateCategory);
router.delete('/:id', roleMiddleware(['admin']), categoryController.deleteCategory);

export default router;
