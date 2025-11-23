"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import CocosGame, { type CocosGameRef } from "./CocosComponent";

export interface CocosGameWrapperRef {
  checkAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  resetCurrentQuestion: () => void;
  switchGame: (gameIndex: number, questionData?: unknown) => void;
}

const CocosGameWrapper = forwardRef<CocosGameWrapperRef>((_, ref) => {
  const cocosGameRef = useRef<CocosGameRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      checkAnswer: () => {
        if (cocosGameRef.current) {
          cocosGameRef.current.checkAnswer();
        }
      },
      nextQuestion: () => {
        if (cocosGameRef.current) {
          cocosGameRef.current.nextQuestion();
        }
      },
      restartQuiz: () => {
        if (cocosGameRef.current) {
          cocosGameRef.current.restartQuiz();
        }
      },
      resetCurrentQuestion: () => {
        if (cocosGameRef.current) {
          cocosGameRef.current.resetCurrentQuestion();
        }
      },
      switchGame: (gameIndex: number, questionData?: unknown) => {
        if (cocosGameRef.current) {
          cocosGameRef.current.switchGame(gameIndex, questionData);
        }
      },
    }),
    []
  );

  return <CocosGame ref={cocosGameRef} />;
});

CocosGameWrapper.displayName = "CocosGameWrapper";

export default CocosGameWrapper;
