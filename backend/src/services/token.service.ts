// services/tokenService.ts
import crypto from 'crypto';
import { supabase } from '../utils/supabaseClient';

const TOKEN_EXPIRY_MINUTES = 30;

/**
 * Generates a cryptographically secure reset token,
 * persists it to password_reset_tokens, and returns the raw token string.
 */
export async function createResetToken(userId: string): Promise<string> {
  // 1. Delete any existing tokens for this user (one active token at a time)
  await supabase
    .from('password_reset_tokens')
    .delete()
    .eq('user_id', userId);

  // 2. Generate secure random token
  const rawToken = crypto.randomBytes(32).toString('hex'); // 64-char hex string

  // 3. Calculate expiry
  const expiresAt = new Date(
    Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000
  ).toISOString();

  // 4. Persist to database
  const { error } = await supabase.from('password_reset_tokens').insert({
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
export async function validateResetToken(token: string): Promise<string> {
  const { data, error } = await supabase
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

  return data.user_id as string;
}

/**
 * Deletes a token after it has been used or has expired.
 */
export async function deleteResetToken(token: string): Promise<void> {
  await supabase
    .from('password_reset_tokens')
    .delete()
    .eq('token', token);
}