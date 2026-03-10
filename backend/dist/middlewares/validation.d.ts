import { Request, Response, NextFunction } from 'express';
type ValidationRule = {
    field: string;
    required?: boolean;
    isEmail?: boolean;
    minLength?: number;
    maxLength?: number;
};
/**
 * Factory that returns an Express middleware validating req.body
 * against a set of simple rules.
 */
export declare function validateBody(rules: ValidationRule[]): (req: Request, res: Response, next: NextFunction) => void;
export declare const validateForgotPassword: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateResetPassword: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validation.d.ts.map