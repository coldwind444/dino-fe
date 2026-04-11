import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import type { ILottie } from "@lottielab/lottie-player/react"; // ✅ this is key

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
  // ✅ Correct type — matches LottiePlayer's expected ref type
  const refs: Record<PoseKey, React.RefObject<ILottie | null>> = {
    IDLE: useRef<ILottie>(null),
    TALKING: useRef<ILottie>(null),
    WRITING: useRef<ILottie>(null),
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    (Object.entries(refs) as [PoseKey, React.RefObject<ILottie | null>][]).forEach(
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose]);

  return (
    <div className="relative w-[320px] h-[320px] ml-[50px]">
      {(Object.entries(POSES) as [PoseKey, string][]).map(([key, src]) => (
        <LottiePlayer
          key={key}
          ref={refs[key]} // ✅ fully type-safe now
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
