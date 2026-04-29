import { AnswerResponse, ExerciseResponse } from "@/types";

export const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanedAnswer(ans: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: any = {};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanedAnswerArray(anss: any[]) {
    if (!Array.isArray(anss)) return [];
    return anss.map(cleanedAnswer);
}

export function checkAnswerForBasicExerciseType(ans: AnswerResponse, ex: ExerciseResponse): boolean {
    switch (ex.type) {
        case "matching": {
            for (const val of ans.answerData as { answer: string, placedCorrectly: boolean }[]) {
                if (val.placedCorrectly === false) return false;
            }
            return true;
        }
        case "choice": {
            const userAnswer = ex.options[ans.answerData.selectedIndex];
            return userAnswer === ex.correctAnswer;
        }
        case "interactive":
            return ans.answerData.answer === ex.correctAnswer;
        case "fill_in": {
            const correctAnswerArray = ex.correctAnswer.split(",");
            let index = 0;
            for (const key in ans.answerData) {
                if (ans.answerData[key] !== correctAnswerArray[index]) {
                    return false;
                }
                index++;
            }
            return true;
        }
        case "true_false": {
            const boolAns = ex.correctAnswer === "true" ? true : false;
            return ans.answerData.selectedAnswer === boolAns;
        }
    }
    throw new Error("Invalid exercise type");
}

export function formatNumberAbbreviation(num: number): string {
    const absNum = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    if (absNum < 1000) {
        return num.toString();
    }

    const units = [
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "B" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" },
    ];

    for (const unit of units) {
        if (absNum >= unit.value) {
            const formatted = (absNum / unit.value).toFixed(1).replace(/\.0$/, "");
            return `${sign}${formatted}${unit.symbol}`;
        }
    }

    return num.toString();
}


