export function cleanedAnswer(ans: any) {
    let cleaned: any = {};

    // Id
    if (!String(ans._id).startsWith("temp-") && ans._id !== "") {
        cleaned._id = ans._id;
    }

    // Required fields
    cleaned.exerciseId = ans.exerciseId;
    cleaned.userId = ans.userId;
    cleaned.answerData = ans.answerData;
    cleaned.isCorrect = ans.isCorrect;
    cleaned.score = ans.score;

    // Optional fields
    if (ans.assessmentResultId) cleaned.assessmentResultId = ans.assessmentResultId;
    if (ans.arenaParticipationId) cleaned.arenaParticipationId = ans.arenaParticipationId;
    if (ans.lectureResultId) cleaned.lectureResultId = ans.lectureResultId;

    return cleaned;
}

export function cleanedAnswerArray(anss: any[]) {
    if (!Array.isArray(anss)) return [];
    return anss.map(cleanedAnswer);
}
