import { Router } from 'express';
import { videoController } from '../controllers/video.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:lessonId', authMiddleware, videoController.getSas);

export default router;
