import { AxiosError } from "axios";
import api, { handleError } from "./config";
import { ArenaResponse, ParticipationResponse, RankResponse, LeaderboardResponse, CreateParticipationRequest, UpdateParticipationRequest } from "@/types/dto.types";
import { Pagination } from "@/types";

export type PaginatedArenaResponse = {
    items: ArenaResponse[]
    pagination: Pagination
}

export const getArena = async (params?: Record<string, any>): Promise<ArenaResponse[]> => {
    try {
        const response = await api.get("/arenas", { params });
        const data = response.data as PaginatedArenaResponse;
        return data.items;
    } catch (error) {
        handleError(error);
        return []; // Never reached due to handleError throwing
    }
}

export const getCurrentArena = async (gradeId: string): Promise<ArenaResponse> => {
    try {
        const response = await api.get(`/arenas/current?gradeId=${gradeId}`);
        const data = response.data as ArenaResponse;
        return data;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getRankById = async (id: string): Promise<RankResponse> => {
    try {
        const response = await api.get(`/ranks/${id}`);
        const data = response.data.data as RankResponse;
        return data;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const getParticipations = async (params?: Record<string, any>): Promise<ParticipationResponse[]> => {
    try {
        const response = await api.get(`/participations`, { params });
        const data = response.data.items as ParticipationResponse[];
        return data;
    } catch (error) {
        handleError(error);
        return []; // Never reached
    }
}

export const getLeaderboard = async (params?: Record<string, any>): Promise<LeaderboardResponse> => {
    try {
        const response = await api.get(`/participations/leaderboard`, { params });
        const data = response.data as LeaderboardResponse;
        return data;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const createParticipation = async (req: CreateParticipationRequest): Promise<ParticipationResponse> => {
    try {
        const response = await api.post(`/participations`, req);
        const data = response.data as ParticipationResponse;
        return data;
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}

export const updateParticipation = async (id: string, req: UpdateParticipationRequest) => {
    try {
        await api.put(`/participations/${id}`, req);
    } catch (error) {
        handleError(error);
        throw error; // Never reached
    }
}