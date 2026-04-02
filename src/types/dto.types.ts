// Request
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: string;
    name?: string;
    avatarUrl?: string;
    familyId?: string;
}

export interface LoginRequest {
    identifier: string;
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

export interface CreateAnswerRequest {
    userId: string,
    exerciseId: string,
    answerData: object,
    isCorrect: boolean,
    score: number,
    assessmentResultId: string,
    arenaParticipationId: string,
    lectureResultId: string
}

export interface CreateParticipationRequest {
    arenaId: string,
    correctCount: number,
    timeTaken: number,
    score: number,
    status: string
}

export interface UpdateParticipationRequest {
    correctCount: number,
    timeTaken: number,
    score: number,
    finishedAt: string,
    status: string
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
    user: {
        id: string;
        email: string;
        role: string;
        name: string;
        avatarUrl: string;
    }
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
    createdAt: string;
    updatedAt: string;
    familyId: string;
    gradeId: string;
    rankId: string;
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
    weekNumbers: number[],
    level: number
}

export interface LectureResponse {
    _id: string,
    title: string,
    contentType: string,
    description: string,
    difficulty: string,
    topicId: string,
    order: number
}

export interface ExerciseResponse {
    _id: string,
    question: string,
    type: string,
    options: string[],
    pairs: { left: string, right: string }[],
    correctAnswer: string,
    content: string,
    metadata: object,
    difficulty: string,
    lectureId: string,
    category: string;
    order: number;
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

export interface RankResponse {
    _id: string,
    title: string,
    badge: string,
    color: string,
    __v: number
}

export interface ParticipationResponse {
    _id: string,
    userId: {
        _id: string,
        name: string,
        avatarUrl: string,
        email: string,
    },
    arenaId: {
        _id: string,
        title: string,
        description: string,
        startTime: string,
        endTime: string
    },
    correctCount: number,
    timeTaken: number,
    score: number,
    finishedAt: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    status: string
}

export interface LeaderboardResponse {
    arena: {
        id: string,
        title: string,
        description: string
    },
    leaderboard: {
        _id: string,
        user: {
            _id: string,
            name: string,
            email: string,
            avatarUrl: string
        },
        arenaId: string,
        correctCount: number,
        timeTaken: number,
        score: number
    }[],
    total: number
}

export interface ArenaResponse {
    _id: string,
    title: string,
    description: string,
    period: string,
    startTime: string,
    endTime: string,
    gradeId: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    __v: number,
    status: string
}

export interface AnswerResponse {
    _id: string,
    exerciseId: string,
    answerData: any,
    userId: string,
    isCorrect: boolean,
    score: number,
    assessmentResultId: string,
    arenaParticipationId: string,
    lectureResultId: string
}

export interface AssessmentResponse {
    _id: string,
    title: string,
    description: string,
    gradeId: string,
    published: boolean,
    createdAt: string,
    updatedAt: string,
}

export interface AssessmentResultResponse {
    assessmentId: string,
    userId: string,
    duration: number,
    status: string,
    totalScore: number,
}