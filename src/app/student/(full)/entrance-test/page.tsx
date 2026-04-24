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
  getExercises,
  upsertAnswers,
  submitAssessment,
  getPublishedAssessmentByGradeId,
  startAssessment,
} from "@/apis";
import { getUserProfile } from "@/apis/user";
import {
  ExerciseResponse,
  AnswerResponse,
  AssessmentResponse,
  UserProfileResponse,
} from "@/types/dto.types";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import ExerciseWebUI from "@/components/ExerciseWebUI";
import toast from "react-hot-toast";
import {
  checkAnswerForBasicExerciseType,
  cleanedAnswerArray,
} from "@/helpers/utils";
import { Toaster } from "react-hot-toast";
import { APIError } from "@/apis/config";

const righteous = Righteous({ weight: "400", subsets: ["latin"] });

export default function EntranceTest() {
  const router = useRouter();

  // Data state
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
    null,
  );
  const [arId, setArId] = useState<string>("");
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
  const [timeTaken, setTimeTaken] = useState<number>(0);

  //Effects
  useEffect(() => {
    let ignore = false;

    const initData = async () => {
      try {
        setLoading(true);

        const currentProfile = await getUserProfile();
        if (ignore) return;
        setUserProfile(currentProfile);

        // 1. Fetch Assessment details
        const assessmentData = await getPublishedAssessmentByGradeId(
          currentProfile.gradeId,
        );
        if (!assessmentData) {
          return;
        }

        // 2. Fetch Exercises
        const exercisesData = await getExercises({
          assessmentId: assessmentData._id,
          page: 1,
          limit: 100,
        });
        setExercises(exercisesData.sort((a, b) => a.order - b.order));

        // Start assessment
        const assessmentResult = await startAssessment(assessmentData._id);
        setArId(assessmentResult._id);
        setAssessment(assessmentData);

        // 3. Initialize empty answers
        const answerMap = new Map<string, AnswerResponse>();
        exercisesData.forEach((ex) => {
          answerMap.set(ex._id, {
            _id: `temp-${ex._id}`,
            exerciseId: ex._id,
            userId: currentProfile._id,
            answerData: {},
            isCorrect: false,
            score: 0,
            assessmentResultId: "",
            arenaParticipationId: "",
            lectureResultId: "",
          });
        });
        setAnswers(answerMap);
      } catch (error) {
        if (error instanceof APIError) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initData();

    return () => {
      ignore = true;
    };
  }, []);

  // Clock Count up logic
  useEffect(() => {
    if (!assessment) return;

    const interval = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [assessment]);

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
      router.back();
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

  const confirmSubmit = async () => {
    if (!assessment || !userProfile) return;
    try {
      toast.loading("Đang nộp bài...", { toasterId: "test-submit" });

      // Update answers and submit
      updateAnswerCorrectness();
      const currentAnswers = Array.from(answers.values()).map((ans) => ({
        ...ans,
        assessmentResultId: arId,
      }));
      await upsertAnswers(cleanedAnswerArray(currentAnswers));

      // Call submit assessment
      await submitAssessment(arId, timeTaken);

      toast.dismiss("test-submit");
      toast.success("Nộp bài thành công!", { toasterId: "test-submit" });
      router.back();
    } catch (err) {
      if (err instanceof APIError) {
        toast.error(err.message);
      }
    } finally {
      toast.dismissAll("test-submit");
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

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`;
  };

  if (loading) {
    return <ScreenLoader />;
  }

  if (!assessment) {
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
            Không có bài kiểm tra
          </h2>
          <p className="text-gray-600 font-medium text-lg">
            Hiện tại chưa có bài kiểm tra đầu vào cho lớp này. Vui lòng quay lại
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
    );
  }

  const currentExercise = exercises[currExIdx];
  const answeredCount = Array.from(answers.keys()).filter((id) =>
    isAnswered(id),
  ).length;

  return (
    <div className="h-screen w-screen flex relative">
      <Toaster toasterId="test-submit" />
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
                {assessment?.title || "Bài kiểm tra đầu vào"}
              </label>
              {/** Questions */}
              <div className="w-full min-h-[280px] max-h-[280px] overflow-y-auto flex flex-row gap-x-2 gap-y-1 flex-wrap justify-center py-3">
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
          {/* Time left (Time taken) */}
          <div
            className="flex flex-col h-30 w-full bg-[#FFE3F2] border-l-0 border-t-2 border-b-2 border-r-2 border-[#FF1493]
                                     rounded-tr-2xl rounded-br-2xl items-center"
          >
            <div className="h-fit w-fit bg-[#3E1B57] text-white rounded-bl-xl rounded-br-xl px-5 py-1.5 font-medium">
              Thời gian đã làm:
            </div>
            <span className="text-3xl text-[#FF1493] font-bold mt-4 tabular-nums">
              {formatTime(timeTaken)}
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
              {currentExercise && (
                <ExerciseWebUI
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
          customMessage={
            modalType === "WARNING"
              ? "Kết quả bài kiểm tra đầu vào sẽ không được lưu nếu bạn chưa nộp bài.\n Bạn có chắc chắn muốn thoát không?"
              : undefined
          }
        />
      )}
    </div>
  );
}
