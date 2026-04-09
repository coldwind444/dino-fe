import { AnswerResponse, ExerciseResponse } from "@/types";

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

export function checkAnswerForBasicExerciseType(ans: AnswerResponse, ex: ExerciseResponse): boolean {
    switch (ex.type) {
        case "matching": {
            try {
                const ansArray = typeof ans.answerData === "string" ? JSON.parse(ans.answerData) : (ans.answerData || []);
                const correctArray = typeof ex.correctAnswer === "string" ? JSON.parse(ex.correctAnswer) : (ex.correctAnswer || []);

                if (!Array.isArray(ansArray) || !Array.isArray(correctArray)) {
                    return ans.answerData === ex.correctAnswer;
                }

                if (ansArray.length !== correctArray.length) return false;

                return correctArray.every((correctPair: any) =>
                    ansArray.some(
                        (ansPair: any) =>
                            ansPair?.left === correctPair?.left &&
                            ansPair?.right === correctPair?.right
                    )
                );
            } catch (error) {
                return ans.answerData === ex.correctAnswer;
            }
        }
        case "choice":
            return ans.answerData === ex.correctAnswer;
        case "interactive":
            return ans.answerData === ex.correctAnswer;
        case "fill_in":
            return ans.answerData === ex.correctAnswer;
        case "true_false":
            return ans.answerData === ex.correctAnswer;
    }
    throw new Error("Invalid exercise type");
}