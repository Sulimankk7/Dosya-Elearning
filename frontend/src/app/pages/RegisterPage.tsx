import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaInput } from "../components/DosyaInput";
import { User, Mail, Lock, Chrome } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "فشل إنشاء الحساب");
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
          <h2 className="text-xl md:text-2xl mb-2 text-center">إنشاء حساب جديد</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-6">
            ابدأ رحلتك التعليمية اليوم
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <DosyaInput
              type="text"
              label="الاسم الكامل"
              placeholder="أحمد محمد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            <DosyaInput
              type="password"
              label="تأكيد كلمة المرور"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <DosyaButton type="submit" className="w-full" disabled={loading}>
              <User className="w-4 h-4" />
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </DosyaButton>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">أو</span>
            <div className="flex-1 h-px bg-border" />
          </div>



          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary hover:underline">
              سجل الدخول
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
