import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    gradeLevel: string;
    setGradeLevel: (id: string) => void;
    clear: () => void;
}

export const useLessonStore = create<LectureStoreState>()(
    persist(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (set, get) => ({
            gradeLevel: '',
            setGradeLevel: (level: string) => set({ gradeLevel: level }),
            clear: () => set({ gradeLevel: '' }),
        }),
        {
            name: "lesson-params",
        }
    )
);