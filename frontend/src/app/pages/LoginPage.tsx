import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaInput } from "../components/DosyaInput";
import { Mail, Lock, Chrome } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "admin" || user.role === "super_admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const redirectParams = searchParams.get('redirect');
  const reason = searchParams.get('reason');

  const isSafeRedirect = (url: string | null) => url && url.startsWith('/');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      // isSafeRedirect check prevents open redirects
      if (isSafeRedirect(redirectParams)) {
        navigate(redirectParams as string, { replace: true });
      } else if (user.role === "admin" || user.role === "super_admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl md:text-4xl text-primary mb-2">DOSYA</h1>
          </Link>
          <p className="text-sm md:text-base text-muted-foreground">منصة التعلم الإلكتروني</p>
        </div>

        <DosyaCard>
          <h2 className="text-xl md:text-2xl mb-2 text-center">تسجيل الدخول</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-6">
            مرحباً بعودتك! سجل دخولك للمتابعة
          </p>

          {reason === 'auth_required' && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm text-center font-medium">
              يجب تسجيل الدخول للوصول إلى هذه الصفحة.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <DosyaInput
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <DosyaInput
              type="password"
              label="كلمة المرور"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-left">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <DosyaButton type="submit" className="w-full" disabled={loading}>
              <Lock className="w-4 h-4" />
              {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
            </DosyaButton>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">أو</span>
            <div className="flex-1 h-px bg-border" />
          </div>



          <p className="text-center text-sm text-muted-foreground mt-6">
            ليس لديك حساب؟{" "}
            <Link to={`/register${redirectParams ? `?redirect=${encodeURIComponent(redirectParams)}` : ''}`} className="text-primary hover:underline">
              سجل الآن
            </Link>
          </p>
        </DosyaCard>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
