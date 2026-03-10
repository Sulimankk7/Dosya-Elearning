/**
 * Generates a cryptographically secure reset token,
 * persists it to password_reset_tokens, and returns the raw token string.
 */
export declare function createResetToken(userId: string): Promise<string>;
/**
 * Validates a token and returns the associated user_id.
 * Throws if the token is invalid or expired.
 */
export declare function validateResetToken(token: string): Promise<string>;
/**
 * Deletes a token after it has been used or has expired.
 */
export declare function deleteResetToken(token: string): Promise<void>;
//# sourceMappingURL=token.service.d.ts.map