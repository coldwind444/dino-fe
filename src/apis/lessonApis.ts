import { ExerciseResponse, GradeProgressResponse, GradeResponse, LectureResponse, TopicResponse } from "@/types";
import { AxiosError } from "axios";
import api from "./config";

// Grade APIs
export const getGradeByLevel = async (level: number): Promise<GradeResponse[]> => {
    try {
        const res = await api.get(`/grades?level=${level}`)
        return res.data.data as GradeResponse[]
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

export const getGradeProgress = async (gradeId: string): Promise<GradeProgressResponse> => {
    try {
        const res = await api.get(`/progress/grade?gradeId=${gradeId}`)
        return res.data as GradeProgressResponse
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

// Topic APIs
export const getTopicById = async (topicId: string): Promise<TopicResponse> => {
    try {
        const res = await api.get(`/topics/${topicId}`)
        return res.data as TopicResponse
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

export const getRecentTopics = async (limit: number): Promise<TopicResponse[]> => {
    try {
        const res = await api.get(`progress/recent?limit=${limit}`)
        return res.data.items as TopicResponse[]
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

export const getTopicsByGradeId = async (gradeId: string): Promise<TopicResponse[]> => {
    try {
        const res = await api.get(`/topics?gradeId=${gradeId}`)
        const topics = res.data.items as TopicResponse[]
        const sortedTopics = topics.sort((a, b) => (a.weekNumbers[0] ?? Infinity) - (b.weekNumbers[0] ?? Infinity))
        return sortedTopics
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

// Lecture APIs
export const getLecturesByTopicId = async (topicId: string): Promise<LectureResponse[]> => {
    try {
        const easy = await api.get(`/lectures?topicId=${topicId}&difficulty=easy`)
        const medium = await api.get(`/lectures?topicId=${topicId}&difficulty=medium`)
        const hard = await api.get(`/lectures?topicId=${topicId}&difficulty=hard`)
        const res = [...easy.data.items, ...medium.data.items, ...hard.data.items]
        return res as LectureResponse[]
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

// Exercise APIs
export const getExercisesByLectureId = async (lectureId: string, limit?: number): Promise<ExerciseResponse[]> => {
    try {
        let url = `/exercises?lectureId=${lectureId}`;
        if (limit) {
            url += `&limit=${limit}`;
        }
        console.log("API URL:", url);
        const res = await api.get(url);
        console.log("API Response:", res.data);
        return res.data.items as ExerciseResponse[]
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