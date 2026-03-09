import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "../components/Sidebar";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaInput } from "../components/DosyaInput";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Edit, Trash2, GripVertical, X, Upload, ImageIcon } from "lucide-react";
import { adminApi } from "../../services/api";

// ============================================================
// Types
// ============================================================

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  price: number;
  instructor_name: string;
  duration_hours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  students_count: number;
  is_published: boolean;
}

interface Lesson {
  id: string;
  section_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  is_preview: boolean;
}

interface Section {
  section_id: string;
  section_title: string;
  lessons: Lesson[];
}

type CourseFormData = Omit<Course, "id" | "slug" | "students_count">;

const LEVEL_LABELS: Record<Course["level"], string> = {
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
};

const EMPTY_COURSE_FORM: CourseFormData = {
  title: "",
  description: "",
  thumbnail_url: "",
  price: 0,
  instructor_name: "",
  duration_hours: 0,
  level: "Beginner",
  is_published: false,
};

const EMPTY_LESSON_FORM: Omit<Lesson, "id" | "section_id"> = {
  title: "",
  description: "",
  video_url: "",
  duration_minutes: 0,
  order_index: 0,
  is_preview: false,
};

// ============================================================
// Slug generator
// ============================================================
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================================
// Image Drag & Drop Component
// ============================================================
interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/image\/(jpeg|png|webp)/)) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block mb-2 text-sm">صورة الكورس</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden
          ${dragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-secondary/30"}`}
      >
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="thumbnail preview"
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm">انقر أو اسحب لتغيير الصورة</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
              {dragging ? (
                <ImageIcon className="w-6 h-6 text-primary" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {dragging ? "أفلت الصورة هنا" : "اسحب صورة أو انقر للاختيار"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">JPG · PNG · WEBP</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

// ============================================================
// Draggable Lesson Item
// ============================================================
interface LessonItemProps {
  lesson: Lesson;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (lesson: Lesson) => void;
  onDragStart: (index: number, sectionId: string) => void;
  onDragOver: (index: number, sectionId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

function LessonItem({
  lesson,
  index,
  onDelete,
  onEdit,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: LessonItemProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index, lesson.section_id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index, lesson.section_id); }}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-transparent transition-all
        ${isDragging ? "opacity-40 border-primary/40 scale-[0.98]" : "hover:bg-secondary/50"}`}
    >
      <button className="cursor-grab active:cursor-grabbing hover:bg-secondary p-2 rounded-lg transition-all touch-none">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="truncate">{lesson.title}</p>
          {lesson.is_preview && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
              معاينة مجانية
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {lesson.duration_minutes} دقيقة · ترتيب: {lesson.order_index}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(lesson)}
          className="p-2 hover:bg-primary/10 rounded-lg transition-all text-primary"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(lesson.id)}
          className="p-2 hover:bg-destructive/10 rounded-lg transition-all text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function AdminCourses() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);

  // Form state
  const [courseForm, setCourseForm] = useState<CourseFormData>(EMPTY_COURSE_FORM);
  const [lessonForm, setLessonForm] = useState<Omit<Lesson, "id" | "section_id">>(EMPTY_LESSON_FORM);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const dragSectionId = useRef<string | null>(null);
  const [draggingLessonIdx, setDraggingLessonIdx] = useState<{ index: number; sectionId: string } | null>(null);

  const loadCourses = () => {
    adminApi.listCourses()
      .then((data) => setCourses(data as unknown as Course[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  // ---- Course form handlers ----
  const setCourseField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
    setCourseForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAddModal = () => {
    setCourseForm(EMPTY_COURSE_FORM);
    setShowAddModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      price: course.price,
      instructor_name: course.instructor_name,
      duration_hours: course.duration_hours,
      level: course.level,
      is_published: course.is_published,
    });
    setShowEditModal(true);
  };

  const handleAddCourse = async () => {
    try {
      await adminApi.createCourse({
        ...courseForm,
        slug: generateSlug(courseForm.title),
      });
      setShowAddModal(false);
      loadCourses();
    } catch (err) { console.error(err); }
  };

  const handleEditCourse = async () => {
    if (!editingCourse) return;
    try {
      await adminApi.updateCourse(editingCourse.id, {
        ...courseForm,
        slug: generateSlug(courseForm.title),
      });
      setShowEditModal(false);
      loadCourses();
    } catch (err) { console.error(err); }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكورس؟")) return;
    try {
      await adminApi.deleteCourse(id);
      loadCourses();
    } catch (err) { console.error(err); }
  };

  // ---- Lessons ----
  const handleOpenLessons = async (courseId: string) => {
    setSelectedCourseId(courseId);
    setEditingLesson(null);
    setLessonForm(EMPTY_LESSON_FORM);
    try {
      const data: Section[] = await adminApi.getLessonsByCourse(courseId);
      setSections(data);
    } catch (err) {
      console.error(err);
      setSections([]);
    }
    setShowLessonsModal(true);
  };

  const handleAddLesson = async (sectionId: string) => {
    try {
      const nextOrder = sections
        .find((s) => s.section_id === sectionId)
        ?.lessons.length ?? 0;
      await adminApi.createLesson(sectionId, {
        ...lessonForm,
        order_index: lessonForm.order_index || nextOrder + 1,
      });
      setLessonForm(EMPTY_LESSON_FORM);
      await handleOpenLessons(selectedCourseId);
    } catch (err) { console.error(err); }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    try {
      await adminApi.updateLesson(editingLesson.id, lessonForm);
      setEditingLesson(null);
      setLessonForm(EMPTY_LESSON_FORM);
      await handleOpenLessons(selectedCourseId);
    } catch (err) { console.error(err); }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      await adminApi.deleteLesson(id);
      await handleOpenLessons(selectedCourseId);
    } catch (err) { console.error(err); }
  };

  // ---- Sections ----
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      await adminApi.createSection(selectedCourseId, newSectionTitle.trim());
      setNewSectionTitle("");
      setShowAddSection(false);
      await handleOpenLessons(selectedCourseId);
    } catch (err) { console.error(err); }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("حذف هذا القسم سيحذف جميع دروسه. هل أنت متأكد؟")) return;
    try {
      // Delete all lessons in section first, then reload
      const section = sections.find((s) => s.section_id === sectionId);
      if (section) {
        await Promise.all(section.lessons.map((l) => adminApi.deleteLesson(l.id)));
      }
      await handleOpenLessons(selectedCourseId);
    } catch (err) { console.error(err); }
  };

  const startEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      duration_minutes: lesson.duration_minutes,
      order_index: lesson.order_index,
      is_preview: lesson.is_preview,
    });
  };

  // ---- Drag to reorder ----
  const handleDragStart = (index: number, sectionId: string) => {
    dragIndex.current = index;
    dragSectionId.current = sectionId;
    setDraggingLessonIdx({ index, sectionId });
  };

  const handleDragOver = (overIndex: number, sectionId: string) => {
    if (
      dragIndex.current === null ||
      dragSectionId.current !== sectionId ||
      dragIndex.current === overIndex
    ) return;

    setSections((prev) =>
      prev.map((section) => {
        if (section.section_id !== sectionId) return section;
        const updated = [...section.lessons];
        const [moved] = updated.splice(dragIndex.current!, 1);
        updated.splice(overIndex, 0, moved);
        dragIndex.current = overIndex;
        return { ...section, lessons: updated.map((l, i) => ({ ...l, order_index: i + 1 })) };
      })
    );
    setDraggingLessonIdx({ index: overIndex, sectionId });
  };

  const handleDragEnd = async () => {
    setDraggingLessonIdx(null);
    dragIndex.current = null;
    dragSectionId.current = null;

    // Persist new order_index for each lesson
    try {
      const updates = sections.flatMap((s) =>
        s.lessons.map((l) => adminApi.updateLesson(l.id, { order_index: l.order_index }))
      );
      await Promise.all(updates);
    } catch (err) { console.error(err); }
  };

  // ---- Shared course form fields (rendered inline, NOT as a sub-component) ----
  const renderCourseFormFields = () => (
    <div className="space-y-4">
      <DosyaInput
        label="اسم الكورس"
        placeholder="مثال: Complete Networking Course"
        value={courseForm.title}
        onChange={(e) => setCourseField("title", e.target.value)}
      />

      {courseForm.title && (
        <p className="text-xs text-muted-foreground -mt-2 pb-1">
          Slug: <span className="font-mono text-primary">{generateSlug(courseForm.title)}</span>
        </p>
      )}

      <div>
        <label className="block mb-2 text-sm">وصف الكورس</label>
        <textarea
          rows={4}
          value={courseForm.description}
          onChange={(e) => setCourseField("description", e.target.value)}
          className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          placeholder="وصف مختصر عن محتوى الكورس..."
        />
      </div>

      <DosyaInput
        label="اسم المدرب"
        placeholder="مثال: أحمد خالد"
        value={courseForm.instructor_name}
        onChange={(e) => setCourseField("instructor_name", e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <DosyaInput
          label="السعر"
          type="number"
          placeholder="299"
          value={String(courseForm.price)}
          onChange={(e) => setCourseField("price", Number(e.target.value))}
        />
        <DosyaInput
          label="المدة (ساعة)"
          type="number"
          placeholder="12"
          value={String(courseForm.duration_hours)}
          onChange={(e) => setCourseField("duration_hours", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm">المستوى</label>
        <select
          value={courseForm.level}
          onChange={(e) => setCourseField("level", e.target.value as Course["level"])}
          className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="Beginner">Beginner — مبتدئ</option>
          <option value="Intermediate">Intermediate — متوسط</option>
          <option value="Advanced">Advanced — متقدم</option>
        </select>
      </div>

      <ImageUpload
        value={courseForm.thumbnail_url}
        onChange={(url) => setCourseField("thumbnail_url", url)}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCourseField("is_published", !courseForm.is_published)}
          className={`relative w-11 h-6 rounded-full transition-colors ${courseForm.is_published ? "bg-primary" : "bg-border"}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${courseForm.is_published ? "translate-x-6 right-auto left-1" : "left-1"}`}
          />
        </button>
        <span
          className="text-sm cursor-pointer"
          onClick={() => setCourseField("is_published", !courseForm.is_published)}
        >
          {courseForm.is_published ? "كورس منشور (نشط)" : "كورس مخفي"}
        </span>
      </div>
    </div>
  );

  // ---- Shared lesson form fields (rendered inline) ----
  const renderLessonFormFields = (sectionId: string) => (
    <div className="space-y-3">
      <DosyaInput
        label="عنوان الدرس"
        placeholder="مثال: مقدمة في HTML"
        value={lessonForm.title}
        onChange={(e) => setLessonForm((p) => ({ ...p, title: e.target.value }))}
      />
      <div>
        <label className="block mb-2 text-sm">وصف الدرس</label>
        <textarea
          rows={2}
          value={lessonForm.description}
          onChange={(e) => setLessonForm((p) => ({ ...p, description: e.target.value }))}
          className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
          placeholder="وصف مختصر..."
        />
      </div>
      <DosyaInput
        label="رابط الفيديو"
        placeholder="https://youtube.com/watch?v=..."
        value={lessonForm.video_url}
        onChange={(e) => setLessonForm((p) => ({ ...p, video_url: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <DosyaInput
          label="المدة (دقيقة)"
          type="number"
          placeholder="15"
          value={String(lessonForm.duration_minutes)}
          onChange={(e) => setLessonForm((p) => ({ ...p, duration_minutes: Number(e.target.value) }))}
        />
        <DosyaInput
          label="الترتيب"
          type="number"
          placeholder="1"
          value={String(lessonForm.order_index)}
          onChange={(e) => setLessonForm((p) => ({ ...p, order_index: Number(e.target.value) }))}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={`preview-${sectionId}`}
          checked={lessonForm.is_preview}
          onChange={(e) => setLessonForm((p) => ({ ...p, is_preview: e.target.checked }))}
          className="w-4 h-4 rounded accent-primary"
        />
        <label htmlFor={`preview-${sectionId}`} className="text-sm cursor-pointer">
          درس معاينة مجانية (متاح بدون تسجيل)
        </label>
      </div>
    </div>
  );

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="flex min-h-screen">
      <Sidebar type="admin" />

      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl mb-2">إدارة الكورسات</h1>
            <p className="text-muted-foreground text-lg">عرض وتحرير الكورسات المتاحة</p>
          </div>
          <DosyaButton onClick={openAddModal}>
            <Plus className="w-5 h-5" />
            إضافة كورس جديد
          </DosyaButton>
        </div>

        {/* Courses Table */}
        <DosyaCard className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right pb-4 pr-4">اسم الكورس</th>
                <th className="text-right pb-4">المدرب</th>
                <th className="text-right pb-4">السعر</th>
                <th className="text-right pb-4">المدة</th>
                <th className="text-right pb-4">المستوى</th>
                <th className="text-right pb-4">عدد الطلاب</th>
                <th className="text-right pb-4">الحالة</th>
                <th className="text-right pb-4 pl-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    جاري التحميل...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    لا توجد كورسات بعد
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-all"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <span>{course.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{course.instructor_name}</td>
                    <td className="py-4">{course.price} د.أ</td>
                    <td className="py-4">{course.duration_hours} ساعة</td>
                    <td className="py-4">
                      <span className="text-sm">{LEVEL_LABELS[course.level] ?? course.level}</span>
                    </td>
                    <td className="py-4">{course.students_count}</td>
                    <td className="py-4">
                      <StatusBadge status={course.is_published ? "active" : "inactive"}>
                        {course.is_published ? "نشط" : "مخفي"}
                      </StatusBadge>
                    </td>
                    <td className="py-4 pl-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenLessons(course.id)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-all text-primary"
                          title="إدارة الدروس"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-all text-primary"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-all text-destructive"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </DosyaCard>

        {/* ── Add Course Modal ── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <DosyaCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">إضافة كورس جديد</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderCourseFormFields()}
              <div className="flex gap-4 pt-4">
                <DosyaButton className="flex-1" onClick={handleAddCourse}>
                  إضافة الكورس
                </DosyaButton>
                <DosyaButton variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </DosyaButton>
              </div>
            </DosyaCard>
          </div>
        )}

        {/* ── Edit Course Modal ── */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <DosyaCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">تعديل الكورس</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderCourseFormFields()}
              <div className="flex gap-4 pt-4">
                <DosyaButton className="flex-1" onClick={handleEditCourse}>
                  حفظ التغييرات
                </DosyaButton>
                <DosyaButton variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                  إلغاء
                </DosyaButton>
              </div>
            </DosyaCard>
          </div>
        )}

        {/* ── Lessons Management Modal ── */}
        {showLessonsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <DosyaCard className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">إدارة الدروس</h2>
                <button
                  onClick={() => setShowLessonsModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Add Section ── */}
              <div className="mb-6">
                {showAddSection ? (
                  <div className="flex gap-2 items-center p-3 bg-secondary/30 rounded-xl">
                    <DosyaInput
                      placeholder="عنوان القسم، مثال: أساسيات الشبكات"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                      className="flex-1"
                    />
                    <DosyaButton size="sm" onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
                      حفظ
                    </DosyaButton>
                    <button
                      onClick={() => { setShowAddSection(false); setNewSectionTitle(""); }}
                      className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <DosyaButton size="sm" variant="outline" onClick={() => setShowAddSection(true)}>
                    <Plus className="w-4 h-4" />
                    إضافة قسم جديد
                  </DosyaButton>
                )}
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <GripVertical className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground mb-1">لا توجد أقسام لهذا الكورس</p>
                  <p className="text-sm text-muted-foreground/60">أضف قسمًا أولاً ثم أضف الدروس بداخله</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sections.map((section) => (
                    <div key={section.section_id}>
                      {/* Section Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-px flex-1 bg-border" />
                        <div className="flex items-center gap-2 shrink-0">
                          <h3 className="text-base font-medium text-muted-foreground px-3 py-1 bg-secondary/50 rounded-full">
                            {section.section_title}
                          </h3>
                          <button
                            onClick={() => handleDeleteSection(section.section_id)}
                            className="p-1.5 hover:bg-destructive/10 rounded-lg transition-all text-destructive/60 hover:text-destructive"
                            title="حذف القسم"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="h-px flex-1 bg-border" />
                      </div>

                      {/* Lessons List */}
                      <div className="space-y-2 mb-4">
                        {[...section.lessons]
                          .sort((a, b) => a.order_index - b.order_index)
                          .map((lesson, index) => (
                            <LessonItem
                              key={lesson.id}
                              lesson={lesson}
                              index={index}
                              onDelete={handleDeleteLesson}
                              onEdit={startEditLesson}
                              onDragStart={handleDragStart}
                              onDragOver={handleDragOver}
                              onDragEnd={handleDragEnd}
                              isDragging={
                                draggingLessonIdx?.index === index &&
                                draggingLessonIdx?.sectionId === section.section_id
                              }
                            />
                          ))}
                        {section.lessons.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4 bg-secondary/20 rounded-xl">
                            لا توجد دروس في هذا القسم
                          </p>
                        )}
                      </div>

                      {/* Inline lesson edit form */}
                      {editingLesson && editingLesson.section_id === section.section_id && (
                        <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-primary">تعديل الدرس</p>
                            <button
                              onClick={() => { setEditingLesson(null); setLessonForm(EMPTY_LESSON_FORM); }}
                              className="p-1 hover:bg-secondary rounded transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {renderLessonFormFields(section.section_id)}
                          <div className="mt-3">
                            <DosyaButton size="sm" onClick={handleUpdateLesson} disabled={!lessonForm.title}>
                              <Plus className="w-4 h-4" />
                              حفظ التعديلات
                            </DosyaButton>
                          </div>
                        </div>
                      )}

                      {/* Add lesson form for this section */}
                      {!editingLesson && (
                        <details className="mt-2">
                          <summary className="text-sm text-primary cursor-pointer hover:underline list-none flex items-center gap-1 w-fit">
                            <Plus className="w-4 h-4" />
                            إضافة درس لهذا القسم
                          </summary>
                          <div className="mt-3 p-4 bg-secondary/30 rounded-xl">
                          {renderLessonFormFields(section.section_id)}
                            <div className="mt-3">
                              <DosyaButton size="sm" onClick={() => handleAddLesson(section.section_id)} disabled={!lessonForm.title}>
                                <Plus className="w-4 h-4" />
                                إضافة الدرس
                              </DosyaButton>
                            </div>
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </DosyaCard>
          </div>
        )}
      </main>
    </div>
  );
}