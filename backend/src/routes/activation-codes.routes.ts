import { Router } from 'express';
import { activationCodesController } from '../controllers/activation-codes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/redeem', authMiddleware, activationCodesController.redeem);

export default router;
