import express from 'express';
import { menuController } from '../controllers/menuController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', menuController.getMenus);
router.get('/:id', menuController.getMenuById);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.post('/', menuController.createMenu);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

export default router;
