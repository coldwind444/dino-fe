"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

// ✅ Dynamically import Lottie only on the client
const LottiePlayer = dynamic(() => import("@lottielab/lottie-player/react"), {
  ssr: false,
});

export const POSES = {
  IDLE: "https://cdn.lottielab.com/l/2xXzcy2MJtHM3K.json",
  TALKING: "https://cdn.lottielab.com/l/9idpreX8WXcikU.json",
  WRITING: "https://cdn.lottielab.com/l/Cs4XKtykzq1XKe.json",
} as const;

type PoseKey = keyof typeof POSES;

interface MascotProps {
  pose: PoseKey;
}

export default function MascotWriting({ pose }: MascotProps) {
  const refs = {
    IDLE: useRef<any>(null),
    TALKING: useRef<any>(null),
    WRITING: useRef<any>(null),
  };

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    (Object.entries(refs) as [PoseKey, React.RefObject<any>][]).forEach(
      ([key, ref]) => {
        const instance = ref.current;
        if (!instance) return;

        if (key === pose) {
          instance.seek?.(0);
          instance.play?.();
        } else {
          instance.pause?.();
        }
      }
    );
  }, [pose]);

  return (
    <div className="relative w-[320px] h-[320px] ml-[50px]">
      {(Object.entries(POSES) as [PoseKey, string][]).map(([key, src]) => (
        <LottiePlayer
          key={key}
          ref={refs[key]}
          src={src}
          loop
          autoplay={key === pose}
          className={clsx(
            "absolute inset-0",
            pose === key ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        />
      ))}
    </div>
  );
}
