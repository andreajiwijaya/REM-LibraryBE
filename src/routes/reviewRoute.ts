import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Admin only get all reviews (with pagination)
router.get('/', roleMiddleware(['admin']), reviewController.getAllReviews);

// Anyone can get reviews for a specific book (with pagination)
router.get('/book/:bookId', roleMiddleware(['admin', 'user']), reviewController.getReviewsByBookId);

// Get single review by id (admin or user)
router.get('/:id', roleMiddleware(['admin', 'user']), reviewController.getReviewById);

// User create review
router.post('/', roleMiddleware(['user']), reviewController.createReview);

// User update own review (authorization logic can be added in middleware or controller)
// For simplicity, allow 'user' role here
router.put('/:id', roleMiddleware(['user']), reviewController.updateReview);

// Admin delete review
router.delete('/:id', roleMiddleware(['admin']), reviewController.deleteReview);

export default router;
