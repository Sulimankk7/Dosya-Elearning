export declare const lessonsService: {
    getLessonDetail(lessonId: string, userId?: string): Promise<{
        id: any;
        title: any;
        duration: string;
        video_url: any;
        description: any;
        locked: boolean;
        completed: boolean;
    }>;
    updateProgress(lessonId: string, userId: string, data: {
        completed?: boolean;
        watched_seconds?: number;
    }): Promise<{
        lesson_id: string;
        completed: boolean;
        watched_time: number;
    }>;
};
//# sourceMappingURL=lessons.service.d.ts.map