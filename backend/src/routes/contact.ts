import { Router } from 'express';
import { sendContact } from '../controllers/contactController';

const router = Router();

router.post('/', sendContact);

export default router;
