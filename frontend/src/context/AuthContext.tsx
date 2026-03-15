import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, AUTH_EVENTS } from '../services/api';
import type { AuthUser } from '../types/api';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AuthUser>;
    register: (full_name: string, email: string, password: string) => Promise<AuthUser>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On app load: check if JWT token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }
        authApi.me()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Listen for global 401 unauthorized events to wipe state
    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
        };
        window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
        return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (full_name: string, email: string, password: string) => {
        const data = await authApi.register(full_name, email, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await authApi.logout();
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
