import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';

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
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('No token provided'));
    }

    try {
        const payload = verifyToken(token);
        req.user = {
            userId: payload.userId,
            roleName: payload.roleName,
        };
        next();
    } catch {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
        try {
            const payload = verifyToken(token);
            req.user = {
                userId: payload.userId,
                roleName: payload.roleName,
            };
        } catch {
            // Token invalid, continue without user
        }
    }
    next();
}
