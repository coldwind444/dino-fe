export interface RegisterRequest {
    email: string;
    password: string;
    role: string;
    name?: string;
    avatarUrl?: string;
    familyId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface CompleteProfileRequest {
    inviteCode: string;
    name: string;
    avatarUrl: string;
}

export interface UserResponse {
    id: string;
    email: string;
    role: string;
    name: string;
    avatarUrl: string;
}

export interface RegisterResponse {
    message: string;
    user: UserResponse
}

export interface LoginResponse {
    message: string;
    token: string;
    user: UserResponse
}

export interface UserProfileResponse {
    settings: {
        language: string;
        notifications: boolean;
    };
    _id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: string; // can be expanded if needed
    status: string; // optional enumeration
    students: string[]; // assuming student IDs or empty array
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
};
