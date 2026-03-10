export interface CourseRow {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    thumbnail_url: string | null;
    instructor_name: string | null;
    duration_hours: number;
    level: string | null;
    students_count: number;
    is_published: boolean;
    rating: number;
    rating_count: number;
    what_you_learn: string[];
    student_count?: number;
}
export declare const coursesRepository: {
    findAll(publishedOnly?: boolean): Promise<CourseRow[]>;
    findById(id: string): Promise<CourseRow | null>;
    findBySlug(slug: string): Promise<CourseRow | null>;
    create(data: {
        title: string;
        slug: string;
        description?: string;
        price?: number;
        thumbnail_url?: string;
        instructor_name?: string;
        duration_hours?: number;
        level?: string;
        is_published?: boolean;
        rating?: number;
        rating_count?: number;
        what_you_learn?: string[];
    }): Promise<CourseRow>;
    update(id: string, data: Partial<{
        title: string;
        slug: string;
        description: string;
        price: number;
        thumbnail_url: string;
        instructor_name: string;
        duration_hours: number;
        level: string;
        is_published: boolean;
        rating: number;
        rating_count: number;
        what_you_learn: string[];
    }>): Promise<CourseRow | null>;
    delete(id: string): Promise<void>;
    countAll(): Promise<number>;
    totalRevenue(): Promise<number>;
};
//# sourceMappingURL=courses.repository.d.ts.map