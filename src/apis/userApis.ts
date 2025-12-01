import { AxiosError } from "axios";
import { api } from "./config";
import { UserProfileResponse } from "@/types";

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