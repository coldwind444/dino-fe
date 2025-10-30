export interface RegisterRequest {
    email: string;
    password: string;
    role: string;
    name: string;
    avatarUrl: string;
    familyId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    id: string;
    email: string;
    role: string;
    name: string;
    avatarUrl: string;
    familyId?: string;
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
