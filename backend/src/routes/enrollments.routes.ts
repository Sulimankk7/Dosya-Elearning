import { Router } from 'express';
import { enrollmentsController } from '../controllers/enrollments.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/enroll', authMiddleware, enrollmentsController.enroll);
router.get('/my-courses', authMiddleware, enrollmentsController.myCourses);

export default router;
