"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResetToken = createResetToken;
exports.validateResetToken = validateResetToken;
exports.deleteResetToken = deleteResetToken;
// services/tokenService.ts
const crypto_1 = __importDefault(require("crypto"));
const supabaseClient_1 = require("../utils/supabaseClient");
const TOKEN_EXPIRY_MINUTES = 30;
/**
 * Generates a cryptographically secure reset token,
 * persists it to password_reset_tokens, and returns the raw token string.
 */
async function createResetToken(userId) {
    // 1. Delete any existing tokens for this user (one active token at a time)
    await supabaseClient_1.supabase
        .from('password_reset_tokens')
        .delete()
        .eq('user_id', userId);
    // 2. Generate secure random token
    const rawToken = crypto_1.default.randomBytes(32).toString('hex'); // 64-char hex string
    // 3. Calculate expiry
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();
    // 4. Persist to database
    const { error } = await supabaseClient_1.supabase.from('password_reset_tokens').insert({
        user_id: userId,
        token: rawToken,
        expires_at: expiresAt,
    });
    if (error) {
        throw new Error(`Failed to store reset token: ${error.message}`);
    }
    return rawToken;
}
/**
 * Validates a token and returns the associated user_id.
 * Throws if the token is invalid or expired.
 */
async function validateResetToken(token) {
    const { data, error } = await supabaseClient_1.supabase
        .from('password_reset_tokens')
        .select('user_id, expires_at')
        .eq('token', token)
        .single();
    if (error || !data) {
        throw new Error('Invalid or expired password reset token.');
    }
    const isExpired = new Date(data.expires_at) < new Date();
    if (isExpired) {
        // Clean up expired token
        await deleteResetToken(token);
        throw new Error('Invalid or expired password reset token.');
    }
    return data.user_id;
}
/**
 * Deletes a token after it has been used or has expired.
 */
async function deleteResetToken(token) {
    await supabaseClient_1.supabase
        .from('password_reset_tokens')
        .delete()
        .eq('token', token);
}
//# sourceMappingURL=token.service.js.map