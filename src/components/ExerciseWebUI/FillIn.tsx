"use client";

import { ExerciseResponse } from "@/types/dto.types";
import { useEffect, useState } from "react";

interface FillInProps {
  exercise: ExerciseResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (answer: any) => void;
}

export default function FillIn({ exercise, answer, onChange }: FillInProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = (exercise.metadata as any) || {};
  const questions = metadata.questions || [];

  // Initialize internal state from answer or default to empty strings
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    if (answer) {
      const newResponses = [];
      for (let i = 0; i < questions.length; i++) {
        newResponses.push(answer[`answer${i + 1}`] || "");
      }
      setResponses(newResponses);
    } else {
      setResponses(new Array(questions.length).fill(""));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise._id, answer]);

  const handleInputChange = (idx: number, value: string) => {
    const newResponses = [...responses];
    newResponses[idx] = value;
    setResponses(newResponses);
    
    // Convert to target object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const outObj: any = {};
    newResponses.forEach((res, i) => {
      outObj[`answer${i + 1}`] = res;
    });
    onChange(outObj);
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
