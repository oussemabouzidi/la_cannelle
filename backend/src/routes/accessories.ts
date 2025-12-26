import express from 'express';
import { accessoryController } from '../controllers/accessoryController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', accessoryController.getAccessories);
router.get('/:id', accessoryController.getAccessoryById);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.post('/', accessoryController.createAccessory);
router.put('/:id', accessoryController.updateAccessory);
router.delete('/:id', accessoryController.deleteAccessory);

export default router;

