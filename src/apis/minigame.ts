import api, { handleError } from "./config";
import { MiniGameResponse } from "@/types/dto.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMinigames = async (params?: Record<string, any>): Promise<MiniGameResponse[]> => {
    try {
        const res = await api.get('/mini-games', { params })
        return res.data.data as MiniGameResponse[]
    } catch (error) {
        handleError(error)
        throw error
    }
}