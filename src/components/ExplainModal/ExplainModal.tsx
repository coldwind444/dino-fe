"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Lobster } from "next/font/google";

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

export type Theme = "prairie" | "forest" | "beach" | "desert" | "ruby";

interface ExplainModalProps {
  theme: Theme;
  explanation: string;
  isOpen: boolean;
  onClose: () => void;
}

export const themeBackgrounds: Record<Theme, string> = {
  prairie: "/assets/exercises/prairie.png",
  forest: "/assets/exercises/forest.png",
  beach: "/assets/exercises/beach.png",
  desert: "/assets/exercises/desert.png",
  ruby: "/assets/exercises/ruby.png",
};

const dummyText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function ExplainModal({
  theme,
  explanation,
  isOpen,
  onClose,
}: ExplainModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/50 rounded-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-[850px] max-w-[90vw]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              duration: 0.35,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Theme background image */}
            <Image
              src={themeBackgrounds[theme]}
              alt={`${theme} background`}
              width={850}
              height={850}
              className="w-full h-auto block pointer-events-none select-none"
              priority
            />

            {/* Close button */}
            <button
              className="group absolute top-[5%] right-[5%] w-16 h-16 cursor-pointer bg-transparent border-none p-0 z-10 transition-transform duration-100 ease-in-out hover:scale-115"
              onClick={onClose}
            >
              <Image
                src="/assets/exercises/close.png"
                alt="Close"
                width={60}
                height={60}
                className="w-full h-full object-contain group-hover:brightness-125 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              />
            </button>

            {/* Explanation text */}
            <div
              className={clsx(
                "absolute  left-[12%] right-[15%] bottom-[18%] flex justify-start",
                "overflow-y-auto px-20 pb-2 explain-modal-scrollbar flex flex-col gap-8 items-center",
                theme === "prairie" ||
                  theme === "forest" ||
                  theme === "desert" ||
                  theme === "beach"
                  ? "top-[25%]"
                  : theme === "ruby"
                    ? "top-[15%]"
                    : "",
              )}
            >
              <h1
                className={clsx(
                  "text-5xl font-bold",
                  lobster.className,
                  theme === "ruby" ? "text-white" : "text-amber-800",
                )}
              >
                Giải thích đáp án
              </h1>
              <p
                className={clsx(
                  "text-lg leading-relaxed text-justify whitespace-pre-wrap break-words",
                  theme === "ruby" ? "text-white" : "text-amber-800",
                )}
              >
                {explanation.length === 0 ? dummyText + dummyText : explanation}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
