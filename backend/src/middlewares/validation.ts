// middleware/validation.ts
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
export function validateBody(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value: unknown = req.body?.[rule.field];

      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required.`);
        continue; // Skip further checks for this field
      }

      // Only validate further if a value is present
      if (value !== undefined && value !== null && value !== '') {
        const strVal = String(value);

        if (rule.isEmail) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(strVal)) {
            errors.push(`${rule.field} must be a valid email address.`);
          }
        }

        if (rule.minLength !== undefined && strVal.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters.`);
        }

        if (rule.maxLength !== undefined && strVal.length > rule.maxLength) {
          errors.push(`${rule.field} must be no more than ${rule.maxLength} characters.`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: errors[0], // Return the first error (keeps response clean)
        errors,
      });
      return;
    }

    next();
  };
}

// Pre-built validators for auth routes
export const validateForgotPassword = validateBody([
  { field: 'email', required: true, isEmail: true, maxLength: 255 },
]);

export const validateResetPassword = validateBody([
  { field: 'token',       required: true, minLength: 64, maxLength: 64 },
  { field: 'newPassword', required: true, minLength: 8,  maxLength: 128 },
]);