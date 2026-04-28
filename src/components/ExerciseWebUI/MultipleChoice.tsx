"use client";

import { ExerciseResponse } from "@/types/dto.types";
import clsx from "clsx";

interface MultipleChoiceProps {
  exercise: ExerciseResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (answer: any) => void;
}

export default function MultipleChoice({
  exercise,
  answer,
  onChange,
}: MultipleChoiceProps) {
  const selectedIndex = answer?.selectedIndex ?? null;

  const handleSelect = (idx: number) => {
    if (selectedIndex === idx) {
      onChange(null);
    } else {
      onChange({ selectedIndex: idx });
    }
  };

  return (
    <div className="flex flex-row flex-wrap gap-5 justify-center">
      {exercise.options.map((option, idx) => (
        <div
          key={idx}
          data-testid="choice-option"
          className={clsx(
            "h-fit w-fit py-4 px-10 rounded-4xl border-2 text-balance font-medium cursor-pointer transition-all duration-200",
            selectedIndex === idx
              ? "bg-[#D8FFFA] border-[#23BEAA] text-[#23BEAA] scale-105"
              : "bg-white border-[#4E5660] text-[#1B2657] hover:border-[#23BEAA]",
          )}
          onClick={() => handleSelect(idx)}
        >
          <p className="max-w-[300px] text-justify text-wrap">{option}</p>
        </div>
      ))}
    </div>
  );
}
