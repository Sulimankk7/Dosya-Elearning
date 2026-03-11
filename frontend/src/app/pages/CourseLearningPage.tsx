import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaCard } from "../components/DosyaCard";
import { StatusBadge } from "../components/StatusBadge";
import { ChevronDown, ChevronUp, CheckCircle, Lock, Play, ArrowLeft, Menu, BookOpen } from "lucide-react";
import { coursesApi, lessonsApi } from "../../services/api";
import type { CourseContentResponse, LessonDetail } from "../../types/api";

export default function CourseLearningPage() {
  const { id } = useParams();
  const [data, setData] = useState<CourseContentResponse | null>(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [expandedSection, setExpandedSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Lesson detail (video_url + description come from GET /lessons/:id)
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  // ── Load course content ───────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    coursesApi.getContent(id)
      .then((res) => {
        setData(res);
        // Auto-load the first lesson
        const firstLesson = res.sections[0]?.lessons[0];
        if (firstLesson) fetchLessonDetail(firstLesson.id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ── Fetch lesson detail whenever selection changes ────────────
  const fetchLessonDetail = async (lessonId: string) => {
    setLessonDetail(null);
    setLessonLoading(true);
    try {
      const detail = await lessonsApi.getDetail(lessonId);
      setLessonDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setLessonLoading(false);
    }
  };

  const selectLesson = (sectionIdx: number, lessonIdx: number) => {
    setCurrentSectionIdx(sectionIdx);
    setCurrentLessonIdx(lessonIdx);
    const lesson = data?.sections[sectionIdx]?.lessons[lessonIdx];
    if (lesson) fetchLessonDetail(lesson.id);
  };

  // ── Next lesson logic ─────────────────────────────────────────
  const handleNextLesson = () => {
    if (!data) return;
    const currentSection = data.sections[currentSectionIdx];

    // Next lesson in same section
    if (currentLessonIdx < currentSection.lessons.length - 1) {
      selectLesson(currentSectionIdx, currentLessonIdx + 1);
      return;
    }

    // First lesson in next section
    if (currentSectionIdx < data.sections.length - 1) {
      selectLesson(currentSectionIdx + 1, 0);
      setExpandedSection(currentSectionIdx + 1);
      return;
    }
    // Already at last lesson — nothing to do
  };

  const isLastLesson = data
    ? currentSectionIdx === data.sections.length - 1 &&
    currentLessonIdx === data.sections[currentSectionIdx]?.lessons.length - 1
    : false;

  // ── Mark complete ─────────────────────────────────────────────
  const handleMarkComplete = async () => {
    if (!currentLessonData) return;
    try {
      await lessonsApi.updateProgress(currentLessonData.id, { completed: true });
      const updated = await coursesApi.getContent(id!);
      setData(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Loading state ─────────────────────────────────────────────
  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري تحميل محتوى الكورس...</div>
      </div>
    );
  }

  const { course, sections, overall_progress, completed_lessons, total_lessons } = data;
  const currentSection = sections[currentSectionIdx];
  const currentLessonData = currentSection?.lessons[currentLessonIdx] || sections[0]?.lessons[0];
  const courseCompleted = overall_progress === 100;

  // ── Course completed screen ───────────────────────────────────
  if (courseCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <DosyaCard className="max-w-2xl text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl mb-4">مبروك! أكملت الكورس 🎉</h1>
          <p className="text-lg text-muted-foreground mb-8">
            أحسنت! لقد أنهيت جميع دروس كورس {course.title} بنجاح
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <DosyaCard className="bg-primary/5 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">الدروس المكتملة</p>
              <p className="text-2xl">{total_lessons}/{total_lessons}</p>
            </DosyaCard>
            <DosyaCard className="bg-primary/5 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">نسبة الإكمال</p>
              <p className="text-2xl">100%</p>
            </DosyaCard>
            <DosyaCard className="bg-primary/5 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">الوقت المستغرق</p>
              <p className="text-2xl">--.--</p>
            </DosyaCard>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/dashboard">
              <DosyaButton variant="outline">لوحة التحكم</DosyaButton>
            </Link>
          </div>
        </DosyaCard>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-xl transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">العودة</span>
            </Link>
            <div>
              <h2 className="text-lg">{course.title}</h2>
              <p className="text-sm text-muted-foreground">{course.instructor}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-left">
              <p className="text-sm text-muted-foreground">التقدم الإجمالي</p>
              <p className="text-sm">{completed_lessons} من {total_lessons} درس</p>
            </div>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${overall_progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">

            {/* Video Player — passes real video_url from lesson detail */}
            {lessonLoading ? (
              <div className="aspect-video w-full rounded-2xl bg-secondary/40 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">جاري تحميل الفيديو...</div>
              </div>
            ) : (
              <VideoPlayer
                lessonId={lessonDetail?.id}
                thumbnail={course.image}
                locked={currentLessonData?.locked}
              />
            )}

            {/* Lesson Info */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl">{currentLessonData?.title}</h1>
                <StatusBadge status={currentLessonData?.completed ? "completed" : "active"}>
                  {currentLessonData?.completed ? "مكتمل" : "جاري"}
                </StatusBadge>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                {!currentLessonData?.completed && (
                  <DosyaButton onClick={handleMarkComplete}>
                    <CheckCircle className="w-5 h-5" />
                    تحديد كمكتمل
                  </DosyaButton>
                )}
                {!isLastLesson && (
                  <DosyaButton variant="outline" onClick={handleNextLesson}>
                    الدرس التالي
                    <ArrowLeft className="w-5 h-5" />
                  </DosyaButton>
                )}
              </div>
            </div>

            {/* Lesson Summary — replaces static Resources section */}
            <DosyaCard className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl">ملخص الدرس</h3>
              </div>

              {lessonLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-secondary rounded w-full" />
                  <div className="h-4 bg-secondary rounded w-4/5" />
                  <div className="h-4 bg-secondary rounded w-3/5" />
                </div>
              ) : lessonDetail?.description ? (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {lessonDetail.description}
                </p>
              ) : (
                <p className="text-muted-foreground/60 text-sm italic">
                  لا يوجد ملخص لهذا الدرس.
                </p>
              )}
            </DosyaCard>

          </div>
        </div>

        {/* Course Sidebar */}
        <div
          className={`w-80 bg-card border-r border-border overflow-y-auto transition-all ${sidebarOpen ? "block" : "hidden lg:block"
            }`}
        >
          <div className="p-6">
            <h3 className="text-xl mb-4">محتوى الكورس</h3>

            <div className="space-y-3">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === sectionIndex ? -1 : sectionIndex)
                    }
                    className="w-full"
                  >
                    <DosyaCard className="hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4>{section.title}</h4>
                        {expandedSection === sectionIndex ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${section.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{section.progress}%</span>
                      </div>
                    </DosyaCard>
                  </button>

                  {expandedSection === sectionIndex && (
                    <div className="mt-2 space-y-1 pr-4">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lessonIndex}
                          onClick={() => selectLesson(sectionIndex, lessonIndex)}
                          className={`w-full text-right p-3 rounded-xl transition-all flex items-center gap-3 ${currentSectionIdx === sectionIndex && currentLessonIdx === lessonIndex
                              ? "bg-primary/10 border-2 border-primary/30"
                              : "hover:bg-secondary"
                            }`}
                        >
                          {lesson.locked ? (
                            <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          ) : lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <Play className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1 text-left">
                            <p className="text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}