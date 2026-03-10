"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.routes.ts
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
const forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many password reset requests. Please try again in 15 minutes.',
    },
});
const resetPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many attempts. Please try again in 15 minutes.',
    },
});
// ── Auth routes ──────────────────────────────────────────────────────────────
router.post('/register', auth_controller_1.authController.register);
router.post('/login', auth_controller_1.authController.login);
router.get('/me', auth_controller_1.authController.me);
router.post('/logout', auth_controller_1.authController.logout);
// ── Password reset ───────────────────────────────────────────────────────────
router.post('/forgot-password', forgotPasswordLimiter, validation_1.validateForgotPassword, auth_controller_1.authController.forgotPassword);
router.post('/reset-password', resetPasswordLimiter, validation_1.validateResetPassword, auth_controller_1.authController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map