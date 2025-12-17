import express from 'express';
import { reportsController } from '../controllers/reportsController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/revenue', reportsController.getRevenueReport);
router.get('/popular-items', reportsController.getPopularItems);
router.get('/customers', reportsController.getCustomerAnalytics);

export default router;
