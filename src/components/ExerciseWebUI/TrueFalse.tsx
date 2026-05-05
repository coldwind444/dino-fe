"use client";

import { ExerciseResponse } from "@/types/dto.types";
import clsx from "clsx";

interface TrueFalseProps {
  exercise: ExerciseResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (answer: any) => void;
}

export default function TrueFalse({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exercise,
  answer,
  onChange,
}: TrueFalseProps) {
  const selectedAnswer = answer?.selectedAnswer ?? null;

  const handleSelect = (option: boolean) => {
    if (selectedAnswer === option) {
      onChange({});
    } else {
      onChange({ selectedAnswer: option });
    }
  };

  return (
    <div className="flex flex-row gap-10 justify-center w-full">
      <div
        className={clsx(
          "h-fit w-fit py-4 px-14 rounded-4xl border-2 text-balance font-bold cursor-pointer transition-all duration-200 text-xl",
          selectedAnswer === true
            ? "bg-[#D8FFFA] border-[#23BEAA] text-[#23BEAA] scale-105"
            : "bg-white border-[#4E5660] text-[#1B2657] hover:border-[#23BEAA]",
        )}
        data-testid="true-option"
        onClick={() => handleSelect(true)}
      >
        Đúng
      </div>
      <div
        className={clsx(
          "h-fit w-fit py-4 px-14 rounded-4xl border-2 text-balance font-bold cursor-pointer transition-all duration-200 text-xl",
          selectedAnswer === false
            ? "bg-[#f6dada] border-[#FF5964] text-[#FF5964] scale-105"
            : "bg-white border-[#4E5660] text-[#1B2657] hover:border-[#FF5964]",
        )}
        data-testid="false-option"
        onClick={() => handleSelect(false)}
      >
        Sai
      </div>
    </div>
  );
}
