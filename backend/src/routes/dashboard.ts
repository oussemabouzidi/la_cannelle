import express from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', dashboardController.getDashboard);

export default router;
