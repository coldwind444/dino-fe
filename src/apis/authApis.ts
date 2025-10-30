import { AxiosError } from "axios";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types";
import { publicApi, api, setAccessToken, clearAccessToken } from "./config";

export const register = async (req: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const res = await publicApi.post('/auth/register', req);
        return res.data as RegisterResponse;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
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
        const message =
            err.response?.data?.message ||
            err.message ||
            'Lỗi hệ thống.';
        throw new Error(message);
    }
};

export const logout = async () => {
    const res = await api.post('/auth/logout');
    clearAccessToken();
    return res.data;
};
