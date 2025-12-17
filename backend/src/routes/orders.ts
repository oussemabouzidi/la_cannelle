import express from 'express';
import { orderController } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create order (client or guest)
router.post('/', orderController.createOrder);

// Get orders (filtered by user role)
router.get('/', orderController.getOrders);

// Get single order
router.get('/:id', orderController.getOrderById);

// Update order status (admin only)
router.patch('/:id/status', requireAdmin, orderController.updateOrderStatus);

// Update payment status (admin only)
router.patch('/:id/payment', requireAdmin, orderController.updatePaymentStatus);

export default router;
