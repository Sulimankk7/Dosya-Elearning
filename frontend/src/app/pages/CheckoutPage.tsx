import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaInput } from "../components/DosyaInput";
import { CheckCircle, XCircle, ArrowLeft, Ticket } from "lucide-react";
import { coursesApi, activationCodesApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { CourseDetailResponse } from "../../types/api";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activationCode, setActivationCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [courseData, setCourseData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id) return;
    coursesApi.getDetail(id)
      .then(setCourseData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const course = courseData?.course;

  const handleActivate = async () => {
    if (!activationCode.trim()) return;
    setProcessing(true);
    try {
      await activationCodesApi.redeem(activationCode);
      setResult("success");
    } catch (err) {
      console.error(err);
      setResult("fail");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري تحميل...</div>
      </div>
    );
  }

  if (result === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <DosyaCard className="max-w-md text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl mb-4">تم التفعيل بنجاح! 🎉</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            تم تفعيل الكورس بنجاح. يمكنك البدء في التعلم الآن!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/learn/${id}`}>
              <DosyaButton>ابدأ التعلم الآن</DosyaButton>
            </Link>
            <Link to="/dashboard">
              <DosyaButton variant="outline">لوحة التحكم</DosyaButton>
            </Link>
          </div>
        </DosyaCard>
      </div>
    );
  }

  if (result === "fail") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <DosyaCard className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-3xl mb-4">كود غير صالح</h2>
          <p className="text-muted-foreground mb-6">
            الكود الذي أدخلته غير صحيح أو منتهي الصلاحية. يرجى التحقق والمحاولة مرة أخرى.
          </p>
          <div className="flex gap-4 justify-center">
            <DosyaButton onClick={() => setResult(null)}>حاول مرة أخرى</DosyaButton>
            <Link to="/courses">
              <DosyaButton variant="outline">تصفح الكورسات</DosyaButton>
            </Link>
          </div>
        </DosyaCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/courses/${id}`} className="flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            العودة لتفاصيل الكورس
          </Link>
          <h1 className="text-3xl md:text-4xl mb-2">تفعيل الكورس</h1>
          <p className="text-base md:text-lg text-muted-foreground">أدخل كود التفعيل للوصول إلى الكورس</p>
        </div>

        {/* Course Summary */}
        {course && (
          <DosyaCard className="mb-6">
            <div className="flex gap-4 items-center">
              <img
                src={course.image}
                alt={course.title}
                className="w-20 h-14 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium mb-1">{course.title}</p>
                <p className="text-sm text-muted-foreground">{course.instructor}</p>
              </div>
            </div>
          </DosyaCard>
        )}

        {/* Activation Code */}
        <DosyaCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl">كود التفعيل</h3>
          </div>

          <div className="space-y-4">
            <DosyaInput
              label="أدخل الكود"
              placeholder="DOSYA-XXXXXXXX"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleActivate()}
            />
            <DosyaButton
              className="w-full"
              onClick={handleActivate}
              disabled={!activationCode.trim() || processing}
            >
              {processing ? "جاري التحقق..." : "تفعيل الكورس"}
            </DosyaButton>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            لا تملك كود تفعيل؟{" "}
            <Link to="https://wa.me/+962789425056" className="text-primary hover:underline">
              تواصل معنا
            </Link>
          </p>
        </DosyaCard>
      </div>
    </div>
  );
}