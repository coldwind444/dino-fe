import { CreateProgressRequest, ExerciseResponse, GradeProgressResponse, GradeResponse, LectureResponse, TermResponse, TopicResponse } from "@/types";
import { AxiosError } from "axios";
import api from "./config";

// Term APIs
export const getTermById = async (termid: string) : Promise<TermResponse> => {
    try {
        console.log(termid)
        const res = await api.get(`/academic-terms/${termid}`)
        return res.data as TermResponse
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

// Grade APIs
export const getGradeByLevel = async (level: number): Promise<GradeResponse[]> => {
    try {
        const res = await api.get(`/grades?level=${level}`)
        return res.data.data as GradeResponse[]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

export const getGradeById = async (id: string): Promise<GradeResponse> => {
    try {
        const res = await api.get(`/grades/${id}`)
        return res.data.data as GradeResponse
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

export const getGradeProgress = async (gradeId: string): Promise<GradeProgressResponse> => {
    try {
        const res = await api.get(`/progress/grade?gradeId=${gradeId}`)
        return res.data as GradeProgressResponse
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

// Topic APIs
export const getTopicById = async (topicId: string): Promise<TopicResponse> => {
    try {
        const res = await api.get(`/topics/${topicId}`)
        return res.data as TopicResponse
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

export const getRecentTopics = async (limit: number): Promise<string[]> => {
    try {
        const res = await api.get(`progress/recent?limit=${limit}`)
        return res.data.items as string[]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
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
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

export const getCompletedTopics = async (limit?: number): Promise<string[]> => {
    try {
        const res = await api.get(`/progress/completed?limit=${limit}`)
        return res.data.items as string[]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

export const getRecommendedTopicByGradeId = async (gradeId: string): Promise<TopicResponse> => {
    try {
        const zuluDateTime = '2025-10-30T00:00:00.000Z'; 
        const res = await api.get(`/topics/ongoing?gradeId=${gradeId}&date=${zuluDateTime}`)
        const topics = res.data.topics as TopicResponse[]
        return topics[0]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}

export const createProgress = async (req: CreateProgressRequest) => {
    try {
        await api.post('/progress', req)
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
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
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
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
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message)
    }
}