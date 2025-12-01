import React from "react";
import clsx from "clsx";

// ----------------------
// Type Definitions
// ----------------------
export type MultipleChoiceAnswer = string;
export type TrueFalseAnswer = boolean | "Đúng" | "Sai";

export type MatchingPair = {
  left: string;
  right: string;
};

export type FillBlankAnswer = string[]; // Each blank is one element

export type ExerciseType =
  | "multiple-choice"
  | "true-false"
  | "matching"
  | "fill-in-blank";

// Discriminated union for the data prop
export type AnswerDetailData =
  | {
      type: "multiple-choice";
      questionNumber: number;
      status: "correct" | "wrong" | "partial";
      question: string;
      studentAnswer: MultipleChoiceAnswer;
      correctAnswer: MultipleChoiceAnswer;
    }
  | {
      type: "true-false";
      questionNumber: number;
      status: "correct" | "wrong" | "partial";
      question: string;
      studentAnswer: TrueFalseAnswer;
      correctAnswer: TrueFalseAnswer;
    }
  | {
      type: "matching";
      questionNumber: number;
      status: "correct" | "wrong" | "partial";
      question: string;
      studentAnswer: MatchingPair[];
      correctAnswer: MatchingPair[];
    }
  | {
      type: "fill-in-blank";
      questionNumber: number;
      status: "correct" | "wrong" | "partial";
      question: string;
      // studentAnswer is array of strings (each blank), correctAnswer is array of strings
      studentAnswer: FillBlankAnswer;
      correctAnswer: FillBlankAnswer;
    };

// Props for the main component
export interface AnswerDetailProps {
  data: AnswerDetailData;
}

export default function AnswerDetail({ data }: AnswerDetailProps) {
  const { questionNumber, type, status, question } = data as AnswerDetailData;

  return (
    <div
      className={clsx(
        "w-full rounded-2xl p-5 border mb-6",
        status === "correct" && "border-green-400 bg-green-50",
        status === "wrong" && "border-red-400 bg-red-50",
        status === "partial" && "border-orange-400 bg-orange-50"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-sm font-semibold",
              status === "correct" && "bg-green-500 text-white",
              status === "wrong" && "bg-red-500 text-white",
              status === "partial" && "bg-orange-500 text-white"
            )}
          >
            {status === "correct" ? "Đúng" : status === "wrong" ? "Sai" : "Đúng một phần"}
          </span>
          <span className="font-medium">Câu số {questionNumber}:</span>
        </div>
        <span className="px-3 py-1 rounded-lg bg-gray-200 text-sm font-medium">
          {type === "multiple-choice" && "Trắc nghiệm"}
          {type === "true-false" && "Đúng/Sai"}
          {type === "matching" && "Ghép nối"}
          {type === "fill-in-blank" && "Điền khuyết"}
        </span>
      </div>

      {/* Question */}
      <p className="font-medium mb-4">{question}</p>

      {/* Render based on exercise type */}
      {type === "multiple-choice" && (
        <MultipleChoice
          student={(data as Extract<AnswerDetailData, { type: "multiple-choice" }>).studentAnswer}
          correct={(data as Extract<AnswerDetailData, { type: "multiple-choice" }>).correctAnswer}
        />
      )}

      {type === "true-false" && (
        <TrueFalse
          student={(data as Extract<AnswerDetailData, { type: "true-false" }>).studentAnswer}
          correct={(data as Extract<AnswerDetailData, { type: "true-false" }>).correctAnswer}
        />
      )}

      {type === "matching" && (
        <Matching
          student={(data as Extract<AnswerDetailData, { type: "matching" }>).studentAnswer}
          correct={(data as Extract<AnswerDetailData, { type: "matching" }>).correctAnswer}
        />
      )}

      {type === "fill-in-blank" && (
        <FillInBlank
          student={(data as Extract<AnswerDetailData, { type: "fill-in-blank" }>).studentAnswer}
          correct={(data as Extract<AnswerDetailData, { type: "fill-in-blank" }>).correctAnswer}
        />
      )}
    </div>
  );
}

// ----------------------
// Subcomponents (typed)
// ----------------------

// MULTIPLE CHOICE
function MultipleChoice({
  student,
  correct,
}: {
  student: MultipleChoiceAnswer;
  correct: MultipleChoiceAnswer;
}) {
  const isCorrect = student === correct;
  return (
    <div className="flex flex-col gap-2">
      <div className="font-medium">Câu trả lời của học sinh:</div>
      <div className={clsx("p-3 rounded-xl border w-fit", isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400")}>{student}</div>
      <div className="font-medium">Đáp án:</div>
      <div className="p-3 rounded-xl border w-fit bg-gray-100 border-gray-300">{correct}</div>
    </div>
  );
}

// TRUE / FALSE
function TrueFalse({ student, correct }: { student: TrueFalseAnswer; correct: TrueFalseAnswer }) {
  const isCorrect = student === correct;
  return (
    <div className="flex flex-col gap-2">
      <div className="font-medium">Câu trả lời của học sinh:</div>
      <div className={clsx("p-3 rounded-xl border w-fit", isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400")}>
        {String(student)}
      </div>
      <div className="font-medium">Đáp án:</div>
      <div className="p-3 rounded-xl border w-fit bg-gray-100 border-gray-300">{String(correct)}</div>
    </div>
  );
}

// MATCHING
function Matching({ student, correct }: { student: MatchingPair[]; correct: MatchingPair[] }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Student answers */}
      <div>
        <div className="font-medium mb-2">Câu trả lời của học sinh:</div>
        {student.map((pair, i) => {
          const isPairCorrect = Boolean(correct[i] && pair.right === correct[i].right && pair.left === correct[i].left);
          return (
            <div key={i} className="flex items-center gap-3 mb-2">
              <div className={clsx("p-2 px-4 rounded-xl border w-fit", isPairCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400")}>
                {pair.left}
              </div>
              <span>➜</span>
              <div className={clsx("p-2 px-4 rounded-xl border w-fit", isPairCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400")}>
                {pair.right}
              </div>
            </div>
          );
        })}
      </div>

      {/* Correct answers */}
      <div>
        <div className="font-medium mb-2">Đáp án:</div>
        {correct.map((pair, i) => (
          <div key={i} className="flex items-center gap-3 mb-2 opacity-80">
            <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit">{pair.left}</div>
            <span>➜</span>
            <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit">{pair.right}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// FILL IN BLANK
function FillInBlank({ student, correct }: { student: string[]; correct: string[] }) {
  // Show each blank with colored background depending on correctness
  return (
    <div className="flex flex-col gap-4">
      <div className="font-medium">Câu trả lời của học sinh:</div>
      {student.map((ans, i) => {
        const isCorrect = correct[i] !== undefined && ans.trim() === correct[i].trim();
        return (
          <div key={i} className="flex items-center gap-3 mb-2">
            <div className={clsx("p-2 px-4 rounded-xl border w-fit", isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400")}>
              {ans}
            </div>
          </div>
        );
      })}

      <div className="font-medium">Đáp án:</div>
      {correct.map((ans, i) => (
        <div key={i} className="mb-2">
          <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit">{ans}</div>
        </div>
      ))}
    </div>
  );
}
