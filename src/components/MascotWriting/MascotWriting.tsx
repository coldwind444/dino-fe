import { useEffect, useRef } from "react";
import clsx from "clsx";

export const POSES = {
  IDLE: "https://cdn.lottielab.com/l/2xXzcy2MJtHM3K.html",
  TALKING: "https://cdn.lottielab.com/l/9idpreX8WXcikU.html",
  WRITING: "https://cdn.lottielab.com/l/Cs4XKtykzq1XKe.html",
} as const;

type PoseKey = keyof typeof POSES;

interface MascotProps {
  pose: PoseKey;
}

// Lottielab embed URLs (swap /l/ for /e/ to get the embeddable iframe URL)
const POSE_EMBED_URLS: Record<PoseKey, string> = {
  IDLE: "https://cdn.lottielab.com/l/2xXzcy2MJtHM3K.html",
  TALKING: "https://cdn.lottielab.com/l/9idpreX8WXcikU.html",
  WRITING: "https://cdn.lottielab.com/l/Cs4XKtykzq1XKe.html",
};

export default function Mascot({ pose }: MascotProps) {
  const refs: Record<PoseKey, React.RefObject<HTMLIFrameElement | null>> = {
    IDLE: useRef<HTMLIFrameElement>(null),
    TALKING: useRef<HTMLIFrameElement>(null),
    WRITING: useRef<HTMLIFrameElement>(null),
  };

  useEffect(() => {
    (
      Object.entries(refs) as [
        PoseKey,
        React.RefObject<HTMLIFrameElement | null>,
      ][]
    ).forEach(([key, ref]) => {
      const iframe = ref.current;
      if (!iframe) return;

      // Post messages to the Lottielab iframe to control playback
      const message = key === pose ? { action: "play" } : { action: "pause" };
      iframe.contentWindow?.postMessage(message, "*");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose]);

  return (
    <div className="relative w-[320px] h-[320px] ml-[50px]">
      {(Object.entries(POSE_EMBED_URLS) as [PoseKey, string][]).map(
        ([key, src]) => (
          <iframe
            key={key}
            ref={refs[key]}
            src={src}
            className={clsx(
              "absolute inset-0 w-full h-full border-0",
              pose === key ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
            allow="autoplay"
            title={`mascot-${key.toLowerCase()}`}
          />
        ),
      )}
    </div>
  );
}
