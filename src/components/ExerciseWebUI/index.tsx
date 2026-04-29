import { ExerciseResponse } from "@/types/dto.types";
import MultipleChoice from "./MultipleChoice";
import TrueFalse from "./TrueFalse";
import FillIn from "./FillIn";
import Matching from "./Matching";
import Interactive from "./Interactive";
import { useMemo, useRef } from "react";

interface ExerciseWebUIProps {
  exercise: ExerciseResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (answer: any) => void;
}

export default function ExerciseWebUI({ exercise, answer, onChange }: ExerciseWebUIProps) {
  // We use a map to cache the shuffled pairs for matching exercises
  // so their layouts remain consistent when switching between questions.
  const matchingShuffleCache = useRef<{
    [key: string]: { left: string[]; right: string[] };
  }>({});

  // Initialize cached matching shuffle on mount for this exercise
  useMemo(() => {
    if (exercise.type !== "matching") return exercise;

    if (!matchingShuffleCache.current[exercise._id]) {
      const pairs = exercise.pairs || [];
      matchingShuffleCache.current[exercise._id] = {
        left: pairs.map((p) => p.left).sort(() => Math.random() - 0.5),
        right: pairs.map((p) => p.right).sort(() => Math.random() - 0.5),
      };
    }
    return exercise;
  }, [exercise]);

  if (!exercise) return null;

  if (exercise.type === "choice") {
    return <MultipleChoice exercise={exercise} answer={answer} onChange={onChange} />;
  }
  if (exercise.type === "true_false") {
    return <TrueFalse exercise={exercise} answer={answer} onChange={onChange} />;
  }
  if (exercise.type === "fill_in") {
    return <FillIn exercise={exercise} answer={answer} onChange={onChange} />;
  }
  if (exercise.type === "matching") {
    // We will update Matching to use leftItems and rightItems instead of regenerating them.
    const cached = matchingShuffleCache.current[exercise._id];
    return <Matching exercise={exercise} answer={answer} onChange={onChange} customLeftItems={cached?.left} customRightItems={cached?.right} />;
  }
  if (exercise.type === "interactive") {
    return <Interactive exercise={exercise} answer={answer} onChange={onChange} />;
  }

  return null;
}
