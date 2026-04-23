import api, { handleError } from "./config";
import { MiniGameResponse } from "@/types/dto.types";

export const getMinigames = async (params?: Record<string, any>): Promise<MiniGameResponse[]> => {
    try {
        const res = await api.get('/mini-games', { params })
        return res.data.data as MiniGameResponse[]
    } catch (error) {
        handleError(error)
        throw error
    }
}