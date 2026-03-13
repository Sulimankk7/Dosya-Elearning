import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (location.pathname === '/login') {
            return <>{children}</>;
        }
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirectUrl}&reason=auth_required`} replace />;
    }

    return <>{children}</>;
}
