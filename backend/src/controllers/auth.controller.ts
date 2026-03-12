// controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { authService } from '../services/auth.service';
import { supabase } from '../utils/supabaseClient';
import { sendPasswordResetEmail } from '../services/email.service';
import { createResetToken, validateResetToken, deleteResetToken } from '../services/token.service';
import { validatePassword } from "../utils/passwordValidator";
const BCRYPT_SALT_ROUNDS = 12;

const FORGOT_PASSWORD_RESPONSE = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent. Please check your inbox.',
};



export const authController = {

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { full_name, email, password } = req.body;

            const passwordError = validatePassword(password);

            if (passwordError) {
                return res.status(400).json({
                    success: false,
                    message: passwordError
                });
            }

            const result = await authService.register(full_name, email, password);

            // Set session data
            req.session.userId = result.user.id;
            req.session.user = {
                id: result.user.id,
                role: result.user.role,
                roleName: result.user.role,
                full_name: result.user.full_name,
                email: result.user.email,
                avatar_url: result.user.avatar_url,
            };

            res.status(201).json(result);

        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            // Set session data
            req.session.userId = result.user.id;
            req.session.user = {
                id: result.user.id,
                role: result.user.role,
                roleName: result.user.role,
                full_name: result.user.full_name,
                email: result.user.email,
                avatar_url: result.user.avatar_url,
            };

            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (req.session.user) {
                // Return safe fields from session
                return res.json({
                    id: req.session.user.id,
                    full_name: req.session.user.full_name,
                    email: req.session.user.email,
                    role: req.session.user.role,
                    avatar_url: req.session.user.avatar_url || '',
                });
            }

            // Fallback for older sessions without req.session.user
            const result = await authService.getCurrentUser(req.session.userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async logout(req: Request, res: Response, _next: NextFunction) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.clearCookie('connect.sid');
            res.json({ message: 'Logged out' });
        });
    },

    // ── Password Reset ───────────────────────────────────────────────────────

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const email = (req.body.email as string).toLowerCase().trim();
            console.log("[forgotPassword] email:", email);

            const { data: user, error } = await supabase
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

            const token = await createResetToken(user.id);
            console.log("[forgotPassword] token created:", token);

            try {
                await sendPasswordResetEmail({
                    toEmail: user.email,
                    resetToken: token
                });
                console.log("[forgotPassword] email sent to:", user.email);
            } catch (err) {
                console.error("[forgotPassword] email send failed:", err);
            }

            res.status(200).json(FORGOT_PASSWORD_RESPONSE);
        } catch (error) {
            next(error);
        }
    },
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body as { token: string; newPassword: string };

            // تحقق من طول كلمة المرور
            const passwordError = validatePassword(newPassword);

            if (passwordError) {
                return res.status(400).json({
                    success: false,
                    message: passwordError
                });
            }

            let userId: string;

            try {
                userId = await validateResetToken(token);
            } catch {
                res.status(400).json({
                    success: false,
                    message: "This password reset link is invalid or expired",
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    password_hash: hashedPassword,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (updateError) {
                throw new Error(`Failed to update password: ${updateError.message}`);
            }

            await deleteResetToken(token);

            res.status(200).json({
                success: true,
                message: 'Your password has been reset successfully. You can now log in.',
            });


        } catch (error) {
            next(error);
        }
    }

};