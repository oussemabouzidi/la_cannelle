import express from 'express';
import { serviceController } from '../controllers/serviceController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

export default router;

