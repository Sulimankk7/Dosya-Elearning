"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lessons_controller_1 = require("../controllers/lessons.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:id', auth_middleware_1.optionalAuthMiddleware, lessons_controller_1.lessonsController.getDetail);
router.post('/:id/progress', auth_middleware_1.authMiddleware, lessons_controller_1.lessonsController.updateProgress);
exports.default = router;
//# sourceMappingURL=lessons.routes.js.map