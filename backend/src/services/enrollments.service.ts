import { enrollmentsRepository } from '../repositories/enrollments.repository';
import { coursesRepository } from '../repositories/courses.repository';
import { lessonsRepository } from '../repositories/lessons.repository';
import { lessonProgressRepository } from '../repositories/lesson-progress.repository';
import { NotFoundError, BadRequestError } from '../utils/errors';

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

    /** GET /api/enrollments/my-courses — matching StudentDashboard shape */
    async getMyCourses(userId: string) {
        const enrollments = await enrollmentsRepository.findByUserId(userId);
        const totalCompletedLessons = await lessonProgressRepository.countCompletedByUser(userId);

        const courses = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = await coursesRepository.findById(enrollment.course_id);
                if (!course) return null;

                const totalLessons = await lessonsRepository.countByCourseId(course.id);
                const completedLessons = await lessonProgressRepository.countCompletedByUserAndCourse(userId, course.id);
                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return {
                    id: course.id,
                    title: course.title,
                    description: course.description || '',
                    price: formatPrice(course.price),
                    image: course.thumbnail_url || '',
                    instructor: course.instructor_name || '',
                    duration: formatDuration(course.duration_hours),
                    students: parseInt(String(course.student_count || course.students_count || 0), 10),
                    enrolled: true,
                    progress,
                };
            })
        );

        const validCourses = courses.filter(Boolean);
        const totalCourses = validCourses.length;
        const completedCourses = validCourses.filter((c: any) => c.progress === 100).length;
        const avgProgress = totalCourses > 0
            ? Math.round(validCourses.reduce((acc: number, c: any) => acc + c.progress, 0) / totalCourses)
            : 0;

        return {
            stats: {
                enrolled_courses: totalCourses,
                completion_percentage: avgProgress,
                certificates: completedCourses,
                completed_lessons: totalCompletedLessons,
            },
            courses: validCourses,
        };
    },
};
