"use client";

import {
  faArrowLeftLong,
  faArrowRightLong,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Righteous } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PopupModal, { MODAL_TYPE_KEY } from "@/components/PopupModal/PopupModal";
import {
  createParticipation,
  getAnswers,
  getExercises,
  getParticipations,
  upsertAnswers,
  getArena,
  updateParticipation,
} from "@/apis";
import {
  ExerciseResponse,
  AnswerResponse,
  ParticipationResponse,
  ArenaResponse,
} from "@/types/dto.types";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import MultipleChoice from "@/components/ExerciseWebUI/MultipleChoice";
import TrueFalse from "@/components/ExerciseWebUI/TrueFalse";
import FillIn from "@/components/ExerciseWebUI/FillIn";
import Matching from "@/components/ExerciseWebUI/Matching";
import Interactive from "@/components/ExerciseWebUI/Interactive";
import toast from "react-hot-toast";
import {
  checkAnswerForBasicExerciseType,
  cleanedAnswerArray,
} from "@/helpers/utils";
import { updateMissionProgress } from "@/apis/mission";
import { APIError } from "@/apis/config";

const righteous = Righteous({ weight: "400", subsets: ["latin"] });

type ArenaExamProps = {
  params: {
    arenaId: string;
  };
};

export default function ArenaExam({ params }: ArenaExamProps) {
  const router = useRouter();

  // Data state
  const [participation, setParticipation] =
    useState<ParticipationResponse | null>(null);
  const [arena, setArena] = useState<ArenaResponse | null>(null);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [answers, setAnswers] = useState<Map<string, AnswerResponse>>(
    new Map(),
  );
  const [currExIdx, setCurrExIdx] = useState(0);
  const [currSection, setCurrSection] = useState(0);

  // UI state
  const [modalClose, setModalClose] = useState(true);
  const [modalType, setModalType] = useState<MODAL_TYPE_KEY>("SEND");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  //Effects
  useEffect(() => {
    const initData = async () => {
      const { arenaId } = await params;
      try {
        setLoading(true);

        // 1. Fetch Arena details
        const arenas = await getArena({ _id: arenaId });
        const currentArena = arenas[0];
        if (!currentArena) {
          return;
        }
        setArena(currentArena);

        // 2. Fetch or Create Participation
        let currParticipation: ParticipationResponse | null = null;
        try {
          const participations = await getParticipations({ arenaId: arenaId });
          if (participations.length > 0) {
            currParticipation = participations[0];
            setParticipation(currParticipation);
          }
        } catch (error) {
          if (error instanceof APIError && error.status !== 404) {
            throw error;
          }
        }

        // If not found (either caught 404 or empty list), create new one
        if (!currParticipation) {
          currParticipation = await createParticipation({
            arenaId: arenaId,
            correctCount: 0,
            timeTaken: 0,
            score: 0,
            status: "in_progress",
          });
          setParticipation(currParticipation);
        }

        // 3. Fetch Exercises
        const exercisesData = await getExercises({
          arenaId: arenaId,
          page: 1,
          limit: 100,
        });
        setExercises(exercisesData.sort((a, b) => a.order - b.order));

        // 4. Fetch Answers
        const existingAnswers = await getAnswers({
          participationId: currParticipation._id,
          limit: 100,
        });

        const answerMap = new Map<string, AnswerResponse>();
        if (existingAnswers.length > 0) {
          existingAnswers.forEach((answer) => {
            answerMap.set(answer.exerciseId, answer);
          });
        }

        // Fill in missing answers for all exercises
        exercisesData.forEach((ex) => {
          if (!answerMap.has(ex._id)) {
            answerMap.set(ex._id, {
              _id: `temp-${ex._id}`,
              exerciseId: ex._id,
              userId: currParticipation!.userId._id,
              answerData: {},
              isCorrect: false,
              score: 0,
              assessmentResultId: "",
              arenaParticipationId: currParticipation!._id,
              lectureResultId: "",
            });
          }
        });
        setAnswers(answerMap);
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to load exam data");
      } finally {
        setLoading(false);
      }
    };

    initData();
     
  }, [params]);

  // Clock Countdown logic
  useEffect(() => {
    if (!arena) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const end = new Date(arena.endTime).getTime();
      const diff = Math.max(0, end - now);
      setTimeLeft(diff);

      if (diff === 0) {
        // Auto-submit
        triggerAutoSubmit();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arena]);

  const triggerAutoSubmit = async () => {
    toast.loading("Đang tự động nộp bài...", { id: "arena-submit" });
    await confirmSubmit(true);
  };

  const handleExit = () => {
    setModalType("WARNING");
    setModalClose(false);
  };

  const handleSubmit = () => {
    setModalType("SEND");
    setModalClose(false);
  };

  const confirmModal = async () => {
    setModalClose(true);
    if (modalType === "WARNING") {
      await saveProgress();
      router.push("/student/arena");
    } else {
      await confirmSubmit();
    }
  };

  const updateAnswerCorrectness = () => {
    for (const [key, value] of answers.entries()) {
      const exercise = exercises.find((ex) => ex._id === key);
      if (exercise) {
        value.isCorrect = checkAnswerForBasicExerciseType(value, exercise);
      }
    }
  };

  const saveProgress = async () => {
    if (!participation || !arena) return;
    try {
      // Save answers
      updateAnswerCorrectness();
      const currentAnswers = Array.from(answers.values());
      await upsertAnswers(cleanedAnswerArray(currentAnswers));
      toast.success("Đã lưu tiến độ!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Lưu tiến độ thất bại");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const confirmSubmit = async (isAuto = false) => {
    if (!participation || !arena) return;
    try {
      const timeTaken = Math.max(
        0,
        Math.floor((Date.now() - new Date(arena.startTime).getTime()) / 1000),
      );

      // Sync answers one last time
      updateAnswerCorrectness();
      const currentAnswers = Array.from(answers.values());
      await upsertAnswers(cleanedAnswerArray(currentAnswers));

      // Update participation status
      await updateParticipation(participation._id, {
        timeTaken,
        status: "graded",
        score: 0,
        finishedAt: new Date().toISOString(),
        correctCount: 0,
      });

      await updateMissionProgress({
        unitType: "arena",
        amount: 1,
      });

      toast.success("Nộp bài thành công!", { id: "arena-submit" });
      router.push("/student/arena");
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnswerChange = (exerciseId: string, answerData: any) => {
    setAnswers((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(exerciseId);
      if (existing) {
        newMap.set(exerciseId, { ...existing, answerData });
      }
      return newMap;
    });
  };

  const isAnswered = (exerciseId: string) => {
    const ans = answers.get(exerciseId);
    if (!ans) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = ans.answerData as any;
    if (!data || Object.keys(data).length === 0) return false;

    // Deep check if any value in the answer object is not empty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkValue = (val: any): boolean => {
      if (val === null || val === undefined || val === "") return false;
      if (Array.isArray(val)) {
        return val.length > 0 && val.some((v) => checkValue(v));
      }
      if (typeof val === "object") {
        return Object.values(val).some((v) => checkValue(v));
      }
      return true;
    };

    return checkValue(data);
  };

  const formatTime = (ms: number | null) => {
    if (ms === null) return "--:--:--";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (loading) {
    return <ScreenLoader />;
  }

  if (!arena) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F3F4F6] p-6 z-10">
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
            Đấu trường không tồn tại
          </h2>
          <p className="text-gray-600 font-medium text-lg">
            Đấu trường này không tồn tại hoặc đã kết thúc. Vui lòng quay lại
            sau!
          </p>
          <button
            onClick={() => router.push("/student/arena")}
            className="mt-2 bg-[#1ABC9C] hover:bg-[#16A085] text-white px-10 py-3 rounded-full font-medium cursor-pointer text-lg transition-transform hover:scale-110 active:scale-95 shadow-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currExIdx];
  const answeredCount = Array.from(answers.keys()).filter((id) =>
    isAnswered(id),
  ).length;

  return (
    <div className="h-screen w-screen flex relative">
      <div className="h-screen w-screen bg-[#F3F4F6] flex flex-row gap-[15px] pt-10 pb-5 pr-10">
        {/** Side area */}
        <div className="w-1/5 h-full flex flex-col gap-1 relative">
          {/** Exit button */}
          <div
            className={clsx(
              "h-[55px] w-[160px] bg-[#DE4B54] translate-x-16 -translate-y-3",
              "rounded-[20px] overflow-hidden cursor-pointer absolute top-0",
              "hover:brightness-110 transition-all duration-200",
            )}
            onClick={handleExit}
          >
            <div
              className={clsx(
                "h-full w-full rounded-tl-[50px] rounded-br-[40px] bg-[#FF5964] relative",
                "flex flex-row gap-[10px] text-white text-[18px] items-center justify-center font-medium",
              )}
            >
              <FontAwesomeIcon icon={faClose} />
              <label className="cursor-pointer">Thoát</label>
              <span
                className={clsx(
                  "absolute h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.3)]",
                  "top-0 right-0 mr-[10px] mt-[5px]",
                )}
              ></span>
            </div>
          </div>
          {/** Question panel */}
          <div className="min-h-3/4 max-h-3/4 w-full bg-white rounded-br-[20px] rounded-tr-[20px] border-[#E5E7EB] border overflow-y-auto">
            <div className="flex flex-col justify-center px-8 mt-14 gap-3 max-h-full">
              {/** Title */}
              <label className="text-xl font-bold text-[#F9740B] leading-7 text-center">
                {participation?.arenaId?.title}
              </label>
              {/** Questions */}
              <div className="w-full min-h-[300px] max-h-[300px] overflow-y-auto flex flex-row gap-x-2 gap-y-1 flex-wrap justify-center py-3">
                {exercises
                  .filter(
                    (_, idx) =>
                      idx >= currSection * 25 && idx < (currSection + 1) * 25,
                  )
                  .map((val, idx) => {
                    const exerciseIdx = currSection * 25 + idx;
                    const isCurrent = currExIdx === exerciseIdx;
                    const done = isAnswered(val._id);

                    return (
                      <div
                        key={idx}
                        className={clsx(
                          "h-9 cursor-pointer aspect-square rounded-[10px] flex items-center justify-center text-[18px] relative transition-all duration-200",
                          isCurrent
                            ? "bg-[#3B84F2] text-white ring-2 ring-offset-2 ring-[#3B84F2]"
                            : done
                              ? "bg-[#FF9600] text-white"
                              : "bg-[#C5DCFF] text-[#3B84F2]",
                          "hover:brightness-110",
                        )}
                        onClick={() => setCurrExIdx(exerciseIdx)}
                      >
                        <label
                          className={clsx(
                            "cursor-pointer font-bold",
                            righteous.className,
                          )}
                        >
                          {val.order}
                        </label>
                        <span
                          className={clsx(
                            "absolute h-[10px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)]",
                            "top-0 right-0 mt-[3px] mr-[3px]",
                          )}
                        ></span>
                      </div>
                    );
                  })}
              </div>
              {/** Control */}
              <div className="flex flex-row gap-[10px] w-full">
                {/** Prev button */}
                <div
                  className={clsx(
                    "flex flex-row gap-3 items-center justify-center text-[#C03603] font-medium",
                    "cursor-pointer hover:opacity-90 group",
                    "h-11 w-1/2 border-2 border-[#C03603] rounded-[15px]",
                  )}
                  onClick={() => {
                    if (currSection > 0) setCurrSection((prev) => prev - 1);
                  }}
                >
                  <FontAwesomeIcon
                    className="group-hover:scale-125 transition-all duration-200"
                    icon={faArrowLeftLong}
                  />
                  <label className="cursor-pointer">Trước</label>
                </div>
                {/** Next button */}
                <div
                  className={clsx(
                    "flex flex-row gap-3 items-center justify-center text-[#C03603] font-medium",
                    "cursor-pointer hover:opacity-90 group",
                    "h-11 w-1/2 border-2 border-[#C03603] rounded-[15px]",
                  )}
                  onClick={() => {
                    if (currSection < 3) setCurrSection((prev) => prev + 1);
                  }}
                >
                  <label className="cursor-pointer">Sau</label>
                  <FontAwesomeIcon
                    className="group-hover:scale-125 transition-all duration-200"
                    icon={faArrowRightLong}
                  />
                </div>
              </div>
              {/** Note */}
              <div className="flex flex-row gap-x-10 gap-y-2 flex-wrap">
                <div className="flex flex-row gap-2 items-center">
                  <span className="h-2 w-7 bg-[#FF9600]"></span>
                  <label className="text-[14px] font-medium">Đã làm</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <span className="h-2 w-7 bg-[#3B84F2]"></span>
                  <label className="text-[14px] font-medium">Hiện tại</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <span className="h-2 w-7 bg-[#C5DCFF]"></span>
                  <label className="text-[14px] font-medium">Chưa làm</label>
                </div>
              </div>
            </div>
          </div>
          {/* Time left */}
          <div
            className="flex flex-col h-30 w-full bg-[#FFE3F2] border-l-0 border-t-2 border-b-2 border-r-2 border-[#FF1493]
                                     rounded-tr-2xl rounded-br-2xl items-center"
          >
            <div className="h-fit w-fit bg-[#3E1B57] text-white rounded-bl-xl rounded-br-xl px-5 py-1.5 font-medium">
              Thời gian còn lại:
            </div>
            <span className="text-3xl text-[#FF1493] font-bold mt-4 tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div
            className="flex flex-row flex-1 w-full bg-[#F0E0FF] border-l-0 border-t-2 border-b-2 border-r-2 border-[#8A2BE2]
                                    rounded-tr-2xl rounded-br-2xl text-[#8A2BE2] items-center justify-around font-medium"
          >
            <span className="text-xl">Đã làm:</span>
            <span className="text-2xl font-bold">
              {answeredCount}/{exercises.length}
            </span>
          </div>
        </div>
        {/** Main area */}
        <div className="h-full flex flex-1 flex-col gap-3 justify-around">
          {/** Exercise card */}
          <div className="bg-white max-h-full w-full rounded-[20px] border border-[#E5E7EB] pt-10 flex flex-col gap-10 relative">
            {/** Question number */}
            <div
              className="h-[40px] w-fit px-[30px] bg-[#23BEAA] text-white font-semibold
                                        flex items-center justify-center text-lg rounded-[10px]
                                        absolute -top-4 shadow-md ml-10"
            >
              {`Câu ${currExIdx + 1}`}
            </div>
            {/** Question content */}
            <div className="flex-1 overflow-y-auto mt-3 pr-7 gap-6 flex flex-col">
              <p className="text-wrap ml-16 text-justify text-[19px] font-semibold text-[#1B2657]">
                {currentExercise?.question}
              </p>
              {/** Image (optional) can be added here if exercise has imageUrl */}
            </div>
            {/** Exercise UI */}
            <div className="h-fit py-10 px-10 overflow-y-auto flex flex-col items-center">
              {currentExercise?.type === "choice" && (
                <MultipleChoice
                  exercise={currentExercise}
                  answer={answers.get(currentExercise._id)?.answerData}
                  onChange={(data) =>
                    handleAnswerChange(currentExercise._id, data)
                  }
                />
              )}
              {currentExercise?.type === "true_false" && (
                <TrueFalse
                  exercise={currentExercise}
                  answer={answers.get(currentExercise._id)?.answerData}
                  onChange={(data) =>
                    handleAnswerChange(currentExercise._id, data)
                  }
                />
              )}
              {currentExercise?.type === "fill_in" && (
                <FillIn
                  exercise={currentExercise}
                  answer={answers.get(currentExercise._id)?.answerData}
                  onChange={(data) =>
                    handleAnswerChange(currentExercise._id, data)
                  }
                />
              )}
              {currentExercise?.type === "matching" && (
                <Matching
                  exercise={currentExercise}
                  answer={answers.get(currentExercise._id)?.answerData}
                  onChange={(data) =>
                    handleAnswerChange(currentExercise._id, data)
                  }
                />
              )}
              {currentExercise?.type === "interactive" && (
                <Interactive
                  exercise={currentExercise}
                  answer={answers.get(currentExercise._id)?.answerData}
                  onChange={(data) =>
                    handleAnswerChange(currentExercise._id, data)
                  }
                />
              )}
            </div>
          </div>
          {/** Navigation */}
          <div className="flex flex-row gap-1 mt-auto mb-0">
            {/** Submit button */}
            <div
              className={clsx(
                "bg-[#1DA492] h-[50px] w-[250px] rounded-[20px] overflow-hidden",
                "cursor-pointer hover:brightness-110 transition-all duration-200",
              )}
              onClick={handleSubmit}
            >
              <div
                className={clsx(
                  "h-full w-full flex items-center justify-center text-white text-[18px]",
                  "rounded-tl-[50px] rounded-br-[50px] bg-[#23BEAA] font-bold relative",
                )}
              >
                NỘP BÀI
                <span className="absolute h-[15px] aspect-square rounded-full top-0 right-0 mt-[8px] mr-[8px] bg-[rgba(255,255,255,0.3)]"></span>
              </div>
            </div>
            {/** Prev */}
            <div
              className="h-12 w-fit bg-[#FF1493] rounded-2xl ml-auto mr-[10px] flex flex-row gap-[15px] relative
                                        text-white text-[18px] font-medium items-center justify-center cursor-pointer
                                        hover:brightness-110 transition-all duration-200 py-2 px-7"
              onClick={() => {
                if (currExIdx > 0) {
                  const target = currExIdx - 1;
                  setCurrExIdx(target);
                  if (target < 25 * currSection)
                    setCurrSection((prev) => prev - 1);
                }
              }}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} />
              <label className="cursor-pointer">Câu trước</label>
              <span className="h-[15px] absolute aspect-square bg-[rgba(255,255,255,0.3)] rounded-full top-0 right-0 mt-[8px] mr-[10px]"></span>
            </div>
            {/** Next */}
            <div
              className="h-12 w-fit bg-[#FF1493] rounded-2xl mr-0 flex flex-row gap-[15px] relative
                                    text-white text-[18px] font-medium items-center justify-center cursor-pointer
                                    hover:brightness-110 transition-all duration-200 py-2 px-7"
              onClick={() => {
                if (currExIdx < exercises.length - 1) {
                  const target = currExIdx + 1;
                  setCurrExIdx(target);
                  if (target > 25 * (currSection + 1) - 1)
                    setCurrSection((prev) => prev + 1);
                }
              }}
            >
              <label className="cursor-pointer">Câu sau</label>
              <FontAwesomeIcon icon={faArrowRightLong} />
              <span className="h-[15px] absolute aspect-square bg-[rgba(255,255,255,0.3)] rounded-full top-0 right-0 mt-[8px] mr-[10px]"></span>
            </div>
          </div>
        </div>
      </div>
      {!modalClose && (
        <PopupModal
          type={modalType}
          action={confirmModal}
          close={() => setModalClose(true)}
        />
      )}
    </div>
  );
}
