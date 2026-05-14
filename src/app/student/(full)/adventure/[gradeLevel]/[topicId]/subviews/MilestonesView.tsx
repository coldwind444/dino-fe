"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { roboto, sriracha } from "@/app/fonts";
import LectureSlider from "@/components/LectureSlider/LectureSlider";
import {
  WorldResponse,
  LandResponse,
  TopicResponse,
  LectureResponse,
} from "@/types";
import { useState } from "react";
import bagOpen from "../../../../../../../../public/assets/exercises/bag_open.webp";
import map from "../../../../../../../../public/assets/exercises/map.webp";
import paper from "../../../../../../../../public/assets/exercises/paper.webp";
import DOMPurify from "isomorphic-dompurify";
import { toCloudinaryWebP } from "@/helpers/utils";

interface MilestonesViewProps {
  world: WorldResponse;
  land: LandResponse;
  topic: TopicResponse;
  lectures: LectureResponse[];
  onBack: () => void;
  onDoExercise: () => void;
  onLectureChange: (lecture: LectureResponse) => void;
}

const DIFFICULTY_MAP = new Map([
  ["easy", "Nhận biết"],
  ["medium", "Thông hiểu"],
  ["hard", "Vận dụng"],
]);

export default function MilestonesView({
  world,
  land,
  topic,
  lectures,
  onBack,
  onDoExercise,
  onLectureChange,
}: MilestonesViewProps) {
  // Data states
  const [currentLecture, setCurrentLecture] = useState<LectureResponse>(
    lectures[0],
  );

  // UI states
  const [mode, setMode] = useState<"select" | "lesson" | "slider">("slider");

  const handleLectureChange = (lecture: LectureResponse) => {
    setCurrentLecture(lecture);
    onLectureChange(lecture);
  };

  return (
    <motion.div
      key="milestones"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-1 flex-row gap-[20px] pb-[20px] pr-[20px]"
    >
      {/* Topic panel */}
      <div
        className={clsx(
          "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px] h-full w-[400px] flex flex-col pt-[10px]",
        )}
      >
        <div
          className="h-[60px] ml-[20px] w-[340px] bg-[#1DA492] rounded-[20px] flex items-center justify-center cursor-pointer overflow-hidden hover:brightness-110 transition-all duration-200"
          onClick={onBack}
        >
          <div className="h-full w-full rounded-tl-[50px] rounded-br-[50px] flex flex-row gap-[10px] items-center justify-center bg-[#23BEAA] relative">
            <FontAwesomeIcon icon={faArrowLeft} className="text-white mr-2" />
            <span className="text-white font-medium text-[20px]">
              Quay lại danh sách chủ đề
            </span>
            <span className="h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] top-0 right-0 mt-[10px] mr-[10px] absolute"></span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-7 gap-[20px]">
          <Image
            src={toCloudinaryWebP(topic?.description || "")}
            alt=""
            height={120}
            width={120}
          />
          <div
            className={clsx(
              "h-fit w-fit px-[30px] py-[10px] bg-[#1DA492] text-white font-bold rounded-full",
              roboto.className,
            )}
          >
            {`CHỦ ĐỀ ${topic?.level}`}
          </div>
          <label
            className={clsx(
              roboto.className,
              "text-white text-[22px] font-bold text-center text-wrap max-w-[300px]",
            )}
          >
            {topic?.title || ""}
          </label>
        </div>
        <div className="flex flex-col pl-[50px] text-white font-bold text-[18px] mt-[100px]">
          <label>{`Mức độ: ${DIFFICULTY_MAP.get(currentLecture?.difficulty) || ""}`}</label>
          <label>{`Khu vực: ${land.name || ""}`}</label>
        </div>
      </div>
      {/* Exercises panel */}
      <div className="flex flex-1 bg-[rgba(0,0,0,0.7)] rounded-[20px] py-[30px] overflow-hidden">
        {mode === "slider" && (
          // Lecture Slider
          <LectureSlider
            lectures={lectures}
            doExercise={() => setMode("select")}
            milestone={world.milestoneUrl || ""}
            onLectureChange={handleLectureChange}
          />
        )}
        {mode === "select" && (
          // Selection UI - Do exercise or Study
          <div className="h-full w-full overflow-hidden flex flex-col items-center gap-[100px] relative">
            {/* Back button */}
            <button
              data-testid="back-to-milestones-btn"
              onClick={() => setMode("slider")}
              className="absolute z-10 top-1 left-7 flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            <h1 className="text-white font-bold text-[25px] text-wrap text-center px-[20px] min-h-[70px] w-full select-none cursor-pointer">
              {currentLecture?.title}
            </h1>
            <div className="flex flex-row items-end justify-center gap-40 w-full">
              <div
                className="flex flex-col items-center justify-center gap-8 cursor-pointer group"
                data-testid="theory-button"
                onClick={() => {
                  setMode("lesson");
                }}
              >
                <Image
                  src={bagOpen}
                  alt=""
                  height={300}
                  width={300}
                  className="group-hover:scale-120 group-hover:drop-shadow-[0_0_15px_rgba(249,173,85,0.8)] transition-all duration-200"
                />
                <label
                  className={clsx(
                    "text-amber-100 font-bold text-3xl",
                    sriracha.className,
                  )}
                >
                  Xem bài học
                </label>
              </div>
              <div
                className="flex flex-col items-center justify-center gap-8 cursor-pointer group"
                data-testid="exercise-button"
                onClick={onDoExercise}
              >
                <Image
                  src={map}
                  alt=""
                  height={280}
                  width={280}
                  className="group-hover:scale-120 group-hover:drop-shadow-[0_0_15px_rgba(249,173,85,0.8)] transition-all duration-200"
                />
                <label
                  className={clsx(
                    "text-amber-100 font-bold text-3xl",
                    sriracha.className,
                  )}
                >
                  Làm bài tập
                </label>
              </div>
            </div>
          </div>
        )}
        {mode === "lesson" && (
          // UI to view lesson theory
          <div className="h-full w-full overflow-hidden flex flex-col items-center gap-4 relative">
            {/* Back button */}
            <button
              data-testid="back-to-select-btn"
              onClick={() => setMode("select")}
              className="absolute z-10 top-1 left-7 flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-sm cursor-pointer"
              />
            </button>
            {/* Lesson theory — paper as background so content flows naturally */}
            <div
              className="relative w-full max-w-[1000px] flex flex-col justify-between px-[12%] pt-[8%] pb-[8%]"
              style={{
                backgroundImage: `url(${paper.src})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                aspectRatio: "1000 / 620",
              }}
            >
              {/* Text content */}
              <div className="flex flex-col gap-4 overflow-hidden">
                <h1 className="text-white font-bold text-3xl text-center bg-amber-900 p-3 rounded-2xl">
                  {currentLecture?.title}
                </h1>
                <div
                  className="overflow-auto prose prose-lg prose-headings:text-2xl prose-headings:font-bold prose-li:text-black 
                  prose-p:text-black prose-ul:text-black prose-ol:text-black max-w-none
                  prose-label:text-black px-5"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      currentLecture?.theory?.content || "",
                      {
                        ADD_TAGS: ["style", "iframe", "video", "audio"],
                        ADD_ATTR: [
                          "style",
                          "class",
                          "target",
                          "allow",
                          "allowfullscreen",
                          "frameborder",
                          "controls",
                        ],
                      },
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
