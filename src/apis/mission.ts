import api, { handleError } from "./config"
import { AchievementResponse, UpdateMissionProgressRequest } from "@/types"

export const getMyMission = async (): Promise<AchievementResponse[]> => {
    try {
        const res = await api.get(`/achievements/my`)
        return res.data.data as AchievementResponse[]
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateMissionProgress = async (request: UpdateMissionProgressRequest) => {
    try {
        await api.put(`/achievements/update-progress`, request)
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const claimMissionReward = async (achievementId: string) => {
    try {
        await api.post(`/achievements/claim/${achievementId}`)
    } catch (error) {
        handleError(error)
        throw error
    }
}