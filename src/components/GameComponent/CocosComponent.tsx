import { useEffect, useRef, useState } from "react";

function CocosGame() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      const { type } = event.data;
      if (type === "COCOS_READY") {
        setIsReady(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendToCocos = (type: string, payload: { gameIndex: number }) => {
    if (!isReady) return;
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, payload }, "*");
    }
  };

  useEffect(() => {
    if (isReady) {
      setTimeout(() => sendToCocos("SWITCH_GAME", { gameIndex: 0 }), 100);
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
