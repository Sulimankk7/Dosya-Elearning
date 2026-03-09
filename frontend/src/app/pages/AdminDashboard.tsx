import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DosyaCard } from "../components/DosyaCard";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";
import { adminApi } from "../../services/api";
import type { AdminDashboardResponse } from "../../types/api";

const iconMap: Record<string, any> = {
  "إجمالي الكورسات": BookOpen,
  "إجمالي الطلاب": Users,
  "الإيرادات": DollarSign,
  "معدل النمو": TrendingUp,
};

const colorMap: Record<string, string> = {
  "إجمالي الكورسات": "text-primary",
  "إجمالي الطلاب": "text-accent",
  "الإيرادات": "text-primary",
  "معدل النمو": "text-warning-amber",
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.dashboard(),
      adminApi.listCourses(),
    ]).then(([dashData, courses]) => {
      setData(dashData);
      setRecentCourses(courses.slice(0, 4).map((c) => ({
        name: c.title,
        students: c.students_count,
        revenue: c.price,
        status: c.is_published === true ? 'نشط' : 'غير نشط',
      })));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || [];

  return (
    <div className="flex min-h-screen">
      <Sidebar type="admin" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">لوحة تحكم المدير</h1>
          <p className="text-muted-foreground text-lg">نظرة عامة على المنصة</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-lg animate-pulse h-28" />
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = iconMap[stat.label] || BookOpen;
              const color = colorMap[stat.label] || "text-primary";
              return (
                <DosyaCard key={index} className="hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-primary">{stat.change}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl">{stat.value}</p>
                </DosyaCard>
              );
            })
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <DosyaCard>
            <h3 className="text-xl mb-4">الكورسات الأخيرة</h3>
            <div className="space-y-3">
              {recentCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-all">
                  <div className="flex-1">
                    <p className="mb-1">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.students} طالب</p>
                  </div>
                  <div className="text-left">
                    <p className="text-primary mb-1">{course.revenue}</p>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {course.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DosyaCard>

          {/* Quick Actions */}
          <DosyaCard>
            <h3 className="text-xl mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all text-right">
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <p className="mb-1" >إضافة كورس جديد</p>
                <p className="text-sm text-muted-foreground">إنشاء كورس جديد</p>
              </button>
              <button className="p-4 bg-accent/10 rounded-xl hover:bg-accent/20 transition-all text-right">
                <Users className="w-8 h-8 text-accent mb-2" />
                <p className="mb-1">إدارة الطلاب</p>
                <p className="text-sm text-muted-foreground">عرض قائمة الطلاب</p>
              </button>
              <button className="p-4 bg-warning-amber/10 rounded-xl hover:bg-warning-amber/20 transition-all text-right">
                <TrendingUp className="w-8 h-8 text-warning-amber mb-2" />
                <p className="mb-1">التقارير</p>
                <p className="text-sm text-muted-foreground">عرض الإحصائيات</p>
              </button>
              <button className="p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all text-right">
                <DollarSign className="w-8 h-8 text-primary mb-2" />
                <p className="mb-1">الإيرادات</p>
                <p className="text-sm text-muted-foreground">تفاصيل المبيعات</p>
              </button>
            </div>
          </DosyaCard>
        </div>
      </main>
    </div>
  );
}
