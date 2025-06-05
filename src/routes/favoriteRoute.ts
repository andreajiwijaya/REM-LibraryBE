import { Router } from 'express';
import * as favoriteController from '../controllers/favoriteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Mendapatkan favorit user tertentu dengan pagination
router.get('/user/:userId', roleMiddleware(['admin', 'user']), favoriteController.getUserFavorites);

// Tambah buku ke favorit user
router.post('/', roleMiddleware(['user']), favoriteController.createFavorite);

// Hapus favorite berdasarkan id favorite
router.delete('/:id', roleMiddleware(['user', 'admin']), favoriteController.deleteFavorite);

// Cek apakah buku sudah difavoritkan user
router.get('/check/:userId/:bookId', roleMiddleware(['admin', 'user']), favoriteController.checkFavoriteStatus);

// Hitung jumlah favorit sebuah buku
router.get('/count/:bookId', roleMiddleware(['admin', 'user']), favoriteController.getFavoriteCountByBook);

export default router;
