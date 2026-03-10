"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// All admin routes require authentication + admin role
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)('admin', 'super_admin'));
router.get('/dashboard', admin_controller_1.adminController.dashboard);
router.get('/courses', admin_controller_1.adminController.listCourses);
router.post('/courses', admin_controller_1.adminController.createCourse);
router.put('/courses/:id', admin_controller_1.adminController.updateCourse);
router.delete('/courses/:id', admin_controller_1.adminController.deleteCourse);
router.get('/courses/:courseId/lessons', admin_controller_1.adminController.getLessonsByCourse);
router.post('/sections', admin_controller_1.adminController.createSection);
router.post('/lessons', admin_controller_1.adminController.createLesson);
router.put('/lessons/:id', admin_controller_1.adminController.updateLesson);
router.delete('/lessons/:id', admin_controller_1.adminController.deleteLesson);
router.post('/activation-codes', admin_controller_1.adminController.createActivationCode);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map