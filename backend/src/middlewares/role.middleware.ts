import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

export function roleMiddleware(...allowedRoles: string[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new ForbiddenError('Access denied'));
        }

        if (!allowedRoles.includes(req.user.roleName)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    };
}
