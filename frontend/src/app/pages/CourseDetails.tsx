import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaButton } from "../components/DosyaButton";
import { BookOpen, Clock, Users, Star, CheckCircle, Lock, Play } from "lucide-react";
import { toast } from "sonner";
import { coursesApi } from "../../services/api";
import type { CourseDetailResponse } from "../../types/api";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const openLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  useEffect(() => {
    if (!id) return;
    coursesApi.getDetail(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar type="student" />
        <main className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-card rounded w-1/3" />
            <div className="h-48 bg-card rounded-2xl" />
            <div className="h-32 bg-card rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const { course, sections } = data;

  return (
    <div className="flex min-h-screen">
      <Sidebar type="student" />

      <main className="flex-1 p-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/courses" className="hover:text-foreground transition-colors">
              الكورسات
            </Link>
            <span>/</span>
            <span>{course.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=22C55E&color=fff&size=40`}
                    alt="Instructor"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">المدرب</p>
                    <p>{course.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span>{course.rating}</span>
                  <span className="text-muted-foreground text-sm">({course.rating_count.toLocaleString()} تقييم)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} طالب</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.lessons_count} درس</span>
                </div>
              </div>

              {/* What You'll Learn */}
              {course.what_you_learn && course.what_you_learn.length > 0 && (
                <DosyaCard className="mb-8">
                  <h3 className="text-xl mb-4">ما ستتعلمه</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.what_you_learn.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </DosyaCard>
              )}

              {/* Course Content */}
              <div>
                <h3 className="text-2xl mb-4">محتوى الكورس</h3>
                <div className="space-y-4">
                  {sections.map((section, sectionIndex) => (
                    <DosyaCard key={sectionIndex} className="section-card mb-4 border-0">
                      <h4 className="mb-4 text-xl font-bold">{section.title}</h4>
                      <div className="space-y-3">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className={`lesson-row lesson-item ${lesson.locked ? "lesson-locked" : "lesson-open"}`}
                            onClick={() => {
                              if (lesson.locked) {
                                toast("هذه الحصة متاحة بعد شراء الكورس");
                              } else {
                                openLesson(lesson.id);
                              }
                            }}
                          >
                            <div className="icon-container">
                              {lesson.locked ? (
                                <Lock className="w-5 h-5 text-muted-foreground lock-icon" />
                              ) : (
                                <Play className="w-5 h-5 text-primary play-icon" />
                              )}
                            </div>
                            <div className={`title-text ${!lesson.locked ? "text-white" : ""}`}>
                              {lesson.title}
                            </div>
                            <div className="duration-text">
                              {lesson.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DosyaCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <DosyaCard className="sticky top-8">
                <img
                  src={course.image}
                  alt="Course"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">السعر</p>
                  <p className="text-4xl text-primary mb-1">{course.price}</p>
                  {course.original_price && (
                    <p className="text-sm text-muted-foreground line-through">{course.original_price}</p>
                  )}
                </div>

                {data.enrolled ? (
                  <Link to={`/learn/${id}`}>
                    <DosyaButton className="w-full mb-4">
                      متابعة التعلم
                    </DosyaButton>
                  </Link>
                ) : (
                  <Link to={`/checkout/${id}`}>
                    <DosyaButton className="w-full mb-4">
                      سجل الآن
                    </DosyaButton>
                  </Link>
                )}

                <div className="space-y-3 pt-4 border-t border-border text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">الشهادة</span>
                    <span>متضمنة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">المستوى</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">اللغة</span>
                    <span>{course.language}</span>
                  </div>
                </div>
              </DosyaCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
