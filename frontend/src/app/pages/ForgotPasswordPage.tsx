import { useState } from "react";
import { Link } from "react-router-dom";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaInput } from "../components/DosyaInput";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { authApi } from "../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "فشل إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <DosyaCard>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl mb-2">تم إرسال الرابط</h2>
            <p className="text-muted-foreground mb-4">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
            </p>
            <p className="text-sm text-muted-foreground mb-6">{email}</p>
            <Link to="/login">
              <DosyaButton className="w-full">
                العودة لتسجيل الدخول
              </DosyaButton>
            </Link>
          </DosyaCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl text-primary mb-2">DOSYA</h1>
          </Link>
          <p className="text-muted-foreground">منصة التعلم الإلكتروني</p>
        </div>

        <DosyaCard>
          <h2 className="text-2xl mb-2 text-center">نسيت كلمة المرور؟</h2>
          <p className="text-muted-foreground text-center mb-6">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <DosyaInput
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <DosyaButton type="submit" className="w-full" disabled={loading}>
              <Mail className="w-4 h-4" />
              {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
            </DosyaButton>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              العودة لتسجيل الدخول
            </Link>
          </div>
        </DosyaCard>
      </div>
    </div>
  );
}
