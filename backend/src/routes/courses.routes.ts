import { Router } from 'express';
import { coursesController } from '../controllers/courses.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', coursesController.list);
router.get('/:id', optionalAuthMiddleware, coursesController.getDetail);
router.get('/:id/content', authMiddleware, coursesController.getContent);

export default router;
