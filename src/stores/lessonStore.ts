import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    gradeId: string;
    topicId: string;
    lectureIdx: number;
    setGradeId: (id: string) => void
    setTopicId: (id: string) => void
    setLectureIdx: (idx: number) => void;
}

export const useLessonStore = create<LectureStoreState>()(
    persist(
        (set, get) => ({
            gradeId: '1',
            topicId: '',
            lectureIdx: 0,
            setGradeId: (id: string) => set({ gradeId: id }),
            setTopicId: (id: string) => set({ topicId: id }),
            setLectureIdx: (idx: number) => set({ lectureIdx: idx })
        }),
        {
            name: "lesson-params",
        }
    )
);