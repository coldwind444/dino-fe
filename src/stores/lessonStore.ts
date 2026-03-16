import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    gradeLevel: string;
    setGradeLevel: (id: string) => void
}

export const useLessonStore = create<LectureStoreState>()(
    persist(
        (set, get) => ({
            gradeLevel: '',
            setGradeLevel: (level: string) => set({ gradeLevel: level }),
        }),
        {
            name: "lesson-params",
        }
    )
);