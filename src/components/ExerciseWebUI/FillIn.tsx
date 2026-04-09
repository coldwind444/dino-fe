"use client";

import { ExerciseResponse } from "@/types/dto.types";
import { useEffect, useState } from "react";

interface FillInProps {
  exercise: ExerciseResponse;
  answer: any;
  onChange: (answer: any) => void;
}

export default function FillIn({ exercise, answer, onChange }: FillInProps) {
  const metadata = (exercise.metadata as any) || {};
  const questions = metadata.questions || [];

  // Initialize internal state from answer or default to empty strings
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    if (answer?.responses) {
      setResponses(answer.responses);
    } else {
      setResponses(new Array(questions.length).fill(""));
    }
  }, [exercise._id, answer]);

  const handleInputChange = (idx: number, value: string) => {
    const newResponses = [...responses];
    newResponses[idx] = value;
    setResponses(newResponses);
    onChange(newResponses);
  };

  const renderQuestion = (question: string, idx: number) => {
    const parts = question.split("_");
    return (
      <div
        key={idx}
        className="flex flex-row items-center gap-3 text-lg font-medium text-[#1B2657]"
      >
        {parts.map((part, pIdx) => (
          <div key={pIdx} className="flex flex-row items-center gap-2">
            <span>{part}</span>
            {pIdx < parts.length - 1 && (
              <input
                type="text"
                className="w-24 h-10 border-b-2 border-[#23BEAA] focus:border-[#F9740B] outline-none text-center text-[#F9740B] font-bold"
                value={responses[idx] || ""}
                onChange={(e) => handleInputChange(idx, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 items-start w-full px-20">
      {questions.map((q: string, idx: number) => renderQuestion(q, idx))}
    </div>
  );
}
