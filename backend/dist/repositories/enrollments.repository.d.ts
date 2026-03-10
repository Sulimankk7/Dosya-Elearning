export interface EnrollmentRow {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: Date;
    progress_percent: number;
}
export declare const enrollmentsRepository: {
    findByUserAndCourse(userId: string, courseId: string): Promise<EnrollmentRow | null>;
    findByUserId(userId: string): Promise<EnrollmentRow[]>;
    create(userId: string, courseId: string): Promise<EnrollmentRow>;
    countByCourseId(courseId: string): Promise<number>;
    countByUserId(userId: string): Promise<number>;
};
//# sourceMappingURL=enrollments.repository.d.ts.map