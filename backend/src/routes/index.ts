import { Router } from 'express';
import authRoutes from './auth.routes';
import coursesRoutes from './courses.routes';
import lessonsRoutes from './lessons.routes';
import enrollmentsRoutes from './enrollments.routes';
import activationCodesRoutes from './activation-codes.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin.routes';
import videoRoutes from './video.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/lessons', lessonsRoutes);
router.use('/enrollments', enrollmentsRoutes);
router.use('/activation-codes', activationCodesRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/video', videoRoutes);

export default router;
