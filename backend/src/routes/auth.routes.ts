// routes/auth.routes.ts
import { Router, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/auth.controller';
import { validateForgotPassword, validateResetPassword } from '../middlewares/validation';

const router = Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again in 15 minutes.',
  },
}) as unknown as RequestHandler;

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again in 15 minutes.',
  },
}) as unknown as RequestHandler;

// ── Auth routes ──────────────────────────────────────────────────────────────
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/logout', authController.logout);

// ── Password reset ───────────────────────────────────────────────────────────
router.post('/forgot-password', forgotPasswordLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', resetPasswordLimiter, validateResetPassword, authController.resetPassword);



export default router;