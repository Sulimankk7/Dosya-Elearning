import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DosyaCard } from "../components/DosyaCard";
import { CourseCard } from "../components/CourseCard";
import { BookOpen, TrendingUp, Award, BookMarked, Menu } from "lucide-react";
import { enrollmentsApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { MyCoursesResponse } from "../../types/api";

export default function StudentDashboard() {
  const [data, setData] = useState<MyCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    enrollmentsApi.myCourses()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { icon: BookOpen, label: "الكورسات المسجلة", value: String(data.stats.enrolled_courses), color: "text-primary" },
    { icon: TrendingUp, label: "نسبة الإكمال", value: `${data.stats.completion_percentage}%`, color: "text-accent" },
    { icon: Award, label: "الشهادات المكتسبة", value: String(data.stats.certificates), color: "text-warning-amber" },
    { icon: BookMarked, label: "الدروس المكتملة", value: String(data.stats.completed_lessons), color: "text-primary" },
  ] : [];

  const showEmpty = data && data.courses.length === 0;

  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar
        type="student"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-primary">DOSYA</h2>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 md:p-8 flex-1">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">مرحباً، {user?.full_name || 'طالب'} 👋</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              استمر في التعلم وحقق أهدافك
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-lg animate-pulse h-24" />
              ))
            ) : (
              stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <DosyaCard key={index} className="hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </DosyaCard>
                );
              })
            )}
          </div>

          {/* My Courses Section */}
          <div className="mb-6">
            <h2 className="text-2xl mb-4">كورساتي</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-lg animate-pulse h-80" />
              ))}
            </div>
          ) : showEmpty ? (
            <DosyaCard className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl mb-2">لا توجد كورسات بعد</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                لم تسجل في أي كورس حتى الآن. ابدأ رحلتك التعليمية بتصفح الكورسات المتاحة
              </p>
              <a href="/courses" className="inline-block">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all">
                  تصفح الكورسات
                </button>
              </a>
            </DosyaCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
