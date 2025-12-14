import { LandResponse, WorldResponse } from "@/types"
import api from "./config"
import { AxiosError } from "axios"


export const getWorldById = async (id: string): Promise<WorldResponse> => {
    try {
        const res = await api.get(`/worlds/${id}`)
        return res.data as WorldResponse
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status !== 200) {
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

export const getLandsByWorldId = async (worldId: string) : Promise<LandResponse[]> => {
    try {
        const res = await api.get(`/lands?worldId=${worldId}`)
        return res.data.items as LandResponse[]
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message: string;
        if (err.response?.status !== 200) {
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