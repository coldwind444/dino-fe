import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import MathQuestions from "./MathQuestions.json";
import MultiChoice from "./MultiChoice.json";
import DragQuestion from "./DragQuestion.json";
import TrueFalse from "./TrueFasle.json";
import FillQuestions from "./Fill-questions.json";

const GAME_QUESTION_MAP: Record<number, { questions: any[] }> = {
  0: MathQuestions,
  1: MultiChoice,
  2: DragQuestion,
  4: TrueFalse,
  5: FillQuestions,
};

export interface CocosGameRef {
  checkAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  resetCurrentQuestion: () => void;
  switchGame: (gameIndex: number, questionData?: unknown) => void;
  onAnswerChecked?: (isCorrect: boolean, score: number) => void;
}

interface CocosGameProps {
  onAnswerChecked?: (isCorrect: boolean, score: number) => void;
}

const CocosGame = forwardRef<CocosGameRef, CocosGameProps>((props, ref) => {
  const { onAnswerChecked } = props;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
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

  useEffect(() => {
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
    sendToCocos("CHECK_ANSWER", {});
  }, [sendToCocos]);

  const nextQuestion = useCallback(() => {
    sendToCocos("NEXT_QUESTION", {});
  }, [sendToCocos]);

  const restartQuiz = useCallback(() => {
    sendToCocos("RESTART_QUIZ", {});
  }, [sendToCocos]);

  const resetCurrentQuestion = useCallback(() => {
    const allGameIndices = [0, 1, 2, 3, 4, 5];
    const randomIndex =
      allGameIndices[Math.floor(Math.random() * allGameIndices.length)];

    if (randomIndex === 3) {
      sendToCocos("SWITCH_GAME", {
        gameIndex: randomIndex,
        questionData: undefined,
      });
    } else {
      const gameData = GAME_QUESTION_MAP[randomIndex];
      // Random shuffle questions
      const shuffledQuestions = gameData?.questions
        ? [...gameData.questions].sort(() => Math.random() - 0.5)
        : [];

      sendToCocos("SWITCH_GAME", {
        gameIndex: randomIndex,
        questionData: shuffledQuestions,
      });
    }
  }, [sendToCocos]);

  // Function để switch game
  const switchGame = useCallback(
    (gameIndex: number, questionData?: unknown) => {
      // If no questionData provided, load from map
      const dataToSend =
        questionData ||
        GAME_QUESTION_MAP[gameIndex]?.questions ||
        GAME_QUESTION_MAP[0]?.questions;
      sendToCocos("SWITCH_GAME", { gameIndex, questionData: dataToSend });
    },
    [sendToCocos]
  );

  // Expose methods ra ngoài thông qua ref
  useImperativeHandle(
    ref,
    () => ({
      checkAnswer,
      nextQuestion,
      restartQuiz,
      resetCurrentQuestion,
      switchGame,
    }),
    [checkAnswer, nextQuestion, restartQuiz, resetCurrentQuestion, switchGame]
  );

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        const gameData = GAME_QUESTION_MAP[2] || GAME_QUESTION_MAP[0];
        sendToCocos("SWITCH_GAME", {
          gameIndex: 1,
          questionData: gameData.questions,
        });
      }, 100);
    }
  }, [isReady, sendToCocos]);

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
          allowTransparency={true}
          frameBorder={0}
          scrolling="no"
        />
      </div>
    </div>
  );
});

CocosGame.displayName = "CocosGame";

export default CocosGame;
