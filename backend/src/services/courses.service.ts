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

    async getCourseDetail(courseId: string, userId?: string) {
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');

        // FIX: The original awaited each query sequentially:
        //   1. findById (done above)
        //   2. await sectionsRepository.findByCourseId
        //   3. await lessonsRepository.countByCourseId
        //   4. await enrollmentsRepository.findByUserAndCourse  (conditional)
        //   5. await lessonProgressRepository.countCompleted    (conditional)
        //   6. await lessonsRepository.findByCourseId
        //
        // Queries 2, 3, and 6 are completely independent — they do not depend on
        // each other's results. Awaiting them one at a time wastes round-trip time
        // on every single request. Replaced with Promise.all for the independent set.
        const [sections, totalLessons, allLessons] = await Promise.all([
            sectionsRepository.findByCourseId(courseId),
            lessonsRepository.countByCourseId(courseId),
            lessonsRepository.findByCourseId(courseId),
        ]);

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

        const sectionsWithLessons = sections.map((section) => {
            const sectionLessons = allLessons.filter(l => l.section_id === section.id);
            return {
                id: section.id,
                title: section.title,
                lessons: sectionLessons.map((l) => ({
                    id: l.id,
                    title: l.title,
                    duration: formatLessonDuration(l.duration_minutes),
                    locked: enrolled ? false : !l.is_preview,
                })),
            };
        });

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
                rating:         course.rating,
                rating_count:   course.rating_count,
                level:          course.level,
                language:       'العربية',
                what_you_learn: course.what_you_learn,
            },
            sections: sectionsWithLessons,
            enrolled,
            progress,
        };
    },

    async getCourseContent(courseId: string, userId: string) {
        const course = await coursesRepository.findById(courseId);
        if (!course) throw new NotFoundError('Course not found');

        // FIX: Same pattern — sections, totalLessons, completedTotal, allLessons,
        // and allProgress are all independent of each other. Run them in parallel.
        const [sections, totalLessons, completedTotal, allLessons, allProgress] = await Promise.all([
            sectionsRepository.findByCourseId(courseId),
            lessonsRepository.countByCourseId(courseId),
            lessonProgressRepository.countCompletedByUserAndCourse(userId, courseId),
            lessonsRepository.findByCourseId(courseId),
            lessonProgressRepository.findByUserAndCourse(userId, courseId),
        ]);

        const progressMap = new Map(allProgress.map(p => [p.lesson_id, p]));

        const sectionsWithLessons = sections.map((section) => {
            const sectionLessons = allLessons.filter(l => l.section_id === section.id);
            let sectionCompletedCount = 0;

            const lessonsWithProgress = sectionLessons.map((l) => {
                const prog = progressMap.get(l.id);
                const isCompleted = prog?.is_completed || false;
                if (isCompleted) sectionCompletedCount++;
                return {
                    id:        l.id,
                    title:     l.title,
                    duration:  formatLessonDuration(l.duration_minutes),
                    completed: isCompleted,
                    locked:    false,
                };
            });

            return {
                id:       section.id,
                title:    section.title,
                progress: sectionLessons.length > 0
                    ? Math.round((sectionCompletedCount / sectionLessons.length) * 100)
                    : 0,
                lessons: lessonsWithProgress,
            };
        });

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