export declare const authService: {
    register(fullName: string, email: string, password: string): Promise<{
        user: {
            id: string;
            full_name: string;
            email: string;
            role: string;
            avatar_url: string | null;
        };
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            full_name: string;
            email: string;
            role: string;
            avatar_url: string | null;
        };
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        full_name: string;
        email: string;
        role: string;
        avatar_url: string | null;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map