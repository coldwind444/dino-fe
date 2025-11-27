import { LectureResponse, LessonResponse } from "@/types";
import { AxiosError } from "axios";
import api from "./config";

export const getLessonsByGradeId = async (gradeId: string): Promise<LessonResponse[]> => {
    try {
        const res = await api.get(`/worlds?gradeId=${gradeId}}`)
        return res.data.items as LessonResponse[]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status !== 200) {
            message = 'Bạn không có quyền truy cập !';
        } else {
            message =
                err.response?.data?.message ||
                err.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
}

export const getLecturesByLessonId = async (lessonId: string): Promise<LectureResponse[]> => {
    try {
        const res = await api.get(`/worlds?lessonId=${lessonId}}`)
        return res.data.items as LectureResponse[]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status !== 200) {
            message = 'Bạn không có quyền truy cập !';
        } else {
            message =
                err.response?.data?.message ||
                err.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
}