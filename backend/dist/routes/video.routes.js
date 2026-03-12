"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:lessonId', auth_middleware_1.authMiddleware, video_controller_1.videoController.getSas);
exports.default = router;
//# sourceMappingURL=video.routes.js.map