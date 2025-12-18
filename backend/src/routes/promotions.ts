import express from 'express';
import { promotionController } from '../controllers/promotionController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Admin send promotions
router.use(authenticate);
router.use(requireAdmin);
router.post('/', promotionController.send);
router.get('/', promotionController.getAll);

// Client fetch their promotions (no admin)
router.get('/mine', promotionController.getForUser);

export default router;
