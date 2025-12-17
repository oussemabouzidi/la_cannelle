import express from 'express';
import { customerController } from '../controllers/customerController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);

export default router;
