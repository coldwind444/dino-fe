import { CreateProgressRequest, ExerciseResponse, GradeProgressResponse, GradeResponse, LectureResponse, Pagination, TermResponse, TopicResponse } from "@/types";
import { AxiosError } from "axios";
import api from "./config";

// Term APIs
export const getTermById = async (termid: string) : Promise<TermResponse> => {
    try {
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
export const getGrades = async (params?: Record<string, any>): Promise<GradeResponse[]> => {
    try {
        const res = await api.get(`/grades`, { params })
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
export type PaginationTopicResponse = {
    items: TopicResponse[];
    pagination: Pagination;
}

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

export const getTopics = async (params?: Record<string, any>) : Promise<PaginationTopicResponse> => {
    try {
        const res = await api.get(`/topics`, { params })
        return res.data as PaginationTopicResponse
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
        const zuluDateTime = new Date().toISOString();
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
export type PaginationLectureResponse = {
    items: LectureResponse[];
    pagination: Pagination;
}

const DIFFICULTY_ORDER = new Map<string, number>([
    ['easy', 1],
    ['medium', 2],
    ['hard', 3]
])

export const getLecturesByTopicId = async (topicId: string): Promise<LectureResponse[]> => {
    try {
        const res = await api.get(`/lectures?topicId=${topicId}&page=1&limit=100000`) as PaginationLectureResponse
        const lectures = res.items as LectureResponse[]
        const sortedLectures = lectures.sort((a, b) => {
            const diff = DIFFICULTY_ORDER.get(a.difficulty)! - DIFFICULTY_ORDER.get(b.difficulty)!;
            
            if (diff !== 0) {
                return diff;
            }
            
            return a.title.localeCompare(b.title);
        })

        return sortedLectures
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