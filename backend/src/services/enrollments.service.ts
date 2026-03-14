import { enrollmentsRepository } from '../repositories/enrollments.repository';
import { coursesRepository } from '../repositories/courses.repository';
import { lessonProgressRepository } from '../repositories/lesson-progress.repository';
import { NotFoundError } from '../utils/errors';

function formatPrice(price: number): string {
    if (price === 0) return 'مجاني';
    return `${price} دينار`;
}

function formatDuration(hours: number | null): string {
    if (!hours) return '';
    if (hours === 1) return 'ساعة واحدة';
    return `${hours} ساعات`;
}

export const enrollmentsService = {
    async enroll(userId: string, courseId: string) {
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');

        const enrollment = await enrollmentsRepository.create(userId, courseId);
        return { enrollment_id: enrollment.id, course_id: courseId, enrolled: true };
    },

    async getMyCourses(userId: string) {
        // FIX: The original called getMyCoursesWithStats (which had 3 correlated subqueries
        // per course row) and then countCompletedByUser sequentially — meaning the second
        // query couldn't start until the first finished.
        //
        // Now both run in parallel with Promise.all, and getMyCoursesWithStats itself
        // has been rewritten to use JOINs (see enrollments.repository.ts).
        const [rawCourses, totalCompletedLessons] = await Promise.all([
            enrollmentsRepository.getMyCoursesWithStats(userId),
            lessonProgressRepository.countCompletedByUser(userId),
        ]);

        const validCourses = rawCourses.map((row: any) => {
            const totalLessons = parseInt(row.total_lessons || '0', 10);
            const completedLessons = parseInt(row.completed_lessons || '0', 10);
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return {
                id:          row.id,
                title:       row.title,
                description: row.description || '',
                price:       formatPrice(parseFloat(row.price || '0')),
                image:       row.thumbnail_url || '',
                instructor:  row.instructor_name || '',
                duration:    formatDuration(parseFloat(row.duration_hours || '0')),
                students:    parseInt(row.student_count || '0', 10),
                enrolled:    true,
                progress,
            };
        });

        const totalCourses = validCourses.length;
        const completedCourses = validCourses.filter((c: any) => c.progress === 100).length;
        const avgProgress = totalCourses > 0
            ? Math.round(validCourses.reduce((acc: number, c: any) => acc + c.progress, 0) / totalCourses)
            : 0;

        return {
            stats: {
                enrolled_courses:       totalCourses,
                completion_percentage:  avgProgress,
                certificates:           completedCourses,
                completed_lessons:      totalCompletedLessons,
            },
            courses: validCourses,
        };
    },
};