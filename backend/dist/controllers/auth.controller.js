"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_service_1 = require("../services/auth.service");
const supabaseClient_1 = require("../utils/supabaseClient");
const email_service_1 = require("../services/email.service");
const token_service_1 = require("../services/token.service");
const passwordValidator_1 = require("../utils/passwordValidator");
const BCRYPT_SALT_ROUNDS = 12;
const FORGOT_PASSWORD_RESPONSE = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent. Please check your inbox.',
};
exports.authController = {
    async register(req, res, next) {
        try {
            const { full_name, email, password } = req.body;
            const passwordError = (0, passwordValidator_1.validatePassword)(password);
            if (passwordError) {
                return res.status(400).json({
                    success: false,
                    message: passwordError
                });
            }
            const result = await auth_service_1.authService.register(full_name, email, password);
            // Set session data
            req.session.userId = result.user.id;
            req.session.user = {
                id: result.user.id,
                role: result.user.role,
                roleName: result.user.role,
                full_name: result.user.full_name,
                email: result.user.email,
            };
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            // Set session data
            req.session.userId = result.user.id;
            req.session.user = {
                id: result.user.id,
                role: result.user.role,
                roleName: result.user.role,
                full_name: result.user.full_name,
                email: result.user.email,
            };
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async me(req, res, next) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const result = await auth_service_1.authService.getCurrentUser(req.session.userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async logout(req, res, _next) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.clearCookie('connect.sid');
            res.json({ message: 'Logged out' });
        });
    },
    // ── Password Reset ───────────────────────────────────────────────────────
    async forgotPassword(req, res, next) {
        try {
            const email = req.body.email.toLowerCase().trim();
            console.log("[forgotPassword] email:", email);
            const { data: user, error } = await supabaseClient_1.supabase
                .from('users')
                .select('id, email')
                .eq('email', email)
                .maybeSingle();
            console.log("[forgotPassword] user:", user, "error:", error);
            if (error || !user) {
                console.log("[forgotPassword] user not found, returning generic response");
                res.status(200).json(FORGOT_PASSWORD_RESPONSE);
                return;
            }
            const token = await (0, token_service_1.createResetToken)(user.id);
            console.log("[forgotPassword] token created:", token);
            try {
                await (0, email_service_1.sendPasswordResetEmail)({
                    toEmail: user.email,
                    resetToken: token
                });
                console.log("[forgotPassword] email sent to:", user.email);
            }
            catch (err) {
                console.error("[forgotPassword] email send failed:", err);
            }
            res.status(200).json(FORGOT_PASSWORD_RESPONSE);
        }
        catch (error) {
            next(error);
        }
    },
    async resetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            // تحقق من طول كلمة المرور
            const passwordError = (0, passwordValidator_1.validatePassword)(newPassword);
            if (passwordError) {
                return res.status(400).json({
                    success: false,
                    message: passwordError
                });
            }
            let userId;
            try {
                userId = await (0, token_service_1.validateResetToken)(token);
            }
            catch {
                res.status(400).json({
                    success: false,
                    message: "This password reset link is invalid or expired",
                });
                return;
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, BCRYPT_SALT_ROUNDS);
            const { error: updateError } = await supabaseClient_1.supabase
                .from('users')
                .update({
                password_hash: hashedPassword,
                updated_at: new Date().toISOString()
            })
                .eq('id', userId);
            if (updateError) {
                throw new Error(`Failed to update password: ${updateError.message}`);
            }
            await (0, token_service_1.deleteResetToken)(token);
            res.status(200).json({
                success: true,
                message: 'Your password has been reset successfully. You can now log in.',
            });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=auth.controller.js.map