import { useEffect, useRef, useState } from "react";

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

function CocosGame() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      const { type, payload } = event.data;

      console.log("Frontend received from Cocos:", type, payload);

      if (type === "COCOS_READY") {
        setIsReady(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendToCocos = (type: string, payload: any) => {
    if (!isReady) {
      console.warn("Cocos not ready yet");
      return;
    }
    if (iframeRef.current?.contentWindow) {
      console.log("Sending to Cocos:", type, payload);
      iframeRef.current.contentWindow.postMessage({ type, payload }, "*");
    }
  };

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        sendToCocos("SWITCH_GAME", {
          gameIndex: 0,
          questionData: QUESTION_DATA.questions,
        });
      }, 100);
    }
  }, [isReady]);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        objectFit: "contain",
      }}
    >
      <iframe
        ref={iframeRef}
        src="/web-desktop/index.html"
        title="Cocos Game"
        className="w-full h-full"
        allowTransparency={true}
        frameBorder={0}
        scrolling="no"
      />
    </div>
  );
}

export default CocosGame;
