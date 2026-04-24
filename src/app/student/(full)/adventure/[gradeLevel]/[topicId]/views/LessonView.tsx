"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

import Volume from "@/components/Volume/Volume";
import MilestonesView from "../subviews/MilestonesView";
import ExerciseView from "../subviews/ExerciseView";
import FinishView from "../subviews/FinishView";

import {
  GradeResponse,
  LandResponse,
  LectureResponse,
  TopicResponse,
  UserProfileResponse,
  WorldResponse,
} from "@/types";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

const MODE = {
  LECTURE: 0,
  EXERCISE: 1,
  FINISH: 2,
};

type LessonViewProps = {
  grade: GradeResponse;
  world: WorldResponse;
  lands: LandResponse[];
  topic: TopicResponse;
  lectures: LectureResponse[];
  user: UserProfileResponse;
};

export default function LessonView({
  grade,
  world,
  lands,
  topic,
  lectures,
  user,
}: LessonViewProps) {
  // Router
  const router = useRouter();

  // UI states
  const [mode, setMode] = useState(MODE.LECTURE);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Data states
  const [currLand, setCurrLand] = useState<LandResponse>(
    lands.find((land) => land.difficulty === "easy")!,
  );
  const [currentLecture, setCurrentLecture] = useState<LectureResponse>(
    lectures[0],
  );
  const [totalScore, setTotalScore] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  // Functions
  const onExit = () => {
    setMode(MODE.LECTURE);
    setTotalScore(0);
    setTotalReward(0);
  };

  const onFinish = (max: number) => {
    setMaxScore(max);
    setMode(MODE.FINISH);
  };

  const onContinue = () => {
    setIsCelebrating(false);
    setMode(MODE.LECTURE);
    setTotalReward(0);
    setTotalScore(0);
  };

  const doExercise = () => {
    setMode(MODE.EXERCISE);
  };

  const handleLectureChange = (lecture: LectureResponse) => {
    const newLand = lands.find(
      (land) => land.difficulty === lecture.difficulty,
    );
    if (newLand) {
      setCurrLand(newLand);
    }
    setCurrentLecture(lecture);
  };

  useEffect(() => {
    if (mode === MODE.FINISH) {
      setIsCelebrating(true);
      const timer = setTimeout(() => {
        setIsCelebrating(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/** Full screen confetti for finish view */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        className={clsx(
          isCelebrating ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200",
        )}
      />

      {/** Land illustration */}
      <Image
        className="h-full w-full object-cover"
        fill
        src={currLand.imageUrl || ""}
        alt=""
      />

      <div className="absolute h-full w-full flex flex-col gap-[10px]">
        {/* Header */}
        <div className="flex flex-row gap-[10px] p-[15px] items-center">
          <div className="relative px-[25px] py-[6px] bg-[#1DA492] rounded-[15px] text-white font-bold">
            <label className={clsx(roboto.className, "text-[15px]")}>
              Đang ở chế độ phiêu lưu
            </label>
          </div>
          <Volume />
          {mode === MODE.LECTURE && (
            <div className="h-[50px] w-fit px-[20px] flex items-center bg-[rgba(0,0,0,0.7)] rounded-[15px] ml-[15px]">
              <label className="text-white font-bold text-[20px]">
                {`LỚP ${grade.level} - THẾ GIỚI: ${world.name.toUpperCase()}`}
              </label>
            </div>
          )}
        </div>

        {/* Body */}
        {!lectures || lectures.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 h-full z-10">
            <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl border-[4px] border-[#1ABC9C] shadow-2xl flex flex-col items-center max-w-lg text-center gap-6">
              <div className="w-24 h-24 text-[#1ABC9C] opacity-70">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#1ABC9C]">
                Chưa có bài học nào
              </h2>
              <p className="text-gray-600 font-medium text-lg">
                Nội dung cho chủ đề này đang được cập nhật. Vui lòng quay lại
                sau!
              </p>
              <button
                onClick={() => router.back()}
                className="mt-2 bg-[#1ABC9C] hover:bg-[#16A085] text-white px-10 py-3 rounded-full font-medium cursor-pointer text-lg transition-transform hover:scale-110 active:scale-95 shadow-lg"
              >
                Quay lại
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/** Lectures view */}
            {mode === MODE.LECTURE && (
              <MilestonesView
                world={world}
                land={currLand!}
                topic={topic}
                lectures={lectures}
                onBack={() => router.back()}
                onDoExercise={doExercise}
                onLectureChange={handleLectureChange}
              />
            )}
            {/** Exercise view */}
            {mode === MODE.EXERCISE && (
              <ExerciseView
                userId={user._id}
                totalScore={totalScore}
                setTotalScore={setTotalScore}
                setTotalReward={setTotalReward}
                currentLecture={currentLecture}
                onExit={onExit}
                onFinish={onFinish}
              />
            )}
            {/** Finish view */}
            {mode === MODE.FINISH && (
              <FinishView
                grade={grade.level.toString()}
                topic={topic}
                score={totalScore}
                reward={totalReward}
                currentLecture={currentLecture!}
                maxScore={maxScore}
                onContinue={onContinue}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
