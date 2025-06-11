import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as borrowController from '../controllers/borrowController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

// Semua route di bawah ini harus sudah login
router.use(authMiddleware);

// GET /borrows?page=&limit= (admin only) dengan pagination dan validasi query param
router.get('/',
  roleMiddleware(['admin']),
  query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ gt: 0 }).withMessage('Limit must be a positive integer'),
  borrowController.getAllBorrows
);

// GET /borrows/my (user only) get borrow milik user sendiri
router.get('/my',
  roleMiddleware(['user']),
  borrowController.getMyBorrows
);

// GET /borrows/user/:userId (admin only) get borrow berdasarkan userId
router.get('/user/:userId',
  roleMiddleware(['admin']),
  param('userId').isInt().withMessage('Invalid user ID'),
  borrowController.getBorrowsByUserId
);

// GET /borrows/book/:bookId (admin only) get borrow berdasarkan bookId
router.get('/book/:bookId',
  roleMiddleware(['admin']),
  param('bookId').isInt().withMessage('Invalid book ID'),
  borrowController.getBorrowsByBookId
);

// GET /borrows/overdue (admin only) get borrow yang overdue
router.get('/overdue',
  roleMiddleware(['admin']),
  borrowController.getOverdueBorrows
);

// GET /borrows/:id (admin dan user) get borrow by id
router.get('/:id',
  roleMiddleware(['admin', 'user']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.getBorrowById
);

// POST /borrows (user only) create borrow baru
router.post('/',
  roleMiddleware(['user']),
  body('bookId').isInt({ gt: 0 }).withMessage('bookId must be a positive integer'),
  body('notes').optional().isString(),
  borrowController.createBorrow
);


// PUT /borrows/:id (admin only) update borrow by id
router.put('/:id',
  roleMiddleware(['admin']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.updateBorrow
);

// DELETE /borrows/:id (admin only) delete borrow by id
router.delete('/:id',
  roleMiddleware(['admin']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.deleteBorrow
);

export default router;
