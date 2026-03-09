import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { CourseCard } from "../components/CourseCard";
import { Search, Filter } from "lucide-react";
import { coursesApi } from "../../services/api";
import type { CatalogCourse } from "../../types/api";

export default function CourseCatalog() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CatalogCourse[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="flex min-h-screen">
      <Sidebar type="student" />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">تصفح الكورسات</h1>
          <p className="text-muted-foreground text-lg">
            اكتشف كورسات جديدة وطور مهاراتك
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-lg animate-pulse h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
