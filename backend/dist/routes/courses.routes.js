"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_controller_1 = require("../controllers/courses.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', courses_controller_1.coursesController.list);
router.get('/:id', auth_middleware_1.optionalAuthMiddleware, courses_controller_1.coursesController.getDetail);
router.get('/:id/content', auth_middleware_1.authMiddleware, courses_controller_1.coursesController.getContent);
exports.default = router;
//# sourceMappingURL=courses.routes.js.map