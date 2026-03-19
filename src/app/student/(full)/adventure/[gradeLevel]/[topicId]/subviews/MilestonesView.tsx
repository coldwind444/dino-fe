'use client";';

import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Roboto, Sriracha } from "next/font/google";
import LectureSlider from "@/components/LectureSlider/LectureSlider";
import {
  WorldResponse,
  LandResponse,
  TopicResponse,
  LectureResponse,
} from "@/types";
import { useState } from "react";
import bagOpen from "../../../../../../../../public/assets/exercises/bag_open.png";
import map from "../../../../../../../../public/assets/exercises/map.png";
import paper2 from "../../../../../../../../public/assets/exercises/paper_landscape.png";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const sriracha = Sriracha({ subsets: ["latin"], weight: ["400"] });

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
  const [currentPage, setCurrentPage] = useState(0);
  const TOTAL_PAGES = 3; // TODO: wire up to real lecture pages

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
            src={topic?.description || ""}
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
              onClick={() => setMode("slider")}
              className="absolute top-1 left-7 flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            <h1 className="text-white font-bold text-[25px] text-wrap text-center px-[20px] min-h-[70px] w-full select-none cursor-pointer">
              {`Bài 10: ${currentLecture?.title}`}
            </h1>
            <div className="flex flex-row items-end justify-center gap-40 w-full">
              <div
                className="flex flex-col items-center justify-center gap-8 cursor-pointer group"
                onClick={() => {
                  setCurrentPage(0);
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
              onClick={() => setMode("select")}
              className="absolute top-1 left-7 flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            {/* Lesson theory — paper as background so content flows naturally */}
            <div
              className="relative w-full max-w-[900px] flex flex-col justify-between px-[12%] pt-[8%] pb-[6%]"
              style={{
                backgroundImage: `url(${paper2.src})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                aspectRatio: "900 / 600",
              }}
            >
              {/* Text content */}
              <div className="flex flex-col gap-4 overflow-hidden">
                <h1 className="text-amber-700 font-bold text-2xl text-center">
                  Bài 10: Cộng các số lớn
                </h1>
                <p className="text-black text-sm text-justify leading-relaxed overflow-auto">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum Excepteur sint occaecat cupidatat
                  non proident, sunt in culpa qui officia deserunt mollit anim
                  id est laborum Excepteur sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt mollit anim id est laborum
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est
                </p>
              </div>
              {/* Page navigator — pinned at the bottom of the paper */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-amber-800/30 hover:bg-amber-800/60 text-amber-900 transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={clsx(
                        "rounded-full transition-all duration-200",
                        i === currentPage
                          ? "w-6 h-3 bg-amber-600"
                          : "w-3 h-3 bg-amber-800/40 hover:bg-amber-800/70",
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))
                  }
                  disabled={currentPage === TOTAL_PAGES - 1}
                  className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-amber-800/30 hover:bg-amber-800/60 text-amber-900 transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
