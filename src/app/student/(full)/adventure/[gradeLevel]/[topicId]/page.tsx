"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { roboto } from "@/app/fonts";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

import Volume from "@/components/Volume/Volume";
import MilestonesView from "./subviews/MilestonesView";
import ExerciseView from "./subviews/ExerciseView";
import FinishView from "./subviews/FinishView";

import {
  getGrades,
  getLandsByWorldId,
  getLecturesByTopicId,
  getTopicById,
  getUserProfile,
  getWorldById,
} from "@/apis";
import {
  GradeResponse,
  LandResponse,
  TopicResponse,
  WorldResponse,
  LectureResponse,
  UserProfileResponse,
} from "@/types";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { APIError } from "@/apis/config";
import { toCloudinaryWebP } from "@/helpers/utils";
import { getLectureIndexFromLocalStorage } from "@/helpers/localStorage";

const MODE = {
  LECTURE: 0,
  EXERCISE: 1,
  FINISH: 2,
};

interface LessonsPageProps {
  params: {
    gradeLevel: string; // gradeLevel: 1 => 5
    topicId: string; // topicId: string
  };
}

export default function LessonsPage({ params }: LessonsPageProps) {
  // Router
  const router = useRouter();

  // Data states
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [currGrade, setCurrGrade] = useState<GradeResponse | null>(null);
  const [currWorld, setCurrWorld] = useState<WorldResponse | null>(null);
  const [currTopic, setCurrTopic] = useState<TopicResponse | null>(null);
  const [lectures, setLectures] = useState<LectureResponse[]>([]);
  const [lands, setLands] = useState<LandResponse[]>([]);

  // UI states (from LessonView)
  const [mode, setMode] = useState(MODE.LECTURE);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const [currLand, setCurrLand] = useState<LandResponse | null>(null);
  const [currentLecture, setCurrentLecture] = useState<LectureResponse | null>(
    null,
  );
  const [totalScore, setTotalScore] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Image preloading states
  const [loadedLandsCount, setLoadedLandsCount] = useState(0);
  const [isMilestoneLoaded, setIsMilestoneLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { gradeLevel, topicId } = await params;
      if (!gradeLevel || !topicId) return;

      setLoading(true);

      try {
        const grades = await getGrades({ level: gradeLevel });
        const world = await getWorldById(grades[0].worldId);
        const lands = await getLandsByWorldId(world._id);
        const topic = await getTopicById(topicId);
        const lectures = await getLecturesByTopicId(topic._id);
        const user = await getUserProfile();

        setCurrGrade(grades[0]);
        setCurrWorld(world);
        setLands(lands);
        setCurrTopic(topic);
        setLectures(lectures);
        setUser(user);

        // Init state dependent on fetched data
        const data = getLectureIndexFromLocalStorage(gradeLevel, topicId);
        if (lands.length > 0) {
          const land =
            lands.find((land) => land.difficulty === data?.diff) || lands[0];
          setCurrLand(land);
        }
        if (lectures.length > 0) {
          const safeIndex =
            data?.index >= 0 && data?.index < lectures.length ? data.index : 0;
          setCurrentLecture(lectures[safeIndex]);
        }
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

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
    if (currentLecture?.difficulty !== lecture.difficulty) {
      const newLand = lands.find(
        (land) => land.difficulty === lecture.difficulty,
      );
      if (newLand) {
        setCurrLand(newLand);
      }
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

  // Determine if all required images are fully loaded
  const areImagesLoaded =
    lectures.length === 0
      ? true
      : loadedLandsCount >= lands.length && isMilestoneLoaded;

  // Determine if the screen loader should be shown
  const showLoader =
    loading ||
    !currGrade ||
    !currWorld ||
    !currTopic ||
    !lectures ||
    !lands ||
    !user ||
    !areImagesLoaded;

  // If data is not ready, we can't even render the images yet
  if (
    !currGrade ||
    !currWorld ||
    !currTopic ||
    !lectures ||
    !lands ||
    !user ||
    !currLand ||
    !currentLecture
  ) {
    return <ScreenLoader />;
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/** Full screen loader overlaid until everything is ready */}
      {showLoader && (
        <div className="absolute inset-0 z-50">
          <ScreenLoader />
        </div>
      )}

      {/** Preload Milestone Image (Hidden) */}
      <Image
        src={toCloudinaryWebP(currWorld.milestoneUrl || "")}
        alt="milestone"
        width={280}
        height={280}
        priority
        className="hidden"
        onLoad={() => setIsMilestoneLoaded(true)}
      />

      {/** Land illustrations (All preloaded, only active is visible) */}
      {lands.map((land) => (
        <Image
          key={land._id}
          className={clsx(
            "h-full w-full object-cover absolute inset-0",
            land._id === currLand._id ? "opacity-100 z-0" : "opacity-0 -z-10",
          )}
          fill
          priority
          src={toCloudinaryWebP(land.imageUrl || "")}
          alt={land.name || ""}
          onLoad={() => setLoadedLandsCount((prev) => prev + 1)}
        />
      ))}

      {/** Main Content: Only render subviews if fully loaded */}
      {areImagesLoaded && (
        <>
          {/** Full screen confetti for finish view */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            className={clsx(
              isCelebrating ? "opacity-100 z-20" : "opacity-0 -z-10",
              "transition-opacity duration-200 absolute",
            )}
          />

          <div className="absolute h-full w-full flex flex-col gap-[10px] z-10">
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
                    {`LỚP ${currGrade.level} - THẾ GIỚI: ${currWorld.name.toUpperCase()}`}
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
                    Nội dung cho chủ đề này đang được cập nhật. Vui lòng quay
                    lại sau!
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
                    world={currWorld}
                    land={currLand!}
                    topic={currTopic}
                    lectures={lectures}
                    initialLecture={currentLecture!}
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
                    currentLecture={currentLecture!}
                    onExit={onExit}
                    onFinish={onFinish}
                  />
                )}
                {/** Finish view */}
                {mode === MODE.FINISH && (
                  <FinishView
                    grade={currGrade.level.toString()}
                    topic={currTopic}
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
        </>
      )}
    </div>
  );
}
