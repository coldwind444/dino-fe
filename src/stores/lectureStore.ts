import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LectureStoreState {
    lectureIdx: number;
    setLectureIdx: (idx: number) => void;
}

export const useLectureStore = create<LectureStoreState>()(
    persist(
        (set, get) => ({
            lectureIdx: 0,
            setLectureIdx: (idx: number) => set({ lectureIdx: idx }),
        }),
        {
            name: "lecture-idx",
        }
    )
);