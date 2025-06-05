import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as borrowController from '../controllers/borrowController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/',
  roleMiddleware(['admin']),
  query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ gt: 0 }).withMessage('Limit must be a positive integer'),
  borrowController.getAllBorrows
);

router.get('/my',
  roleMiddleware(['user']),
  borrowController.getMyBorrows
);

router.get('/user/:userId',
  roleMiddleware(['admin']),
  param('userId').isInt().withMessage('Invalid user ID'),
  borrowController.getBorrowsByUserId
);

router.get('/book/:bookId',
  roleMiddleware(['admin']),
  param('bookId').isInt().withMessage('Invalid book ID'),
  borrowController.getBorrowsByBookId
);

router.get('/overdue',
  roleMiddleware(['admin']),
  borrowController.getOverdueBorrows
);

router.get('/:id',
  roleMiddleware(['admin', 'user']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.getBorrowById
);

router.post('/',
  roleMiddleware(['user']),
  body('bookId').isInt({ gt: 0 }).withMessage('bookId must be a positive integer'),
  body('returnDate').optional().isISO8601().toDate().withMessage('returnDate must be a valid date'),
  borrowController.createBorrow
);

router.put('/:id/return',
  roleMiddleware(['user']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.returnBorrow
);

router.put('/:id',
  roleMiddleware(['admin']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.updateBorrow
);

router.delete('/:id',
  roleMiddleware(['admin']),
  param('id').isInt().withMessage('Invalid borrow ID'),
  borrowController.deleteBorrow
);

export default router;
