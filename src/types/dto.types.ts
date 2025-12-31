// Request
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
    inviteCode?: string;
    name: string;
    avatarUrl: string;
    gradeId: string;
}

export interface CreateProgressRequest {
    topicId: string,
    lectureId: string,
    completion: number,
    averageScore: number,
    status: string
}

export interface UpdateUserProfileRequest {
    name?: string
    avatarUrl?: string
    gradeId?: string
}

// Response
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
    quartz: number,
    battlePoints: number,
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
    status: string;
    students: string[];
    createdAt: string;
    updatedAt: string;
    familyId: string;
    gradeId: string;
};

export interface AvatarUploadResponse {
    message: string;
    avatarUrl: string;
}

export interface GradeResponse {
    _id: string,
    name: string,
    level: number,
    description: string,
    worldId: string,
    __v: number
}

export interface GradeProgressResponse {
    gradeId: string,
    total: number,
    completed: number,
    percent: number
}

export interface WorldResponse {
    _id: string,
    name: string,
    milestoneUrl: string,
    __v: number
}

export interface LandResponse {
    _id: string,
    name: string,
    difficulty: string,
    imageUrl: string,
}

export interface TopicResponse {
    _id: string,
    title: string,
    description: string,
    gradeId: string,
    termId: string,
    weekNumbers: number[]
}

export interface LectureResponse {
    _id: string,
    title: string,
    contentType: string,
    description: string,
    difficulty: string,
    topicId: string
}

export interface ExerciseResponse {
    _id: string,
    question: string,
    type: string,
    options: string[],
    pairs: { left: string, right: string }[],
    correctAnswer: string,
    content: string,
    metadata: Object,
    difficulty: string,
    lectureId: string,
    category: string
}

export interface TermResponse {
    _id: string,
    name: string,
    year: number,
    term: string,
    startDate: string,
    endDate: string,
    isActive: boolean,
    notes: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}