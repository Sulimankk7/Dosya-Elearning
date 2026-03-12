export interface LessonRow {
    id: string;
    section_id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    duration_minutes: number | null;
    order_index: number;
    is_preview: boolean;
}
export declare const lessonsRepository: {
    findBySectionId(sectionId: string): Promise<LessonRow[]>;
    findByCourseId(courseId: string): Promise<LessonRow[]>;
    findById(id: string): Promise<LessonRow | null>;
    create(data: {
        section_id: string;
        title: string;
        duration_minutes?: number;
        video_url?: string;
        is_preview?: boolean;
        order_index?: number;
    }): Promise<LessonRow>;
    update(id: string, data: Partial<{
        title: string;
        duration_minutes: number;
        video_url: string;
        is_preview: boolean;
    }>): Promise<LessonRow | null>;
    delete(id: string): Promise<void>;
    countByCourseId(courseId: string): Promise<number>;
    getNextOrderIndex(sectionId: string): Promise<number>;
    getCourseIdByLessonId(lessonId: string): Promise<string | null>;
    getLessonDetailWithContext(lessonId: string, userId?: string): Promise<any | null>;
};
//# sourceMappingURL=lessons.repository.d.ts.map