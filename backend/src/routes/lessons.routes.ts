import { Router } from 'express';
import { lessonsController } from '../controllers/lessons.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:id', optionalAuthMiddleware, lessonsController.getDetail);
router.post('/:id/progress', authMiddleware, lessonsController.updateProgress);

export default router;
