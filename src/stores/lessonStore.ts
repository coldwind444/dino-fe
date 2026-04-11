import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    gradeLevel: string;
    setGradeLevel: (id: string) => void
}

export const useLessonStore = create<LectureStoreState>()(
    persist(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (set, get) => ({
            gradeLevel: '',
            setGradeLevel: (level: string) => set({ gradeLevel: level }),
        }),
        {
            name: "lesson-params",
        }
    )
);