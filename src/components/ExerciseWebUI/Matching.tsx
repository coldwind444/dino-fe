"use client";

import { ExerciseResponse } from "@/types/dto.types";
import { useEffect, useState, useMemo, useRef } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

interface LineData {
  left: string;
  right: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface MatchingProps {
  exercise: ExerciseResponse;
  answer: any;
  onChange: (answer: any) => void;
}

export default function Matching({
  exercise,
  answer,
  onChange,
}: MatchingProps) {
  const pairs = exercise.pairs || [];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const rightRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [lines, setLines] = useState<LineData[]>([]);

  const leftItems = useMemo(
    () => pairs.map((p) => p.left).sort(() => Math.random() - 0.5),
    [exercise._id],
  );

  const rightItems = useMemo(
    () => pairs.map((p) => p.right).sort(() => Math.random() - 0.5),
    [exercise._id],
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [currentPairs, setCurrentPairs] = useState<{ [key: string]: string }>(
    {},
  );

  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = Object.entries(currentPairs)
      .map(([left, right]) => {
        const leftEl = leftRefs.current[left];
        const rightEl = rightRefs.current[right];
        if (leftEl && rightEl) {
          const leftRect = leftEl.getBoundingClientRect();
          const rightRect = rightEl.getBoundingClientRect();

          return {
            left,
            right,
            x1: leftRect.right - containerRect.left - 2,
            y1: leftRect.top + leftRect.height / 2 - containerRect.top,
            x2: rightRect.left - containerRect.left,
            y2: rightRect.top + rightRect.height / 2 - containerRect.top,
          };
        }
        return null;
      })
      .filter((line): line is LineData => !!line);
    setLines(newLines);
  };

  useEffect(() => {
    updateLines();
    const timer = setTimeout(updateLines, 100); // Small delay to ensure DOM is ready
    window.addEventListener("resize", updateLines);
    return () => {
      window.removeEventListener("resize", updateLines);
      clearTimeout(timer);
    };
  }, [currentPairs, leftItems, rightItems]);

  useEffect(() => {
    if (Array.isArray(answer)) {
      const parsedPairs: { [key: string]: string } = {};
      answer.forEach((p: any) => {
        if (p.left && p.right) {
          parsedPairs[p.left] = p.right;
        }
      });
      setCurrentPairs(parsedPairs);
    } else {
      setCurrentPairs({});
    }
  }, [exercise._id, answer]);

  const emitChange = (pairsDict: { [key: string]: string }) => {
    const formatted = Object.keys(pairsDict).map(k => ({
      left: k,
      right: pairsDict[k]
    }));
    onChange(formatted);
  };

  const handleLeftClick = (left: string) => {
    if (selectedLeft === left) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(left);
    }
  };

  const handleRightClick = (right: string) => {
    if (selectedLeft) {
      const newPairs = { ...currentPairs };
      // If this right side was already paired, remove its previous pairing
      Object.keys(newPairs).forEach((key) => {
        if (newPairs[key] === right) delete newPairs[key];
      });
      newPairs[selectedLeft] = right;
      setCurrentPairs(newPairs);
      setSelectedLeft(null);
      emitChange(newPairs);
    }
  };

  const removePairing = (left: string) => {
    const newPairs = { ...currentPairs };
    delete newPairs[left];
    setCurrentPairs(newPairs);
    emitChange(newPairs);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-row justify-between w-full px-4 min-h-[300px]"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {lines.map((line) => (
          <g
            key={`${line.left}-${line.right}`}
            className="group cursor-pointer pointer-events-auto transition-all duration-200"
            onClick={() => removePairing(line.left)}
          >
            {/* Invisible wider line for easier clicking (hitbox) */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="transparent"
              strokeWidth="20"
              className="cursor-pointer"
            />
            {/* Visible line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#23BEAA"
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-colors duration-200 group-hover:stroke-red-400"
            />
            <circle
              cx={line.x1}
              cy={line.y1}
              r="5"
              fill="#23BEAA"
              className="transition-colors duration-200 group-hover:fill-red-400"
            />
            <circle
              cx={line.x2}
              cy={line.y2}
              r="5"
              fill="#23BEAA"
              className="transition-colors duration-200 group-hover:fill-red-400"
            />
          </g>
        ))}
      </svg>

      <div className="flex flex-col gap-4 w-1/3 z-0">
        {leftItems.map((left, idx) => {
          const isPaired = !!currentPairs[left];
          const isSelected = selectedLeft === left;
          return (
            <div
              key={idx}
              ref={(el) => {
                leftRefs.current[left] = el;
              }}
              className={clsx(
                "group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium text-center text-lg",
                isSelected
                  ? "border-[#F9740B] bg-[#FFF3E6] scale-105"
                  : isPaired
                    ? "border-[#23BEAA] bg-[#D8FFFA] text-[#23BEAA]"
                    : "border-[#4E5660] bg-white hover:border-[#F9740B]",
              )}
              onClick={() => handleLeftClick(left)}
            >
              <div className="break-words">{left}</div>
              {isPaired && (
                <button
                  className="absolute right-2 top-2 p-1 rounded-full hover:bg-[#23BEAA] hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePairing(left);
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 w-1/3 z-0">
        {rightItems.map((right, idx) => {
          const pairedLeft = Object.keys(currentPairs).find(
            (key) => currentPairs[key] === right,
          );
          const isPaired = !!pairedLeft;
          return (
            <div
              key={idx}
              ref={(el) => {
                rightRefs.current[right] = el;
              }}
              className={clsx(
                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium text-center text-lg",
                isPaired
                  ? "border-[#23BEAA] bg-[#D8FFFA] text-[#23BEAA]"
                  : "border-[#4E5660] bg-white hover:border-[#F9740B]",
              )}
              onClick={() => handleRightClick(right)}
            >
              <div className="break-words">{right}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
