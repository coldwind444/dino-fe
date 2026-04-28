"use client";

import { ExerciseResponse } from "@/types/dto.types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface InteractiveProps {
  exercise: ExerciseResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (answer: any) => void;
}

export default function Interactive({
  exercise,
  answer,
  onChange,
}: InteractiveProps) {
  const options = exercise.options || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = (exercise.metadata as any) || {};
  const expression = metadata.expression || "";

  // blanks[i] = the option currently in the i-th blank
  const [blanks, setBlanks] = useState<string[]>([]);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);

  useEffect(() => {
    const numBlanks = (expression.match(/_/g) || []).length || 1;
    if (answer && typeof answer.answer === "string") {
      const val = answer.answer;
      const arr = new Array(numBlanks).fill("");
      if (val) arr[0] = val;
      setBlanks(arr);
      setUsedOptions(val ? [val] : []);
    } else if (Array.isArray(answer)) {
      setBlanks(answer);
      setUsedOptions(answer.filter((b: string) => b !== ""));
    } else {
      setBlanks(new Array(numBlanks).fill(""));
      setUsedOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise._id, answer]);

  const handleOptionClick = (option: string) => {
    // If it's already used, we don't do anything (or we could allow reusing)
    if (usedOptions.includes(option)) return;

    // Find first empty blank
    const firstEmpty = blanks.findIndex((b) => b === "");
    if (firstEmpty !== -1) {
      const newBlanks = [...blanks];
      newBlanks[firstEmpty] = option;
      setBlanks(newBlanks);
      setUsedOptions([...usedOptions, option]);
      onChange({ answer: newBlanks[0] || "" });
    }
  };

  const removeBlank = (idx: number) => {
    const option = blanks[idx];
    if (option === "") return;

    const newBlanks = [...blanks];
    newBlanks[idx] = "";
    setBlanks(newBlanks);
    setUsedOptions(usedOptions.filter((o) => o !== option));
    onChange({ answer: newBlanks[0] || "" });
  };

  const parts = expression.split("_");

  return (
    <div className="flex flex-col gap-10 items-center w-full">
      {/** The sentence with blanks */}
      <div className="flex flex-row flex-wrap gap-2 items-center text-xl font-medium text-[#1B2657] justify-center text-center leading-[3rem]">
        {parts.map((part: string, idx: number) => (
          <div key={idx} className="flex flex-row items-center gap-2">
            <span>{part}</span>
            {idx < parts.length - 1 && (
              <div
                className={clsx(
                  "min-w-[100px] h-12 border-2 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer shadow-inner",
                  blanks[idx]
                    ? "bg-[#D8FFFA] border-[#23BEAA] text-[#23BEAA] font-bold"
                    : "bg-[#F3F4F6] border-dashed border-[#9CA3AF] text-[#9CA3AF] text-sm",
                )}
                data-testid="interactive-blank"
                onClick={() => removeBlank(idx)}
              >
                {blanks[idx] || "Kéo vào đây"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/** The source options */}
      <div className="flex flex-row flex-wrap gap-4 justify-center mt-5">
        {options.map((option, idx) => {
          const isUsed = usedOptions.includes(option);
          return (
            <motion.div
              key={idx}
              whileHover={!isUsed ? { scale: 1.05 } : {}}
              whileTap={!isUsed ? { scale: 0.95 } : {}}
              className={clsx(
                "py-3 px-8 rounded-xl border-2 font-bold cursor-pointer shadow-md transition-colors",
                isUsed
                  ? "bg-gray-200 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed"
                  : "bg-white border-[#3B84F2] text-[#3B84F2] hover:bg-[#3B84F2] hover:text-white",
              )}
              data-testid="interactive-option"
              onClick={() => !isUsed && handleOptionClick(option)}
            >
              {option}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
