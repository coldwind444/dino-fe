"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import { Righteous, Roboto, Coiny } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { World, Lecture, Topic } from "../[topic]/page";

import Volume from "@/components/Volume/Volume";
import { useLessonStore } from "@/stores/lessonStore";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { type CocosGameWrapperRef } from "@/components/GameComponent/CocosGameWrapper";

// Import the new mode components
import LectureMode from "./LectureMode";
import ExerciseMode from "./ExerciseMode";
import FinishMode from "./FinishMode";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

interface LectureClientProps {
  grade: string;
  topicOrder: string;
  world: World;
  topic: Topic;
  lectures: Lecture[];
}

const MODE = {
  LECTURE: 0,
  EXERCISE: 1,
  FINISH: 2,
};

export default function LectureClient({
  grade,
  topicOrder,
  world,
  topic,
  lectures,
}: LectureClientProps) {
  const { lectureIdx, setLectureIdx } = useLessonStore();
  const router = useRouter();
  const [mode, setMode] = useState(MODE.LECTURE);
  const cocosGameRef = useRef<CocosGameWrapperRef>(null);

  const currentLecture = lectures[lectureIdx];
  const currentDifficulty = currentLecture?.difficultyNo ?? 0;
  const currentLand = world.lands?.[currentDifficulty];

  const [exercises, setExercises] = useState<string[]>([]);
  const [currExIdx, setCurrExIdx] = useState(0);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [gameIndexMap, setGameIndexMap] = useState<Record<number, number>>({});
  const [questionIndexMap, setQuestionIndexMap] = useState<
    Record<number, number>
  >({});

  const [showSubmitBanner, setShowSubmitBanner] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setIsLoadingExercises(true);
        const resData = await fetch(
          "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/exercises.json",
          { cache: "no-store" }
        );
        const exercises = await resData.json();
        setExercises(exercises);
        const gameIndicesWithoutThree = [0, 1, 2, 4, 5];
        const mapping: Record<number, number> = {};
        const questionMapping: Record<number, number> = {};
        exercises.forEach((_: any, idx: number) => {
          if (idx === 4) {
            mapping[idx] = 3;
          } else {
            mapping[idx] =
              gameIndicesWithoutThree[
                Math.floor(Math.random() * gameIndicesWithoutThree.length)
              ];
          }
          questionMapping[idx] = Math.floor(Math.random() * 100);
        });
        setGameIndexMap(mapping);
        setQuestionIndexMap(questionMapping);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoadingExercises(false);
      }
    };
    fetchExerciseData();
  }, [lectureIdx]);

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

  useEffect(() => {
    if (
      mode === MODE.EXERCISE &&
      cocosGameRef.current &&
      gameIndexMap[currExIdx] !== undefined
    ) {
      const gameIndex = gameIndexMap[currExIdx];
      const questionIndex = questionIndexMap[currExIdx];
      console.log(
        `Switching to game index ${gameIndex}, question ${questionIndex} for exercise ${currExIdx}`
      );
      cocosGameRef.current.switchGame(gameIndex, undefined, questionIndex);
    }
  }, [currExIdx, mode, gameIndexMap, questionIndexMap]);

  const handleCheckAnswer = () => {
    if (cocosGameRef.current) {
      cocosGameRef.current.checkAnswer();
    }
  };

  const handleAnswerChecked = (isCorrect: boolean, score: number) => {
    console.log(
      "handleAnswerChecked called - Answer result:",
      isCorrect,
      "Score:",
      score
    );
    setShowSubmitBanner(true);
    setIsAnswerCorrect(isCorrect);
  };

  const handleSkipQuestion = () => {
    setShowSubmitBanner(false);
    if (currExIdx < exercises.length - 1) {
      setCurrExIdx(currExIdx + 1);
    } else {
      setMode(MODE.FINISH);
    }
  };

  const handleContinueAfterAnswer = () => {
    setShowSubmitBanner(false);
    if (currExIdx < exercises.length - 1) {
      setCurrExIdx(currExIdx + 1);
    } else {
      setMode(MODE.FINISH);
    }
  };

  const handleShowCorrectAnswer = () => {
    if (cocosGameRef.current) {
      cocosGameRef.current.showCorrectAnswer();
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        className={clsx(
          isCelebrating ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200"
        )}
      />
      <Image
        className="h-full w-full object-cover"
        fill
        src={currentLand?.illustration || ""}
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
                {`LỚP ${grade} - THẾ GIỚI: ${world.world.toUpperCase()}`}
              </label>
            </div>
          )}
        </div>

        {/* Body */}
        <AnimatePresence mode="wait">
          {mode === MODE.LECTURE && (
            <LectureMode
              grade={grade}
              topicOrder={topicOrder}
              world={world}
              topic={topic}
              lectures={lectures}
              lectureIdx={lectureIdx}
              currentLecture={currentLecture}
              currentLand={currentLand}
              onBack={() => router.back()}
              onDoExercise={doExercise}
              onLectureSelectionChange={setLectureIdx}
            />
          )}
          {mode === MODE.EXERCISE && (
            <ExerciseMode
              lectureIdx={lectureIdx}
              currentLecture={currentLecture}
              exercises={exercises}
              currExIdx={currExIdx}
              showSubmitBanner={showSubmitBanner}
              isAnswerCorrect={isAnswerCorrect}
              cocosGameRef={cocosGameRef}
              onExit={() => setMode(MODE.LECTURE)}
              onExerciseChange={setCurrExIdx}
              onSubmit={() => setShowSubmitBanner(true)}
              onContinue={handleContinueAfterAnswer}
              onAnswerChecked={handleAnswerChecked}
            />
          )}
          {mode === MODE.FINISH && (
            <FinishMode
              grade={grade}
              topic={topic}
              currentLecture={currentLecture}
              onContinue={() => router.back()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}