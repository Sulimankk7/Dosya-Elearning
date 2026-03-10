export interface SectionRow {
    id: string;
    course_id: string;
    title: string;
    order_index: number;
}
export declare const sectionsRepository: {
    findByCourseId(courseId: string): Promise<SectionRow[]>;
    create(courseId: string, title: string, orderIndex?: number): Promise<SectionRow>;
    update(id: string, title: string): Promise<SectionRow | null>;
    delete(id: string): Promise<void>;
    getNextOrderIndex(courseId: string): Promise<number>;
};
//# sourceMappingURL=sections.repository.d.ts.map