"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import lock from "../../../public/assets/exercises/lock.png";
import { LectureResponse } from "@/types";
import { toCloudinaryWebP } from "@/helpers/utils";

type LectureSliderProps = {
  lectures: LectureResponse[];
  doExercise: () => void;
  milestone: string;
  onLectureChange: (lecture: LectureResponse) => void;
};

export default function LectureSlider({
  lectures,
  doExercise,
  milestone,
  onLectureChange,
}: LectureSliderProps) {
  const [translate, setTranslate] = useState(0);
  const [idx, setIdx] = useState(0);

  const unlockedDifficulty = ["easy"];

  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_WIDTH = 520; // roughly 280px image + 200px svg + 20px gap

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const IMAGE_CENTER_OFFSET = 140; // anchor point within each 500px block
      const newTranslate =
        containerWidth / 2 - (idx * ITEM_WIDTH + IMAGE_CENTER_OFFSET);
      setTranslate(newTranslate);
    }
  }, [idx]);

  const forward = () => {
    if (idx < lectures.length - 1) {
      const newIdx = idx + 1;
      setIdx(newIdx);
      onLectureChange(lectures[newIdx]);
    }
  };

  const backward = () => {
    if (idx > 0) {
      const newIdx = idx - 1;
      setIdx(newIdx);
      onLectureChange(lectures[newIdx]);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col items-center gap-[100px]">
      {/* Header */}
      {unlockedDifficulty.includes(lectures[idx].difficulty) ? (
        <h1 className="text-white font-bold text-[25px] text-wrap text-center px-[20px] min-h-[70px] w-full select-none cursor-pointer">
          {lectures[idx]?.title}
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-[#FFAE5F] min-h-[70px]">
          Bài học đang bị khóa
        </h1>
      )}

      {/* Slider */}
      <div
        ref={containerRef}
        className="relative -mt-[20px] mb-[20px] w-full overflow-hidden"
      >
        <div
          className={clsx(
            "flex flex-row gap-[20px] h-fit w-fit transition-transform duration-500 ease-in-out",
          )}
          style={{
            transform: `translateX(${translate}px)`,
          }}
        >
          {lectures.map((lecture, index) => (
            <div key={index} className="flex flex-row gap-[20px] items-center">
              <div className="flex items-center justify-center relative">
                <Image
                  src={toCloudinaryWebP(milestone)}
                  alt=""
                  width={280}
                  height={280}
                  priority={index < 3}
                  className={clsx(
                    "aspect-square flex-shrink-0 object-contain",
                    index === idx ? "scale-100" : "scale-75 opacity-60",
                    "transition-all duration-500",
                    !unlockedDifficulty.includes(lecture.difficulty)
                      ? "grayscale-100"
                      : "",
                  )}
                />
                {!unlockedDifficulty.includes(lecture.difficulty) && (
                  <Image
                    src={lock}
                    alt="X"
                    width={100}
                    height={100}
                    className="absolute"
                  />
                )}
              </div>
              {index !== lectures.length - 1 && (
                <svg
                  className="mt-[40px]"
                  width="200"
                  height="100"
                  viewBox="0 0 500 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 50 C100 0, 200 100, 300 50 S500 100, 500 50"
                    stroke="#29D9C2"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="25 25"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-row w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-[30px]">
        <FontAwesomeIcon
          className="text-white text-2xl sm:text-3xl md:text-[35px] lg:text-[40px] cursor-pointer hover:scale-125 transition-all duration-150"
          icon={faArrowLeft}
          onClick={backward}
        />

        {/* Fixed height container to maintain footer position */}
        <div className="h-[50px] sm:h-[55px] md:h-[60px] flex items-center justify-center">
          {unlockedDifficulty.includes(lectures[idx].difficulty) ? (
            <div className="overflow-hidden h-[50px] sm:h-[55px] md:h-[60px]">
              <iframe
                title="idle-dino"
                className="absolute -translate-y-[90px] -translate-x-[20px]"
                src="https://cdn.lottielab.com/l/2HPdkE6AbKUhHe.html"
                height={200}
                loading="lazy"
                style={{ border: "none" }}
              />
              <div
                className="h-[50px] sm:h-[55px] md:h-[60px] w-[160px] sm:w-[180px] md:w-[200px] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] bg-[#1DA492] cursor-pointer hover:brightness-110 transition-all duration-200"
                onClick={doExercise}
              >
                <div className="h-full w-full flex items-center justify-center gap-[8px] sm:gap-[10px] relative bg-[#23BEAA] rounded-tl-[40px] sm:rounded-tl-[45px] md:rounded-tl-[50px] rounded-br-[40px] sm:rounded-br-[45px] md:rounded-br-[50px] rounded-tr-[15px] sm:rounded-tr-[18px] md:rounded-tr-[20px] rounded-bl-[15px] sm:rounded-bl-[18px] md:rounded-bl-[20px]">
                  <label className="text-white font-semibold text-base sm:text-lg md:text-[20px] select-none cursor-pointer">
                    Cùng học nào !
                  </label>
                  <span className="h-[12px] sm:h-[13px] md:h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] absolute right-0 top-0 mt-[6px] sm:mt-[6px] md:mt-[7px] mr-[8px] sm:mr-[9px] md:mr-[10px]"></span>
                  <span className="h-[4px] sm:h-[4px] md:h-[5px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] absolute right-0 top-0 mt-[16px] sm:mt-[18px] md:mt-[20px] mr-[20px] sm:mr-[22px] md:mr-[25px]"></span>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-medium text-white text-wrap text-center align-middle text-sm sm:text-base md:text-lg lg:text-xl px-2">
              Bạn cần hoàn thành các <br className="hidden sm:block" /> bài học
              trước để mở khóa.
            </p>
          )}
        </div>

        <FontAwesomeIcon
          className="text-white text-2xl sm:text-3xl md:text-[35px] lg:text-[40px] cursor-pointer hover:scale-125 transition-all duration-150"
          icon={faArrowRight}
          onClick={forward}
        />
      </div>
    </div>
  );
}
