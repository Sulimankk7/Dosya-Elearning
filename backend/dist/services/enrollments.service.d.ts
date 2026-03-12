export declare const enrollmentsService: {
    enroll(userId: string, courseId: string): Promise<{
        enrollment_id: string;
        course_id: string;
        enrolled: boolean;
    }>;
    /** GET /api/enrollments/my-courses — matching StudentDashboard shape */
    getMyCourses(userId: string): Promise<{
        stats: {
            enrolled_courses: number;
            completion_percentage: number;
            certificates: number;
            completed_lessons: number;
        };
        courses: {
            id: any;
            title: any;
            description: any;
            price: string;
            image: any;
            instructor: any;
            duration: string;
            students: number;
            enrolled: boolean;
            progress: number;
        }[];
    }>;
};
//# sourceMappingURL=enrollments.service.d.ts.map