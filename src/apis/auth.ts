import { AxiosError } from "axios";
import { CompleteProfileRequest, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types";
import { publicApi, api, setAccessToken, clearAccessToken, handleError } from "./config";

export const register = async (req: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const res = await publicApi.post('/auth/register', req);
        return res.data as RegisterResponse;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
};

export const login = async (req: LoginRequest): Promise<LoginResponse> => {
    try {
        const res = await publicApi.post('/auth/login', req);
        const resData = res.data as LoginResponse;
        if (resData.token && resData.user.role) setAccessToken(resData.token, resData.user.role);
        return resData;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
};

export const completeProfile = async (req: CompleteProfileRequest) => {
    try {
        const res = await api.post(`/auth/students/complete-profile`, req);
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const logout = async () => {
    const res = await api.post('/auth/logout');
    clearAccessToken();
    return res.data;
};
