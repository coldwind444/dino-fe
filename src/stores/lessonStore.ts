import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    gradeLevel: string;
    topicId: string;
    lectureIdx: number;
    setGradeId: (id: string) => void
    setTopicId: (id: string) => void
    setLectureIdx: (idx: number) => void;
}

export const useLessonStore = create<LectureStoreState>()(
    persist(
        (set, get) => ({
            gradeLevel: '1',
            topicId: '',
            lectureIdx: 0,
            setGradeId: (level: string) => set({ gradeLevel: level }),
            setTopicId: (id: string) => set({ topicId: id }),
            setLectureIdx: (idx: number) => set({ lectureIdx: idx })
        }),
        {
            name: "lesson-params",
        }
    )
);