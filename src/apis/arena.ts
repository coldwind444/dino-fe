import api, { handleError } from "./config";
import {
  ArenaResponse,
  ParticipationDetailedResponse,
  ParticipationResponse,
  RankResponse,
  LeaderboardResponse,
  CreateParticipationRequest,
  UpdateParticipationRequest,
} from "@/types/dto.types";
import { Pagination } from "@/types";

export type PaginatedArenaResponse = {
  items: ArenaResponse[];
  pagination: Pagination;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getArena = async (
  params?: Record<string, any>,
): Promise<ArenaResponse[]> => {
  try {
    const response = await api.get("/arenas", { params });
    const data = response.data as PaginatedArenaResponse;
    return data.items;
  } catch (error) {
    handleError(error);
    return []; // Never reached due to handleError throwing
  }
};

export const getCurrentArena = async (
  gradeId: string,
): Promise<ArenaResponse> => {
  try {
    const response = await api.get(`/arenas/current?gradeId=${gradeId}`);
    const data = response.data as ArenaResponse;
    return data;
  } catch (error) {
    handleError(error);
    throw error; // Never reached
  }
};

export const getParticipationById = async (
  id: string,
): Promise<ParticipationDetailedResponse> => {
  try {
    const response = await api.get(`/participations/${id}`);
    return (response.data.data ??
      response.data) as ParticipationDetailedResponse;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getRankById = async (id: string): Promise<RankResponse> => {
  try {
    const response = await api.get(`/ranks/${id}`);
    const data = response.data.data as RankResponse;
    return data;
  } catch (error) {
    handleError(error);
    throw error; // Never reached
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getParticipations = async (
  params?: Record<string, any>,
): Promise<ParticipationResponse[]> => {
  try {
    const response = await api.get(`/participations`, { params });
    const data = response.data.items as ParticipationResponse[];
    return data;
  } catch (error) {
    handleError(error);
    return []; // Never reached
  }
};

export type PaginatedParticipationDetailedResponse = {
  items: ParticipationDetailedResponse[];
  pagination: Pagination;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getParticipationsPaginated = async (
  params?: Record<string, any>,
): Promise<PaginatedParticipationDetailedResponse> => {
  try {
    const response = await api.get(`/participations`, { params });
    console.log("[getParticipationsPaginated] raw response:", response.data);
    const items: ParticipationDetailedResponse[] =
      response.data.items ?? response.data.data ?? [];
    const pagination: Pagination = response.data.pagination ?? {
      total: items.length,
      page: 1,
      limit: items.length,
      totalPages: 1,
    };
    return { items, pagination };
  } catch (error) {
    handleError(error);
    throw error; // Never reached
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLeaderboard = async (
  params?: Record<string, any>,
): Promise<LeaderboardResponse> => {
  try {
    const response = await api.get(`/participations/leaderboard`, { params });
    const data = response.data as LeaderboardResponse;
    return data;
  } catch (error) {
    handleError(error);
    throw error; // Never reached
  }
};

export const createParticipation = async (
  req: CreateParticipationRequest,
): Promise<ParticipationResponse> => {
  try {
    const response = await api.post(`/participations`, req);
    const data = response.data as ParticipationResponse;
    return data;
  } catch (error) {
    handleError(error);
    throw error; // Never reached
  }
};

export const updateParticipation = async (
  id: string,
  req: UpdateParticipationRequest,
) => {
  try {
    await api.put(`/participations/${id}`, req);
  } catch (error) {
    handleError(error);
    throw error; // Never reached
  }
};
