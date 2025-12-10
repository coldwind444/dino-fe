import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import { ExerciseResponse } from "@/types";

const EXERCISE_TYPE_TO_GAME_INDEX: Record<string, number> = {
  matching: 0,
  choice: 1,
  interactive: 2,
  true_false: 4,
  fill_in: 5,
};

export interface CocosGameRef {
  checkAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  resetCurrentQuestion: () => void;
  showCorrectAnswer: () => void;
  switchGame: (
    gameIndex: number,
    questionData?: unknown,
    questionIndex?: number
  ) => void;
  onAnswerChecked?: (isCorrect: boolean, score: number) => void;
}

interface CocosGameProps {
  exercises: ExerciseResponse[];
  currentExerciseIndex?: number;
  onAnswerChecked?: (isCorrect: boolean, score: number) => void;
}

const CocosGame = forwardRef<CocosGameRef, CocosGameProps>((props, ref) => {
  console.log("CocosGame component rendered with exercises:", props.exercises);
  console.log("Current exercise index:", props.currentExerciseIndex);
  const { onAnswerChecked, exercises, currentExerciseIndex = 0 } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isGameSwitched, setIsGameSwitched] = useState(false);
  const [scale, setScale] = useState(() => {
    if (typeof window !== "undefined") {
      const initialWidth = Math.min(window.innerWidth * 0.6, 1200);
      const initialHeight = Math.min(window.innerHeight * 0.6, 600);
      const gameWidth = 1920;
      const gameHeight = 1024;
      const scaleX = initialWidth / gameWidth;
      const scaleY = initialHeight / gameHeight;
      return Math.min(scaleX, scaleY, 1);
    }
    return 0.3;
  });

  const currentExercise = exercises[currentExerciseIndex];
  console.log("Current exercise:", currentExercise);

  const getGameIndexFromExercise = (exercise: ExerciseResponse): number => {
    console.log("Getting game index for exercise:", exercise);
    if (!exercise?.type) {
      console.warn("Exercise has no type, defaulting to choice (index 1)");
      return 1;
    }

    const gameIndex = EXERCISE_TYPE_TO_GAME_INDEX[exercise.type];
    if (gameIndex === undefined) {
      console.warn(`Unknown exercise type: ${exercise.type}, defaulting to choice (index 1)`);
      return 1;
    }

    console.log(`Exercise type '${exercise.type}' mapped to game index ${gameIndex}`);
    return gameIndex;
  };

  const transformExerciseForCocos = (exercise: ExerciseResponse) => {
    console.log("Transforming exercise for Cocos:", exercise);

    const transformedExercise = {
      question: exercise.question,
      type: exercise.type,
      difficulty: exercise.difficulty || 'easy',
      ...(exercise.options && { options: exercise.options }),
      ...(exercise.pairs && { pairs: exercise.pairs }),
      ...(exercise.correctAnswer && { correctAnswer: exercise.correctAnswer }),
      ...(exercise.content && { content: exercise.content }),
      ...(exercise.metadata && { metadata: exercise.metadata }),
    };

    return transformedExercise;
  }; useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      const { type, payload } = event.data;

      console.log("Frontend received from Cocos:", type, payload);

      switch (type) {
        case "COCOS_READY":
          setIsReady(true);
          break;
        case "GAME_SWITCHED":
          console.log("Game switched:", payload);
          setIsGameSwitched(true);
          break;
        case "QUESTION_SETUP":
          console.log("Question setup:", payload);
          break;
        case "QUESTION_CHANGED":
          console.log("Question changed:", payload);
          break;
        case "ANSWER_CHECKED":
          console.log("Answer checked:", payload);
          if (payload.isCorrect) {
            console.log("Correct answer! Score:", payload.score);
          } else {
            console.log("Wrong answer. Score:", payload.score);
          }
          // Call callback to parent component
          console.log("onAnswerChecked callback exists?", !!onAnswerChecked);
          if (onAnswerChecked) {
            console.log(
              "Calling onAnswerChecked with:",
              payload.isCorrect,
              payload.score
            );
            onAnswerChecked(payload.isCorrect, payload.score);
          }
          break;
        case "QUIZ_RESTARTED":
          console.log("Quiz restarted:", payload);
          break;
        case "QUESTION_RESET":
          console.log("Question reset:", payload);
          break;
        default:
          console.log("Unknown message type:", type);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onAnswerChecked]);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) {
        console.log("Container dimensions not ready, retrying...", {
          containerWidth,
          containerHeight,
        });
        setTimeout(calculateScale, 50);
        return;
      }

      const gameWidth = 1920;
      const gameHeight = 1024;

      const scaleX = containerWidth / gameWidth;
      const scaleY = containerHeight / gameHeight;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
    };

    const timeouts: NodeJS.Timeout[] = [];

    timeouts.push(setTimeout(calculateScale, 0));

    timeouts.push(setTimeout(calculateScale, 10));
    timeouts.push(setTimeout(calculateScale, 50));
    timeouts.push(setTimeout(calculateScale, 100));
    timeouts.push(setTimeout(calculateScale, 200));
    timeouts.push(setTimeout(calculateScale, 500));
    timeouts.push(setTimeout(calculateScale, 1000));

    window.addEventListener("resize", calculateScale);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener("resize", calculateScale);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const calculateScaleAfterRender = () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (containerWidth > 0 && containerHeight > 0) {
          const gameWidth = 1920;
          const gameHeight = 1024;
          const scaleX = containerWidth / gameWidth;
          const scaleY = containerHeight / gameHeight;
          const newScale = Math.min(scaleX, scaleY, 1);

          if (newScale !== scale) {
            console.log("Post-render scale update:", {
              containerWidth,
              containerHeight,
              newScale,
            });
            setScale(newScale);
          }
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(calculateScaleAfterRender);
      });
    }
  });

  const sendToCocos = useCallback(
    (type: string, payload: unknown) => {
      if (!isReady) {
        console.warn("Cocos not ready yet");
        return;
      }
      if (iframeRef.current?.contentWindow) {
        console.log("Sending to Cocos:", type, payload);
        iframeRef.current.contentWindow.postMessage({ type, payload }, "*");
      }
    },
    [isReady]
  );

  const checkAnswer = useCallback(() => {
    if (!isReady) {
      console.warn("Cannot check answer: Cocos game is not ready yet");
      return;
    }
    if (!isGameSwitched) {
      console.warn("Cannot check answer: No game has been switched yet");
      return;
    }
    console.log("Checking answer...");
    sendToCocos("CHECK_ANSWER", {});
  }, [sendToCocos, isReady, isGameSwitched]);

  const nextQuestion = useCallback(() => {
    sendToCocos("NEXT_QUESTION", {});
  }, [sendToCocos]);

  const restartQuiz = useCallback(() => {
    sendToCocos("RESTART_QUIZ", {});
  }, [sendToCocos]);

  const resetCurrentQuestion = useCallback(() => {
    if (!currentExercise) {
      console.warn("No current exercise to reset");
      return;
    }

    const gameIndex = getGameIndexFromExercise(currentExercise);
    const transformedExercise = transformExerciseForCocos(currentExercise);
    console.log(`Resetting question for exercise type: ${currentExercise.type}, game index: ${gameIndex}`);

    // Send the current exercise as question data
    sendToCocos("SWITCH_GAME", {
      gameIndex: gameIndex,
      questionData: [transformedExercise],
    });
  }, [sendToCocos, currentExercise]);

  const showCorrectAnswer = useCallback(() => {
    sendToCocos("SHOW_CORRECT_ANSWER", {});
  }, [sendToCocos]);

  const switchGame = useCallback(
    (gameIndex: number, questionData?: unknown, questionIndex?: number) => {
      console.log(`Switching to game index: ${gameIndex}`);

      if (gameIndex === 3) {
        sendToCocos("SWITCH_GAME", {
          gameIndex,
          questionData: undefined,
        });
        return;
      }

      if (!questionData) {
        // If no question data provided, use current exercise or specific exercise by index
        let exerciseToSend;
        if (questionIndex !== undefined && exercises[questionIndex]) {
          exerciseToSend = exercises[questionIndex];
        } else {
          exerciseToSend = currentExercise;
        }

        if (exerciseToSend) {
          const transformedExercise = transformExerciseForCocos(exerciseToSend);
          sendToCocos("SWITCH_GAME", {
            gameIndex,
            questionData: [transformedExercise],
          });
        } else {
          console.warn("No exercise data available to send");
        }
      } else {
        sendToCocos("SWITCH_GAME", { gameIndex, questionData });
      }
    },
    [sendToCocos, exercises, currentExercise]
  );

  useImperativeHandle(
    ref,
    () => ({
      checkAnswer,
      nextQuestion,
      restartQuiz,
      resetCurrentQuestion,
      showCorrectAnswer,
      switchGame,
    }),
    [
      checkAnswer,
      nextQuestion,
      restartQuiz,
      resetCurrentQuestion,
      showCorrectAnswer,
      switchGame,
    ]
  );

  useEffect(() => {
    console.log("useEffect triggered - isReady:", isReady, "currentExercise:", currentExercise);
    if (isReady && currentExercise) {
      setTimeout(() => {
        const gameIndex = getGameIndexFromExercise(currentExercise);
        const transformedExercise = transformExerciseForCocos(currentExercise);

        console.log(`Switching to exercise ${currentExerciseIndex}:`, currentExercise);
        console.log(`Using game index: ${gameIndex} for type: ${currentExercise.type}`);
        console.log("Sending transformed data to Cocos:", transformedExercise);

        sendToCocos("SWITCH_GAME", {
          gameIndex: gameIndex,
          questionData: [transformedExercise],
        });
      }, 100);
    } else {
      console.log("useEffect: Not ready yet - isReady:", isReady, "currentExercise exists:", !!currentExercise);
    }
  }, [isReady, currentExercise, sendToCocos, currentExerciseIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-transparent overflow-hidden"
      style={{
        minHeight: "500px",
      }}
    >
      <div
        className="relative bg-transparent"
        style={{
          width: `${1920 * scale}px`,
          height: `${1024 * scale}px`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <iframe
          ref={iframeRef}
          src="/web-desktop/index.html"
          title="Cocos Game"
          className="w-full h-full"
          style={{
            border: "none",
            background: "transparent",
            width: "1920px",
            height: "1024px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          frameBorder={0}
          scrolling="no"
        />
      </div>
    </div>
  );
});

CocosGame.displayName = "CocosGame";

export default CocosGame;
