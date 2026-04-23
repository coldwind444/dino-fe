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
  topicId: string;
  lectureId: string;
  completion: number;
  status: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  avatarUrl?: string;
  gradeId?: string;
}

export interface CreateAnswerRequest {
  userId: string;
  exerciseId: string;
  answerData: object;
  isCorrect: boolean;
  score: number;
  assessmentResultId: string;
  arenaParticipationId: string;
  lectureResultId: string;
}

export interface CreateParticipationRequest {
  arenaId: string;
  correctCount: number;
  timeTaken: number;
  score: number;
  status: string;
}

export interface UpdateParticipationRequest {
  correctCount: number;
  timeTaken: number;
  score: number;
  finishedAt: string;
  status: string;
}

export interface GoogleLoginRequest {
  token: string;
  role: string;
  familyId?: string;
}

export interface CreateAssessmentResultRequest {
  assessmentId: string;
  userId: string;
  duration: number;
  status: string;
  totalScore: number;
}

export interface CreateLectureResultRequest {
  lectureId: string;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number;
}

export interface UpdateMissionProgressRequest {
  unitType: string;
  amount: number;
}

export interface PurchasePremiumRequest {
  packageId: string;
  paymentMethod: 'momo' | 'zalopay' | 'vnpay' | 'bank_transfer';
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
  user: UserResponse;
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
  };
}

export interface UserProfileResponse {
  settings: {
    language: string;
    notifications: boolean;
  };
  premium: {
    isPremium: boolean;
    packageId: string;
    startDate: string;
    expiryDate: string;
  };
  _id: string;
  quartz: number;
  battlePoints: number;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  familyId: string;
  gradeId: string;
  rankId: string;
}

export interface AvatarUploadResponse {
  message: string;
  avatarUrl: string;
}

export interface GradeResponse {
  _id: string;
  name: string;
  level: number;
  description: string;
  worldId: string;
  __v: number;
}

export interface GradeProgressResponse {
  gradeId: string;
  total: number;
  completed: number;
  percent: number;
}

export interface WorldResponse {
  _id: string;
  name: string;
  milestoneUrl: string;
  __v: number;
}

export interface LandResponse {
  _id: string;
  name: string;
  difficulty: string;
  imageUrl: string;
}

export interface TopicResponse {
  _id: string;
  title: string;
  description: string;
  gradeId: string;
  termId: string;
  weekNumbers: number[];
  isPremium: boolean;
  level: number;
}

export interface LectureResponse {
  _id: string;
  title: string;
  contentType: string;
  description: string;
  difficulty: string;
  topicId: string;
  order: number;
  theory: {
    content: string;
    videoUrl?: string;
    imageUrls?: string[];
  };
}

export interface ExerciseResponse {
  _id: string;
  question: string;
  type: string;
  options: string[];
  pairs: { left: string; right: string }[];
  correctAnswer: string;
  content: string;
  metadata: object;
  difficulty: string;
  lectureId: string;
  category: string;
  order: number;
  explanation: string;
}

export interface TermResponse {
  _id: string;
  name: string;
  year: number;
  term: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  isOngoing: boolean;
  __v: number;
}

export interface RankResponse {
  _id: string;
  title: string;
  badge: string;
  color: string;
  __v: number;
}

export interface ParticipationResponse {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatarUrl: string;
    email: string;
  };
  arenaId: {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
  correctCount: number;
  timeTaken: number;
  score: number;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: string;
}

export interface LeaderboardResponse {
  arena: {
    id: string;
    title: string;
    description: string;
  };
  leaderboard: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      avatarUrl: string;
    };
    arenaId: string;
    correctCount: number;
    timeTaken: number;
    score: number;
  }[];
  total: number;
}

export interface ArenaResponse {
  _id: string;
  title: string;
  description: string;
  period: string;
  startTime: string;
  endTime: string;
  gradeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: string;
}

export interface AnswerResponse {
  _id: string;
  exerciseId: string;
  exercise?: ExerciseResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answerData: any;
  userId: string;
  isCorrect: boolean;
  score: number;
  assessmentResultId: string;
  arenaParticipationId: string;
  lectureResultId: string;
}

export interface AssessmentResponse {
  _id: string;
  title: string;
  description: string;
  gradeId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResultResponse {
  _id: string;
  assessmentId: string;
  userId: string;
  duration: number;
  status: string;
  totalScore: number;
}

export interface LectureResultResponse {
  _id: string;
  lectureId: string;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number;
}

export interface AchievementResponse {
  _id: string; // Mission ID
  title: string;
  description: string;
  unitType: string;
  goal: number;
  rewardType: string;
  reward: number;
  progress: number;
  finished: boolean;
  claimed: boolean;
  achievementId: string;
}

export interface MiniGameResponse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  gameType: string;
  gameUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StudentStatsResponse {
  summary: {
    totalExercisesDone: number;
    accuracy: number;
  };
  study: {
    topicsLearned: number;
    correctRate: number;
    activeHours: number;
  };
  arena: {
    currentRank: string | RankResponse;
    battlePoints: number;
    weeklyRank: number;
    overallRank: number;
    correctRate: number;
  };
}
export interface LectureResultDetailedResponse {
  _id: string;
  lectureId: LectureResponse | string;
  userId: string;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number;
  score?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AssessmentResultDetailedResponse {
  _id: string;
  assessmentId: AssessmentResponse | string;
  userId: string;
  duration: number;
  status: string;
  totalScore: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ParticipationDetailedResponse {
  _id: string;
  userId:
  | {
    _id: string;
    name: string;
    avatarUrl: string;
    email: string;
  }
  | string;
  arenaId:
  | {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }
  | string;
  correctCount: number;
  timeTaken: number;
  score: number;
  finishedAt: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
}

export interface HistoryRecord {
  _id: string;
  name: string;
  title?: string;
  accuracy: number;
  date: string;
  rawDate?: Date;
  duration: string;
  category: "exercise" | "arena" | "assessment";
  correctCount?: number;
  totalQuestions?: number;
  studentName?: string;
}

export interface QuartzLeaderboardItemResponse {
  _id: string;
  name: string;
  avatarUrl: string;
  quartz: number;
  battlePoints: number;
}

export interface TransactionResponse {
  userId: string;
  packageId: string;
  amount: number;
  paymentMethod: "momo" | "zalopay" | "vnpay" | "bank_transfer" | "internal";
  status: "pending" | "completed" | "failed";
  transactionId: string;
  processedAt: string;
}

export interface PackageResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}