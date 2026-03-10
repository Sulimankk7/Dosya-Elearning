export declare const coursesService: {
    /** GET /api/courses — matching CourseCatalog page shape */
    listCourses(): Promise<{
        id: string;
        title: string;
        description: string;
        price: string;
        image: string;
        instructor: string;
        duration: string;
        students: number;
    }[]>;
    /** GET /api/courses/:id — matching CourseDetails page shape */
    getCourseDetail(courseId: string, userId?: string): Promise<{
        course: {
            id: string;
            title: string;
            description: string;
            price: string;
            original_price: null;
            image: string;
            instructor: string;
            duration: string;
            students: number;
            lessons_count: number;
            rating: number;
            rating_count: number;
            level: string | null;
            language: string;
            what_you_learn: string[];
        };
        sections: {
            id: string;
            title: string;
            lessons: {
                id: string;
                title: string;
                duration: string;
                locked: boolean;
            }[];
        }[];
        enrolled: boolean;
        progress: number;
    }>;
    /** GET /api/courses/:id/content — matching CourseLearningPage shape (enrolled users only) */
    getCourseContent(courseId: string, userId: string): Promise<{
        course: {
            id: string;
            title: string;
            instructor: string;
            image: string;
        };
        sections: {
            id: string;
            title: string;
            progress: number;
            lessons: {
                id: string;
                title: string;
                duration: string;
                completed: boolean;
                locked: boolean;
            }[];
        }[];
        overall_progress: number;
        completed_lessons: number;
        total_lessons: number;
    }>;
};
//# sourceMappingURL=courses.service.d.ts.map