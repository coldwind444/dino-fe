import { LandResponse, WorldResponse } from "@/types"
import api, { handleError } from "./config"


export const getWorldById = async (id: string): Promise<WorldResponse> => {
    try {
        const res = await api.get(`/worlds/${id}`)
        return res.data as WorldResponse
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getLandsByWorldId = async (worldId: string): Promise<LandResponse[]> => {
    try {
        const res = await api.get(`/lands?worldId=${worldId}`)
        return res.data.items as LandResponse[]
    } catch (error) {
        handleError(error);
        return []; // Never reached
    }
}