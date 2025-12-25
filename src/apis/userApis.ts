import { AxiosError } from "axios";
import { api } from "./config";
import { AvatarUploadResponse, UserProfileResponse } from "@/types";

export const getUserProfile = async () : Promise<UserProfileResponse> => {
    try {
        const res = await api.get('/users/me');
        return res.data as UserProfileResponse;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status === 401) {
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

export const uploadAvatar = async (base64Image: string): Promise<AvatarUploadResponse> => {
    try {
        const res = await api.post('/users/me/avatar', { avatarBase64: base64Image });
        return res.data as AvatarUploadResponse;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status === 400) {
            message = 'Bạn chưa tải ảnh nào lên !';
        } else {
            message =
                err.response?.data?.message ||
                err.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
}

export const updateUserQuartz = async (delta: number) => {
    try {
        await api.put('/users/me/quartz', { delta: delta })
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status === 400) {
            message = 'Dữ liệu gửi lên không hợp lệ';
        } else if (err.response?.status === 403) {
            message = 'Không có quyền';
        } else if (err.response?.status === 404) {
            message = 'Không tìm thấy user';
        } else {
            message =
                err.response?.data?.message ||
                err.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
}