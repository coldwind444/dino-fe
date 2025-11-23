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

interface CocosGameWrapperProps {
  onAnswerChecked?: (isCorrect: boolean, score: number) => void;
}

const CocosGameWrapper = forwardRef<CocosGameWrapperRef, CocosGameWrapperProps>(
  (props, ref) => {
    const { onAnswerChecked } = props;
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

    return <CocosGame ref={cocosGameRef} onAnswerChecked={onAnswerChecked} />;
  }
);

CocosGameWrapper.displayName = "CocosGameWrapper";

export default CocosGameWrapper;
