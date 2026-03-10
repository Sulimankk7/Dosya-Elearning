"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, profile_controller_1.profileController.getProfile);
router.put('/', auth_middleware_1.authMiddleware, profile_controller_1.profileController.updateProfile);
router.put('/password', auth_middleware_1.authMiddleware, profile_controller_1.profileController.changePassword);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map