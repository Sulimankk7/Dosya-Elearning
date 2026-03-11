import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Users, Award, Star, ArrowLeft,
  Zap, GraduationCap, ChevronRight,
  BarChart3, Menu, X
} from "lucide-react";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaCard } from "../components/DosyaCard";
import { coursesApi } from "../../services/api";
import type { CatalogCourse } from "../../types/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// ─────────────────────────────────────────────────────────────
// Small reusable pieces
// ─────────────────────────────────────────────────────────────

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Course card — uses CatalogCourse shape from courses.service.ts
// { id, title, description, price, image, instructor, duration, students }
// ─────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: CatalogCourse }) {
  const isFree = course.price === "مجاني";

  return (
    <DosyaCard className="overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300 p-0">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={
            course.image ||
            `https://placehold.co/480x270/0f172a/6366f1?text=${encodeURIComponent(course.title)}`
          }
          alt={course.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow ${isFree
              ? "bg-emerald-500 text-white"
              : "bg-primary text-primary-foreground"
            }`}
        >
          {course.price}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-base leading-snug line-clamp-2">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
            {course.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-t border-border pt-3">
          {course.instructor && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {course.instructor}
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.students > 0 && (
            <span className="flex items-center gap-1 mr-auto">
              <BarChart3 className="w-3 h-3" />
              {course.students.toLocaleString("ar-EG")} طالب
            </span>
          )}
        </div>

        <Link to={`/courses/${course.id}`}>
          <DosyaButton className="w-full" size="sm">
            عرض الكورس
          </DosyaButton>
        </Link>
      </div>
    </DosyaCard>
  );
}

// Skeleton loader — matches card height
function CourseCardSkeleton() {
  return (
    <DosyaCard className="overflow-hidden p-0 animate-pulse">
      <div className="h-44 bg-muted/40" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted/40 rounded w-3/4" />
        <div className="h-3 bg-muted/40 rounded w-full" />
        <div className="h-3 bg-muted/40 rounded w-5/6" />
        <div className="h-9 bg-muted/40 rounded mt-4" />
      </div>
    </DosyaCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Static data — only things that will never come from a DB
// ─────────────────────────────────────────────────────────────

const WHY_FEATURES = [
  {
    icon: Zap,
    title: "فهم أسرع للمادة",
    description:
      "كورسات مُصممة تراعي وقتك — تغطي أهم المفاهيم بدون حشو أو تطويل.",
  },
  {
    icon: BookOpen,
    title: "شرح مبسط بعيد عن التعقيد",
    description:
      "نشرح بأسلوب عربي مباشر يشعّرك إن في أحد يفسّرلك المادة بجانبك.",
  },
  {
    icon: GraduationCap,
    title: "مناسب لطلاب الجامعات",
    description:
      "محتوى مبني على مناهج الجامعات العربية — علامات أعلى في الاختبارات.",
  },
];

const TESTIMONIALS = [
  {
    name: "طالب – جامعة جدارا",
    comment:
      "نزلت المادة 96 الحمد لله، اعتمادي كان كامل على الدوسية وكانت مرتبة وواضحة.",
  },
  {
    name: "طالبة – جامعة جدارا",
    comment:
      "الدوسية ساعدتني أفهم المادة بدون ما أرجع للمحاضرات، الشرح سلس ومباشر.",
  },
  {
    name: "طالب – جامعة جدارا",
    comment: "جبت 95 بالبرمجة، الدوسية كانت السبب الرئيسي.",
  },
  {
    name: "طالبة – جامعة جدارا",
    comment: "أسلوب الشرح ممتاز خصوصًا لطلاب أول فصل، كل شيء واضح وبسيط.",
  },
  {
    name: "طالب – جامعة جدارا",
    comment: "وفّرت علي وقت وجهد كبير، واعتمدت عليها بالفينال بشكل كامل.",
  },
  {
    name: "طالب – جامعة جدارا",
    comment: "لو في برمجة 2 دوسية بنفس المستوى، أكيد راح أشتريها.",
  },
  {
    name: "طالبة – جامعة جدارا",
    comment: "جبت 83.5 بالمادة، والدوسية كانت داعم أساسي إلي.",
  },
  {
    name: "طالب – جامعة جدارا",
    comment: "الحلو إن الشرح ما فيه تطويل، كل معلومة بمكانها.",
  },
];

// ─────────────────────────────────────────────────────────────
// Section components
// ─────────────────────────────────────────────────────────────

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <h1 className="text-2xl text-primary font-bold">DOSYA</h1>
            <nav className="hidden md:flex gap-6">
              {[
                { href: "#features", label: "المميزات" },
                { href: "#courses", label: "الكورسات" },
                { href: "#testimonials", label: "آراء الطلاب" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <DosyaButton variant="ghost" size="sm">
                تسجيل الدخول
              </DosyaButton>
            </Link>
            <Link to="/register">
              <DosyaButton size="sm">إنشاء حساب</DosyaButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md absolute w-full px-4 py-4 flex flex-col gap-4 shadow-xl">
          <nav className="flex flex-col gap-2">
            {[
              { href: "#features", label: "المميزات" },
              { href: "#courses", label: "الكورسات" },
              { href: "#testimonials", label: "آراء الطلاب" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors text-base py-2 border-b border-border/50"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <DosyaButton variant="outline" className="w-full justify-center min-h-[44px]">
                تسجيل الدخول
              </DosyaButton>
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <DosyaButton className="w-full justify-center min-h-[44px]">إنشاء حساب</DosyaButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Text — RTL right side */}
        <div className="space-y-6 md:space-y-7 text-right" dir="rtl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20">
            <Star className="w-3.5 h-3.5 fill-primary" />
            DOSYA
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            تعلم البرمجة{" "}
            <span className="text-primary">والمواد الجامعية</span>{" "}
            بطريقة أسهل
          </h1>



          <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:justify-end">
            <Link to="/courses" className="w-full sm:w-auto">
              <DosyaButton size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 min-h-[48px]">
                تصفح الكورسات
                <ArrowLeft className="w-5 h-5" />
              </DosyaButton>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <DosyaButton variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px]">
                ابدأ الآن
              </DosyaButton>
            </Link>
          </div>
        </div>

        {/* Platform preview card */}
        <div className="flex justify-center order-first lg:order-last">
          <div className="relative w-full max-w-[280px] sm:max-w-sm">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl scale-95" />
            <DosyaCard className="relative space-y-5">
              {/* Window dots */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              {/* Course preview mock */}
              <div className="bg-primary/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-primary/30 rounded w-3/4" />
                    <div className="h-2 bg-primary/20 rounded w-1/2" />
                  </div>
                </div>
                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>التقدم في الكورس</span>
                    <span className="text-primary font-bold">68%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-primary rounded-full" />
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "درس", value: "24" },
                  { label: "ساعة", value: "12" },
                  { label: "نقطة", value: "580" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-background rounded-xl p-3 text-center"
                  >
                    <p className="font-extrabold text-lg">{s.value}</p>
                    <p className="text-muted-foreground text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Achievement */}
              <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-sm font-bold">إنجاز جديد!</p>
                  <p className="text-muted-foreground text-xs">
                    أكملت الوحدة الأولى
                  </p>
                </div>
              </div>
            </DosyaCard>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Featured Courses — fetched from GET /api/courses ─────────────────────────

function CoursesSection() {
  const [courses, setCourses] = useState<CatalogCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    coursesApi
      .list()
      .then((data) => setCourses(data.slice(0, 6))) // show max 6 on landing
      .catch(() => setError("تعذّر تحميل الكورسات"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="courses" className="container mx-auto px-6 py-20">
      <SectionHeading
        title="الكورسات المتوفرة"
        subtitle="اختر من بين كورسات مصممة خصيصاً لطلاب الجامعات"
      />

      {error && (
        <p className="text-center text-muted-foreground py-12">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))
          : courses.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>

      {!loading && !error && courses.length > 0 && (
        <div className="mt-10 text-center">
          <Link to="/courses">
            <DosyaButton variant="outline" size="lg" className="gap-2">
              عرض جميع الكورسات
              <ChevronRight className="w-4 h-4" />
            </DosyaButton>
          </Link>
        </div>
      )}
    </section>
  );
}

// ── Why DOSYA ─────────────────────────────────────────────────────────────────

function WhySection() {
  return (
    <section id="features" className="bg-card/30">
      <div className="container mx-auto px-6 py-20">
        <SectionHeading
          title="ليش  DOSYA ؟"
          subtitle="نفهم تحديات الطالب الجامعي ونقدم الحل الأمثل"
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {WHY_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <DosyaCard
                key={f.title}
                glass
                className="group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </DosyaCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section id="testimonials" className="container mx-auto px-6 py-20">
      <SectionHeading
        title="آراء الطلاب"
        subtitle="تجارب حقيقية من طلاب استخدموا الدوسية"
      />

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={9000}
        loop
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <SwiperSlide key={i}>
            <DosyaCard glass className="h-full">
              <StarRating />

              <p className="text-muted-foreground my-4 text-sm leading-relaxed">
                "{t.comment}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name[0]}
                </div>

                <p className="font-semibold text-sm">{t.name}</p>
              </div>
            </DosyaCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="container mx-auto px-6 py-20">
      <DosyaCard className="text-center bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          منصتنا للدوسيات الورقية         </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          فوت و تصفح محتوى الدوسات
        </p>
        <Link to="https://dosyanew-production.up.railway.app/">
          <DosyaButton size="lg" className="gap-2">
            احصل على دوسية
            <ArrowLeft className="w-5 h-5" />
          </DosyaButton>
        </Link>
      </DosyaCard>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/50 mt-10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8" dir="rtl">
          <div>
            <h3 className="text-xl text-primary font-bold mb-3">DOSYA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة تعليمية تساعد طلاب الجامعات على الفهم السريع وتحقيق نتائج
              أفضل.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/courses" className="hover:text-foreground transition-colors">
                  الكورسات
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  إنشاء حساب
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  مركز المساعدة
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">قانوني</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {year} DOSYA. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// LandingPage — default export
// ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <HeroSection />
      <WhySection />
      <CoursesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}