import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// All admin routes require authentication + admin role
router.use(authMiddleware, roleMiddleware('admin', 'super_admin'));

router.get('/dashboard', adminController.dashboard);
router.get('/courses', adminController.listCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.get('/courses/:courseId/lessons', adminController.getLessonsByCourse);
router.post('/sections', adminController.createSection);
router.post('/lessons', adminController.createLesson);
router.put('/lessons/:id', adminController.updateLesson);
router.delete('/lessons/:id', adminController.deleteLesson);
router.post('/activation-codes', adminController.createActivationCode);

export default router;
