import 'express-session';

declare module 'express-session' {
    interface SessionData {
        userId: string;
        user: {
            id: string;
            role: string;
            roleName: string;
            full_name: string;
            email: string;
            avatar_url?: string | null;
        };
    }
}
