import { AxiosError } from "axios";
import { CompleteProfileRequest, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types";
import { publicApi, api, setAccessToken, clearAccessToken } from "./config";

export const register = async (req: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const res = await publicApi.post('/auth/register', req);
        return res.data as RegisterResponse;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status === 400) {
            message = 'Email đã được sử dụng !';
        } else {
            message =
                err.response?.data?.message ||
                err.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
};

export const login = async (req: LoginRequest): Promise<LoginResponse> => {
    try {
        const res = await publicApi.post('/auth/login', req);
        const resData = res.data as LoginResponse;
        if (resData.token) setAccessToken(resData.token);
        return resData;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status === 401) {
            message = 'Sai thông tin đăng nhập !';
        } else {
            message =
                err.response?.data?.message ||
                err.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
};

export const completeProfile = async (req: CompleteProfileRequest) => {
    try {
        const res = await api.post(`/auth/students/complete-profile`, req);
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message = '';
        if (err.response?.status !== 200) {
            message =
                err.response?.data?.message ||
                'Lỗi hệ thống.';
        }
        throw new Error(message);
    }
}

export const logout = async () => {
    const res = await api.post('/auth/logout');
    clearAccessToken();
    return res.data;
};
