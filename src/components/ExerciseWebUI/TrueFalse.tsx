'use client'

import { ExerciseResponse } from "@/types/dto.types";
import clsx from "clsx";

interface TrueFalseProps {
  exercise: ExerciseResponse;
  answer: any;
  onChange: (answer: any) => void;
}

export default function TrueFalse({ exercise, answer, onChange }: TrueFalseProps) {
  const selectedOption = answer?.selectedOption || null;

  const handleSelect = (option: string) => {
    onChange({ selectedOption: option });
  };

  return (
    <div className="flex flex-row gap-10 justify-center w-full">
      <div
        className={clsx(
          "h-fit w-fit py-4 px-14 rounded-4xl border-2 text-balance font-bold cursor-pointer transition-all duration-200 text-xl",
          selectedOption === "true"
            ? "bg-[#D8FFFA] border-[#23BEAA] text-[#23BEAA] scale-105"
            : "bg-white border-[#4E5660] text-[#1B2657] hover:border-[#23BEAA]"
        )}
        onClick={() => handleSelect("true")}
      >
        Đúng
      </div>
      <div
        className={clsx(
          "h-fit w-fit py-4 px-14 rounded-4xl border-2 text-balance font-bold cursor-pointer transition-all duration-200 text-xl",
          selectedOption === "false"
            ? "bg-[#D8FFFA] border-[#FF5964] text-[#FF5964] scale-105"
            : "bg-white border-[#4E5660] text-[#1B2657] hover:border-[#FF5964]"
        )}
        onClick={() => handleSelect("false")}
      >
        Sai
      </div>
    </div>
  );
}
