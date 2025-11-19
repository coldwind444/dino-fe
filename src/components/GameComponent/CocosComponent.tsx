import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";

const QUESTION_DATA = {
  questions: [
    {
      question: "5 + 3 = ",
      question1: "5 + 4 = ",
      question2: "5 + 6 = ",
      question3: "7 + 9 = ",
      answers: ["8", "9", "11", "16"],
    },
    {
      question: "2 + 7 = ",
      question1: "3 + 8 = ",
      question2: "4 + 5 = ",
      question3: "6 + 9 = ",
      answers: ["9", "11", "9", "15"],
    },
    {
      question: "1 + 6 = ",
      question1: "2 + 9 = ",
      question2: "3 + 3 = ",
      question3: "8 + 4 = ",
      answers: ["7", "11", "6", "12"],
    },
    {
      question: "9 + 5 = ",
      question1: "7 + 2 = ",
      question2: "3 + 6 = ",
      question3: "4 + 8 = ",
      answers: ["14", "9", "9", "12"],
    },
    {
      question: "6 + 6 = ",
      question1: "2 + 4 = ",
      question2: "1 + 9 = ",
      question3: "5 + 7 = ",
      answers: ["12", "6", "10", "12"],
    },
  ],
};

// Interface để expose methods ra ngoài
export interface CocosGameRef {
  checkAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  switchGame: (gameIndex: number, questionData?: unknown) => void;
}

const CocosGame = forwardRef<CocosGameRef>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [scale, setScale] = useState(() => {
    // Calculate initial scale based on window size
    if (typeof window !== 'undefined') {
      const initialWidth = Math.min(window.innerWidth * 0.6, 1200); // Estimate container width
      const initialHeight = Math.min(window.innerHeight * 0.6, 600); // Estimate container height
      const gameWidth = 1920;
      const gameHeight = 1024;
      const scaleX = initialWidth / gameWidth;
      const scaleY = initialHeight / gameHeight;
      return Math.min(scaleX, scaleY, 1);
    }
    return 0.3; // Default fallback scale
  });

  // Handle messages from Cocos game
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
          // Có thể xử lý kết quả trả lời ở đây
          if (payload.isCorrect) {
            console.log("Correct answer! Score:", payload.score);
          } else {
            console.log("Wrong answer. Score:", payload.score);
          }
          break;
        case "QUIZ_RESTARTED":
          console.log("Quiz restarted:", payload);
          break;
        default:
          console.log("Unknown message type:", type);
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Effect để calculate scale khi component mount và có kích thước
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Skip calculation if container dimensions are not ready
      if (containerWidth === 0 || containerHeight === 0) {
        // Retry after a short delay if dimensions not ready
        console.log('Container dimensions not ready, retrying...', { containerWidth, containerHeight });
        setTimeout(calculateScale, 50);
        return;
      }
      
      // Original game size
      const gameWidth = 1920;
      const gameHeight = 1024;
      
      // Calculate scale to fit both width and height
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

    // Window resize listener
    window.addEventListener('resize', calculateScale);
    
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', calculateScale);
    };
  }, []);

  // Additional effect to ensure scale calculation after render
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
            console.log('Post-render scale update:', { containerWidth, containerHeight, newScale });
            setScale(newScale);
          }
        }
      };

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(calculateScaleAfterRender);
      });
    }
  });

  const sendToCocos = useCallback((type: string, payload: unknown) => {
    if (!isReady) {
      console.warn("Cocos not ready yet");
      return;
    }
    if (iframeRef.current?.contentWindow) {
      console.log("Sending to Cocos:", type, payload);
      iframeRef.current.contentWindow.postMessage({ type, payload }, "*");
    }
  }, [isReady]);

  // Function để check answer
  const checkAnswer = useCallback(() => {
    sendToCocos("CHECK_ANSWER", {});
  }, [sendToCocos]);

  // Function để next question
  const nextQuestion = useCallback(() => {
    sendToCocos("NEXT_QUESTION", {});
  }, [sendToCocos]);

  const restartQuiz = useCallback(() => {
    sendToCocos("RESTART_QUIZ", {});
  }, [sendToCocos]);

  // Function để switch game
  const switchGame = useCallback((gameIndex: number, questionData?: unknown) => {
    sendToCocos("SWITCH_GAME", { gameIndex, questionData });
  }, [sendToCocos]);

  // Expose methods ra ngoài thông qua ref
  useImperativeHandle(ref, () => ({
    checkAnswer,
    nextQuestion,
    restartQuiz,
    switchGame,
  }), [checkAnswer, nextQuestion, restartQuiz, switchGame]);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        sendToCocos("SWITCH_GAME", {
          gameIndex: 1,
          questionData: QUESTION_DATA.questions,
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
