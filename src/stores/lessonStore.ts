import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    gradeLevel: string;
    storedTopicId: string;
    setGradeLevel: (id: string) => void;
    setStoredTopicId: (id: string) => void;
    clear: () => void;
}

export const useLessonStore = create<LectureStoreState>()(
    persist(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (set) => ({
            gradeLevel: '',
            storedTopicId: '',
            setGradeLevel: (level: string) => set({ gradeLevel: level }),
            setStoredTopicId: (id: string) => set({ storedTopicId: id }),
            clear: () => set({ gradeLevel: '', storedTopicId: '' }),
        }),
        {
            name: "lesson-params",
        }
    )
);