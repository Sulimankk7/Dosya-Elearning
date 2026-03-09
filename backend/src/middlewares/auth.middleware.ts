import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                roleName: string;
            };
        }
    }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session || !req.session.userId) {
        return next(new UnauthorizedError('No active session'));
    }

    // Populate req.user from session for compatibility with existing middleware (e.g. role.middleware)
    req.user = {
        userId: req.session.userId,
        roleName: req.session.user?.roleName || req.session.user?.role || 'student',
    };

    next();
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
    if (req.session && req.session.userId) {
        req.user = {
            userId: req.session.userId,
            roleName: req.session.user?.roleName || req.session.user?.role || 'student',
        };
    }
    next();
}
