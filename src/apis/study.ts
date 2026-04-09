import { AnswerResponse, AssessmentResponse, AssessmentResultResponse, CreateAssessmentResultRequest, CreateProgressRequest, ExerciseResponse, GradeProgressResponse, GradeResponse, LectureResponse, Pagination, TermResponse, TopicResponse } from "@/types";
import { AxiosError } from "axios";
import api, { handleError } from "./config";

// Term APIs
export const getTermById = async (termid: string): Promise<TermResponse> => {
    try {
        const res = await api.get(`/academic-terms/${termid}`)
        return res.data as TermResponse
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

// Grade APIs
export const getGrades = async (params?: Record<string, any>): Promise<GradeResponse[]> => {
    try {
        const res = await api.get(`/grades`, { params })
        return res.data.data as GradeResponse[]
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getGradeById = async (id: string): Promise<GradeResponse> => {
    try {
        const res = await api.get(`/grades/${id}`)
        return res.data.data as GradeResponse
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getGradeProgress = async (gradeId: string): Promise<GradeProgressResponse> => {
    try {
        const res = await api.get(`/progress/grade?gradeId=${gradeId}`)
        return res.data as GradeProgressResponse
    } catch (error) {
        handleError(error);
        throw error; // Never reached
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
        handleError(error);
        throw error; // Never reached
    }
}

export const getRecentTopics = async (limit: number): Promise<TopicResponse[]> => {
    try {
        const res = await api.get(`progress/recent?limit=${limit}`)
        return res.data.items as TopicResponse[]
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getTopics = async (params?: Record<string, any>): Promise<PaginationTopicResponse> => {
    try {
        const res = await api.get(`/topics`, { params })
        return res.data as PaginationTopicResponse
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getCompletedTopics = async (limit?: number): Promise<TopicResponse[]> => {
    try {
        const res = await api.get(`/progress/completed?limit=${limit}`)
        return res.data.items as TopicResponse[]
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getRecommendedTopicByGradeId = async (gradeId: string): Promise<TopicResponse> => {
    try {
        const zuluDateTime = new Date().toISOString();
        const res = await api.get(`/topics/ongoing?gradeId=${gradeId}&date=${zuluDateTime}`)
        const topics = res.data.topics as TopicResponse[]
        return topics[0]
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const createProgress = async (req: CreateProgressRequest) => {
    try {
        await api.post('/progress', req)
    } catch (error) {
        handleError(error);
        throw error; // Never reached
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
        const res = await api.get(`/lectures?topicId=${topicId}&page=1&limit=100000`)
        const pgData = res.data as PaginationLectureResponse
        const lectures = pgData.items as LectureResponse[]
        const sortedLectures = lectures.sort((a, b) => {
            const diff = DIFFICULTY_ORDER.get(a.difficulty)! - DIFFICULTY_ORDER.get(b.difficulty)!;

            if (diff !== 0) {
                return diff;
            }

            return a.title.localeCompare(b.title);
        })

        return sortedLectures
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

// Exercise APIs
export const getExercises = async (params?: Record<string, any>): Promise<ExerciseResponse[]> => {
    try {
        const res = await api.get('/exercises', { params });
        return res.data.items as ExerciseResponse[]
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

// Answer APIs
export const getAnswers = async (params?: Record<string, any>): Promise<AnswerResponse[]> => {
    try {
        const res = await api.get('/answers', { params });
        return res.data.items as AnswerResponse[]
    } catch (error) {
        handleError(error);
        return []; // Never reached
    }
}

export const upsertAnswers = async (answers: AnswerResponse[]) => {
    try {
        await api.post('/answers/upsert', { answers: answers })
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

// Entrance test APIs
export const getPublishedAssessmentByGradeId = async (gradeId: string): Promise<AssessmentResponse | null> => {
    try {
        const res = await api.get(`/assessments?gradeId=${gradeId}`)
        const assessments = res.data.data as AssessmentResponse[]
        if (!assessments[0] || !assessments[0].published) return null
        return assessments[0]
    } catch (error) {
        handleError(error);
        return null;
    }
}

export const getAssessmentResult = async (assessmentId: string, userId: string): Promise<AssessmentResultResponse> => {
    try {
        const res = await api.get(`/assessments/results/all?assessmentId=${assessmentId}&userId=${userId}`)
        const results = res.data.data as AssessmentResultResponse[]
        return results[0]
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const createAssessmentResult = async (req: CreateAssessmentResultRequest): Promise<AssessmentResultResponse> => {
    try {
        const res = await api.post(`/assessments/results/`, req);
        return res.data.data as AssessmentResultResponse;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

export const submitAssessment = async (assessmentResultId: string, duration: number): Promise<AssessmentResultResponse> => {
    try {
        const res = await api.post(`/assessments/submit/${assessmentResultId}`, { duration: duration });
        return res.data.data as AssessmentResultResponse;
    } catch (error) {
        handleError(error);
        throw error;
    }
}
