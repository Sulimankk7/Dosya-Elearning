import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { VideoPlayer } from "../components/VideoPlayer";
import { lessonsApi } from "../../services/api";
import type { LessonDetail } from "../../types/api";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaButton } from "../components/DosyaButton";
import { StatusBadge } from "../components/StatusBadge";

export default function LessonPage() {
    const { id } = useParams();
    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        lessonsApi.getDetail(id)
            .then(setLesson)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar type="student" />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">جاري تحميل الدرس...</div>
                </main>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex min-h-screen">
                <Sidebar type="student" />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-muted-foreground text-center">
                        <h2 className="text-2xl mb-2">الدرس غير موجود</h2>
                        <Link to="/courses" className="text-primary hover:underline">العودة للكورسات</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar type="student" />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                        <ArrowLeft className="w-5 h-5" />
                        <span>العودة للكورسات</span>
                    </Link>

                    <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

                    <VideoPlayer lessonId={lesson.id} locked={lesson.locked} />

                    <div className="mt-6 flex items-center justify-between">
                        <StatusBadge status={lesson.completed ? "completed" : "active"}>
                            {lesson.completed ? "مكتمل" : "جاري"}
                        </StatusBadge>
                        {!lesson.completed && !lesson.locked && (
                            <DosyaButton onClick={() => lessonsApi.updateProgress(lesson.id, { completed: true }).then(() => setLesson({ ...lesson, completed: true }))}>
                                <CheckCircle className="w-5 h-5" />
                                تحديد كمكتمل
                            </DosyaButton>
                        )}
                    </div>

                    <DosyaCard className="mt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl">ملخص الدرس</h3>
                        </div>
                        {lesson.description ? (
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {lesson.description}
                            </p>
                        ) : (
                            <p className="text-muted-foreground/60 text-sm italic">
                                لا يوجد ملخص لهذا الدرس.
                            </p>
                        )}
                    </DosyaCard>
                </div>
            </main>
        </div>
    );
}
