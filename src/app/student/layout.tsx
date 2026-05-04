"use client";

import { trackAccessDuration } from "@/apis";
import { APIError, getAccessToken } from "@/apis/config";
import { useEffect, useRef } from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionStartRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);

  useEffect(() => {
    // Initialize session start on client mount (not SSR render time)
    sessionStartRef.current = new Date().getTime();
    accumulatedRef.current = 0;
    const trackDuration = async (seconds: number) => {
      const token = getAccessToken();
      if (!token) return;
      try {
        await trackAccessDuration(seconds);
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      }
    };

    const trackDurationOnUnload = (seconds: number) => {
      const token = getAccessToken();
      if (!token) return;
      fetch("/backend/statistics/heartbeat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seconds }),
        keepalive: true,
      }).catch((error) => {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      });
    };

    const getCurrentSegmentMs = () => {
      if (sessionStartRef.current === null) return 0;
      return new Date().getTime() - sessionStartRef.current;
    };

    // Flush accumulated + current segment, then reset
    const flush = async (useBeacon = false) => {
      const total = accumulatedRef.current + getCurrentSegmentMs();
      if (total <= 0) return;

      // Reset before the async call to avoid double-counting
      // if flush is triggered again before the request completes
      accumulatedRef.current = 0;
      if (sessionStartRef.current !== null) {
        sessionStartRef.current = new Date().getTime(); // restart current segment
      }

      const seconds = total / 1000;
      if (useBeacon) {
        trackDurationOnUnload(seconds);
      } else {
        await trackDuration(seconds);
      }
    };

    // Call flush every 60s while the student is active
    const interval = setInterval(() => flush(), 60_000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        accumulatedRef.current += getCurrentSegmentMs();
        sessionStartRef.current = null;
      } else {
        sessionStartRef.current = new Date().getTime();
      }
    };

    const handleBeforeUnload = () => {
      accumulatedRef.current += getCurrentSegmentMs();
      sessionStartRef.current = null;
      flush(true); // useBeacon = true, flush is sync in this path
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flush(); // send remainder on logout
    };
  }, []);

  return <>{children}</>;
}
