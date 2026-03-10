export interface UserRow {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    avatar_url: string | null;
    role_id: string | null;
    role_name?: string;
}
export declare const usersRepository: {
    findByEmail(email: string): Promise<UserRow | null>;
    findById(id: string): Promise<UserRow | null>;
    create(fullName: string, email: string, hashedPassword: string): Promise<UserRow>;
    updateProfile(id: string, data: {
        full_name?: string;
    }): Promise<UserRow | null>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    countAll(): Promise<number>;
};
//# sourceMappingURL=users.repository.d.ts.map