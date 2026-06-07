"use client";

import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import type {
  ILottie,
  LottieProps,
} from "@lottielab/lottie-player/react";

export const POSES = {
  IDLE: "https://cdn.lottielab.com/l/2xXzcy2MJtHM3K.html",
  TALKING: "https://cdn.lottielab.com/l/9idpreX8WXcikU.html",
  WRITING: "https://cdn.lottielab.com/l/Cs4XKtykzq1XKe.html",
} as const;

type PoseKey = keyof typeof POSES;

interface MascotProps {
  pose: PoseKey;
  onLoaded?: () => void;
}

const POSE_JSON_URLS: Record<PoseKey, string> = {
  IDLE: "https://cdn.lottielab.com/l/2xXzcy2MJtHM3K.json",
  TALKING: "https://cdn.lottielab.com/l/9idpreX8WXcikU.json",
  WRITING: "https://cdn.lottielab.com/l/Cs4XKtykzq1XKe.json",
};

const POSE_KEYS = Object.keys(POSE_JSON_URLS) as PoseKey[];
type LottieComponent = ForwardRefExoticComponent<
  LottieProps & RefAttributes<ILottie>
>;

export default function Mascot({ pose, onLoaded }: MascotProps) {
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);
  const [loaded, setLoaded] = useState<Record<PoseKey, boolean>>({
    IDLE: false,
    TALKING: false,
    WRITING: false,
  });
  const [displayPose, setDisplayPose] = useState<PoseKey>(pose);

  const players = useRef<Record<PoseKey, ILottie | null>>({
    IDLE: null,
    TALKING: null,
    WRITING: null,
  });
  const loadedPoses = useRef<Set<PoseKey>>(new Set());
  const onLoadedFired = useRef(false);
  const switchFrame = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@lottielab/lottie-player/react").then((module) => {
      if (mounted) {
        setLottie(() => module.default);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const pauseHiddenPoses = useCallback((activePose: PoseKey) => {
    POSE_KEYS.forEach((key) => {
      if (key !== activePose) {
        players.current[key]?.pause();
      }
    });
  }, []);

  const restartPose = useCallback(
    (key: PoseKey) => {
      const player = players.current[key];
      if (!player) return;

      pauseHiddenPoses(key);
      player.stop();
      player.seekToFrame(0);
      player.play();
    },
    [pauseHiddenPoses],
  );

  const handleLoad = (key: PoseKey) => {
    if (!loadedPoses.current.has(key)) {
      loadedPoses.current.add(key);

      if (loadedPoses.current.size >= POSE_KEYS.length && !onLoadedFired.current) {
        onLoadedFired.current = true;
        onLoaded?.();
      }
    }

    setLoaded((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  useEffect(() => {
    if (!loaded[pose]) return;

    restartPose(pose);

    if (switchFrame.current !== null) {
      cancelAnimationFrame(switchFrame.current);
    }

    switchFrame.current = requestAnimationFrame(() => {
      setDisplayPose(pose);
      switchFrame.current = null;
    });

    return () => {
      if (switchFrame.current !== null) {
        cancelAnimationFrame(switchFrame.current);
        switchFrame.current = null;
      }
    };
  }, [loaded, pose, restartPose]);

  return (
    <div className="relative w-[320px] h-[320px] ml-[50px] overflow-hidden">
      {Lottie &&
        POSE_KEYS.map((key) => (
          <Lottie
            key={key}
            ref={(player) => {
              players.current[key] = player;
            }}
            src={POSE_JSON_URLS[key]}
            autoplay={false}
            loop
            onLoad={() => handleLoad(key)}
            className={clsx(
              "absolute inset-0 z-0 h-full w-full border-0 bg-transparent",
              displayPose === key
                ? "opacity-100"
                : "opacity-0 pointer-events-none",
            )}
          />
        ))}
    </div>
  );
}
