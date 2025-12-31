"use client";


import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useSpring, animated } from "@react-spring/web";

import Volume from "@/components/Volume/Volume";
import MilestonesView from '../subviews/MilestonesView';
import ExerciseView from '../subviews/ExerciseView';
import FinishView from '../subviews/FinishView';

import { useLessonStore } from "@/stores/lessonStore";
import { GradeResponse, LandResponse, LectureResponse, TopicResponse, WorldResponse } from "@/types";

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
};

export default function LessonView({ grade, world, lands, topic, lectures }: LessonViewProps) {
  // Router
  const router = useRouter();

  // UI states
  const [mode, setMode] = useState(MODE.LECTURE);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Data states
  const { lectureIdx } = useLessonStore();
  const [currLand, setCurrLand] = useState<LandResponse>(lands.filter(land => land.difficulty === 'easy')[0]);
  const [currentLecture, setCurrentLecture] = useState<LectureResponse | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [maxScore, setMaxScore] = useState(0)

  // Functions
  const onFinish = (max: number) => {
    setMaxScore(max)
    setMode(MODE.FINISH);
  }

  const onContinue = () => {
    setIsCelebrating(false)
    setMode(MODE.LECTURE);
    setTotalReward(0)
    setTotalScore(0)
  }

  // Effects
  useEffect(() => {
    const difficulty = lectures[lectureIdx].difficulty;
    const selectedLand = lands.find(land => land.difficulty === difficulty);
    if (selectedLand) setCurrLand(selectedLand);
    if (lectures[lectureIdx]) {
      setCurrentLecture(lectures[lectureIdx]);
    }
  }, [lectureIdx])

  useEffect(() => {
    if (mode === MODE.FINISH) {
      setIsCelebrating(true);
      const timer = setTimeout(() => {
        setIsCelebrating(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const doExercise = () => {
    setMode(MODE.EXERCISE);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/** Full screen confetti for finish view */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        className={clsx(
          isCelebrating ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200"
        )}
      />

      {/** Land illustration */}
      <Image
        className="h-full w-full object-cover"
        fill
        src={currLand.imageUrl || ''}
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
            />
          )}
          {/** Exercise view */}
          {mode === MODE.EXERCISE && (
            <ExerciseView
              setTotalScore={setTotalScore}
              setTotalReward={setTotalReward}
              currentLecture={currentLecture!}
              onExit={() => setMode(MODE.LECTURE)}
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
              currentLecture={lectures[lectureIdx]}
              maxScore={maxScore}
              onContinue={onContinue}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}