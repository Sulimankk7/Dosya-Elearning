export interface LessonProgressRow {
    id: string;
    user_id: string;
    lesson_id: string;
    is_completed: boolean;
    watched_seconds: number;
}
export declare const lessonProgressRepository: {
    findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgressRow | null>;
    findByUserAndCourse(userId: string, courseId: string): Promise<LessonProgressRow[]>;
    upsert(userId: string, lessonId: string, data: {
        is_completed?: boolean;
        watched_seconds?: number;
    }): Promise<LessonProgressRow>;
    countCompletedByUser(userId: string): Promise<number>;
    countCompletedByUserAndCourse(userId: string, courseId: string): Promise<number>;
    countCompletedByUserAndSection(userId: string, sectionId: string): Promise<number>;
};
//# sourceMappingURL=lesson-progress.repository.d.ts.map