export interface ActivationCodeRow {
    id: string;
    code: string;
    course_id: string;
    max_uses: number;
    used_count: number;
    expires_at: Date | null;
}
export declare const activationCodesRepository: {
    findByCode(code: string): Promise<ActivationCodeRow | null>;
    create(data: {
        code: string;
        course_id: string;
        max_uses?: number;
        expires_at?: Date;
    }): Promise<ActivationCodeRow>;
    incrementUsedCount(id: string): Promise<void>;
    findAll(): Promise<ActivationCodeRow[]>;
};
//# sourceMappingURL=activation-codes.repository.d.ts.map