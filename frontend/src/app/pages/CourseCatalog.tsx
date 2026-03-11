import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { CourseCard } from "../components/CourseCard";
import { Search, Filter, Menu } from "lucide-react";
import { coursesApi } from "../../services/api";
import type { CatalogCourse } from "../../types/api";

export default function CourseCatalog() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CatalogCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    coursesApi.list()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.includes(searchQuery) || course.description.includes(searchQuery)
  );

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">تصفح الكورسات</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              اكتشف كورسات جديدة وطور مهاراتك
            </p>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-lg animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
