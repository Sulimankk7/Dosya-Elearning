"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollments_controller_1 = require("../controllers/enrollments.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/enroll', auth_middleware_1.authMiddleware, enrollments_controller_1.enrollmentsController.enroll);
router.get('/my-courses', auth_middleware_1.authMiddleware, enrollments_controller_1.enrollmentsController.myCourses);
exports.default = router;
//# sourceMappingURL=enrollments.routes.js.map