export declare const profileService: {
    getProfile(userId: string): Promise<{
        id: string;
        full_name: string;
        email: string;
        phone: string;
        bio: string;
        avatar_url: string | null;
        role: string;
    }>;
    updateProfile(userId: string, data: {
        full_name?: string;
    }): Promise<{
        id: string;
        full_name: string;
        email: string;
        phone: string;
        bio: string;
        avatar_url: string | null;
        role: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=profile.service.d.ts.map