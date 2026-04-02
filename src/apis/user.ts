import { AxiosError } from "axios";
import { api, handleError } from "./config";
import { AvatarUploadResponse, UpdateUserProfileRequest, UserProfileResponse } from "@/types";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
    try {
        const res = await api.get('/users/me');
        return res.data as UserProfileResponse;
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