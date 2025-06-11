import { Router } from 'express';
import { body, query } from 'express-validator';
import * as bookController from '../controllers/bookController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Akses umum (semua user)
router.get('/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 }),
  query('category').optional().isString(),
  bookController.getAllBooks
);
router.get('/search',
  query('title').notEmpty().withMessage('title query is required'),
  bookController.searchBooksByTitle
);
router.get('/author/:author', bookController.getBooksByAuthor);
router.get('/:id', bookController.getBookById);

// Akses admin
router.post('/',
  roleMiddleware(['admin']),
  body('title').notEmpty(),
  body('author').notEmpty(),
  body('description').notEmpty(),
  bookController.createBook
);
router.put('/:id',
  roleMiddleware(['admin']),
  body('title').optional().notEmpty(),
  body('author').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('categoryId').optional().isInt().withMessage('categoryId must be an integer'),
  bookController.updateBook
);
router.delete('/:id', roleMiddleware(['admin']), bookController.deleteBook);
router.post('/:id/categories', roleMiddleware(['admin']), bookController.addCategoryToBook);
router.delete('/:id/categories/:categoryId', roleMiddleware(['admin']), bookController.removeCategoryFromBook);

export default router;
