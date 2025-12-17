import express from 'express';
import { systemController } from '../controllers/systemController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public route to check system status (for order page)
router.get('/status', systemController.getSystemStatus);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.put('/status', systemController.updateSystemStatus);
router.get('/closed-dates', systemController.getClosedDates);
router.post('/closed-dates', systemController.createClosedDate);
router.delete('/closed-dates/:id', systemController.deleteClosedDate);

export default router;
