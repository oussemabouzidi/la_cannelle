import express from 'express';
import { favoriteController } from '../controllers/favoriteController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:productId', favoriteController.removeFavorite);

export default router;
