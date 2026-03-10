interface ResetEmailOptions {
    toEmail: string;
    resetToken: string;
}
/**
 * Sends a password reset email to the specified address using Resend API (HTTPS).
 */
export declare function sendPasswordResetEmail({ toEmail, resetToken, }: ResetEmailOptions): Promise<void>;
export {};
//# sourceMappingURL=email.service.d.ts.map