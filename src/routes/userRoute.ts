import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Hanya admin boleh lihat, ubah, hapus user
router.get('/', roleMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', roleMiddleware(['admin']), userController.getUserById);
router.post('/', roleMiddleware(['admin']), userController.createUser);
router.put('/:id', roleMiddleware(['admin']), userController.updateUser);
router.delete('/:id', roleMiddleware(['admin']), userController.deleteUser);

export default router;
