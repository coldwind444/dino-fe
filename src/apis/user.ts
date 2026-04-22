import { api, handleError } from "./config";
import { AvatarUploadResponse, StudentStatsResponse, UpdateUserProfileRequest, UserProfileResponse } from "@/types";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
    try {
        const res = await api.get('/users/me');
        return res.data as UserProfileResponse;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getUsers = async (req?: Record<string, any>): Promise<UserProfileResponse[]> => {
    try {
        const res = await api.get('/users', { params: req });
        return res.data.users as UserProfileResponse[];
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const uploadAvatar = async (base64Image: string): Promise<AvatarUploadResponse> => {
    try {
        const res = await api.post('/users/me/avatar', { avatarBase64: base64Image });
        return res.data as AvatarUploadResponse;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const updateUserQuartz = async (delta: number) => {
    try {
        await api.put('/users/me/quartz', { delta: delta })
    } catch (error) {
        handleError(error);
    }
}

export const updateUserProfile = async (req: UpdateUserProfileRequest) => {
    try {
        await api.put('/users/me/profile', req)
    } catch (error) {
        handleError(error);
    }
}

export const trackAccessDuration = async (seconds: number) => {
    try {
        await api.post('/statistics/heartbeat', { seconds: seconds })
    } catch (error) {
        handleError(error);
    }
}

export const getLeaderboard = async (limit: number = 8) => {
    try {
        const res = await api.get('/users/leaderboard/quartz', { params: { limit: limit } });
        return res.data.leaderboard as UserProfileResponse[];
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getStudentStats = async (userId: string, startDate: string, endDate: string) => {
    try {
        const res = await api.get(`/statistics/student?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
        return res.data as StudentStatsResponse;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}