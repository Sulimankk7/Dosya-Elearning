import { coursesRepository } from '../repositories/courses.repository';
import { sectionsRepository } from '../repositories/sections.repository';
import { lessonsRepository } from '../repositories/lessons.repository';
import { enrollmentsRepository } from '../repositories/enrollments.repository';
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

function formatLessonDuration(minutes: number | null): string {
    if (!minutes) return '';
    return `${minutes} دقيقة`;
}

export const coursesService = {
    /** GET /api/courses — matching CourseCatalog page shape */
    async listCourses() {
        const courses = await coursesRepository.findAll(true);
        return courses.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            price: formatPrice(c.price),
            image: c.thumbnail_url || '',
            instructor: c.instructor_name || '',
            duration: formatDuration(c.duration_hours),
            students: parseInt(String(c.student_count || c.students_count || 0), 10),
        }));
    },

    /** GET /api/courses/:id — matching CourseDetails page shape */
    async getCourseDetail(courseId: string, userId?: string) {
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');

        const sections = await sectionsRepository.findByCourseId(courseId);
        const totalLessons = await lessonsRepository.countByCourseId(courseId);

        // Check enrollment
        let enrolled = false;
        let progress = 0;
        if (userId) {
            const enrollment = await enrollmentsRepository.findByUserAndCourse(userId, courseId);
            enrolled = !!enrollment;
            if (enrolled) {
                const completed = await lessonProgressRepository.countCompletedByUserAndCourse(userId, courseId);
                progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
            }
        }

        // Build sections with lessons
        const sectionsWithLessons = await Promise.all(
            sections.map(async (section) => {
                const lessons = await lessonsRepository.findBySectionId(section.id);
                return {
                    id: section.id,
                    title: section.title,
                    lessons: lessons.map((l) => ({
                        id: l.id,
                        title: l.title,
                        duration: formatLessonDuration(l.duration_minutes),
                        locked: enrolled ? false : !l.is_preview,
                    })),
                };
            })
        );

        return {
            course: {
                id:             course.id,
                title:          course.title,
                description:    course.description || '',
                price:          formatPrice(course.price),
                original_price: null,
                image:          course.thumbnail_url || '',
                instructor:     course.instructor_name || '',
                duration:       formatDuration(course.duration_hours),
                students:       parseInt(String(course.student_count || course.students_count || 0), 10),
                lessons_count:  totalLessons,
                rating:         course.rating,        // ✅ real value from DB
                rating_count:   course.rating_count,  // ✅ real value from DB
                level:          course.level,
                language:       'العربية',
                what_you_learn: course.what_you_learn, // ✅ real array from DB
            },
            sections: sectionsWithLessons,
            enrolled,
            progress,
        };
    },

    /** GET /api/courses/:id/content — matching CourseLearningPage shape (enrolled users only) */
    async getCourseContent(courseId: string, userId: string) {
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');

        const sections = await sectionsRepository.findByCourseId(courseId);
        const totalLessons = await lessonsRepository.countByCourseId(courseId);
        const completedTotal = await lessonProgressRepository.countCompletedByUserAndCourse(userId, courseId);

        const sectionsWithLessons = await Promise.all(
            sections.map(async (section) => {
                const lessons = await lessonsRepository.findBySectionId(section.id);
                const sectionLessonCount = lessons.length;
                const sectionCompleted = await lessonProgressRepository.countCompletedByUserAndSection(userId, section.id);

                const lessonsWithProgress = await Promise.all(
                    lessons.map(async (l) => {
                        const prog = await lessonProgressRepository.findByUserAndLesson(userId, l.id);
                        return {
                            id:        l.id,
                            title:     l.title,
                            duration:  formatLessonDuration(l.duration_minutes),
                            completed: prog?.is_completed || false,
                            locked:    false,
                        };
                    })
                );

                return {
                    id:       section.id,
                    title:    section.title,
                    progress: sectionLessonCount > 0
                        ? Math.round((sectionCompleted / sectionLessonCount) * 100)
                        : 0,
                    lessons: lessonsWithProgress,
                };
            })
        );

        return {
            course: {
                id:         course.id,
                title:      course.title,
                instructor: course.instructor_name || '',
                image:      course.thumbnail_url || '',
            },
            sections:          sectionsWithLessons,
            overall_progress:  totalLessons > 0 ? Math.round((completedTotal / totalLessons) * 100) : 0,
            completed_lessons: completedTotal,
            total_lessons:     totalLessons,
        };
    },
};