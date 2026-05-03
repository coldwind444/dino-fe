import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, Dispatch } from "react";
import { SetStateAction } from "react";
import { useSpring, animated } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faClose,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import congrats from "../../../../../../../../public/assets/exercises/praise.png";
import sadFace from "../../../../../../../../public/assets/exercises/sad.png";
import { roboto, righteous } from "@/app/fonts";
import CocosGameWrapper, {
  type CocosGameWrapperRef,
} from "@/components/GameComponent/CocosGameWrapper";
import { ExerciseResponse, LectureResponse, AnswerResponse } from "@/types";
import { createLectureResult, getExercises, upsertAnswers } from "@/apis";
import React from "react";
import ExplainModal, {
  Theme,
  themeBackgrounds,
} from "@/components/ExplainModal/ExplainModal";
import { useLessonStore } from "@/stores/lessonStore";
import { cleanedAnswerArray } from "@/helpers/utils";
import { APIError } from "@/apis/config";

interface ExerciseViewProps {
  currentLecture: LectureResponse;
  userId: string;
  totalScore: number;
  setTotalScore: Dispatch<SetStateAction<number>>;
  setTotalReward: Dispatch<SetStateAction<number>>;
  onExit: () => void;
  onFinish: (max: number) => void;
}

const THEME_ARRAY: Theme[] = ["prairie", "forest", "beach", "desert", "ruby"];

export default function ExerciseView({
  currentLecture,
  userId,
  totalScore,
  onExit,
  onFinish,
  setTotalScore,
  setTotalReward,
}: ExerciseViewProps) {
  // Refs
  const cocosGameRef = useRef<CocosGameWrapperRef>(null);
  const { gradeLevel } = useLessonStore();

  // Rising animated points
  const [currentPoints, setCurrentPoints] = useState(0);
  const { number } = useSpring({
    from: { number: 0 },
    number: currentPoints,
    config: { duration: 600 },
  });

  // UI states
  const [showSubmitBanner, setShowSubmitBanner] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [doneExercises, setDoneExercises] = useState<number[]>([]);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showExplainButton, setShowExplainButton] = useState(false);

  // Data states
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [answers, setAnswers] = useState<AnswerResponse[]>([]);
  const [currExIdx, setCurrExIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Functions
  const handleCheckAnswer = () => {
    if (cocosGameRef.current) {
      cocosGameRef.current.checkAnswer();
    }
  };

  const handleAnswerChecked = (
    isCorrect: boolean,
    score: number,
    points: number = 0,
    userAnswer?: object,
  ) => {
    const ans: AnswerResponse = {
      _id: `temp-${Date.now()}-${Math.random()}`,
      exerciseId: exercises[currExIdx]._id,
      userId,
      isCorrect,
      score: points,
      lectureResultId: `temp-${currentLecture._id}`,
      assessmentResultId: "",
      arenaParticipationId: "",
      answerData: userAnswer,
    };
    setAnswers([...answers, ans]);
    setIsAnswerCorrect(isCorrect);

    if (!doneExercises.includes(currExIdx)) {
      setShowSubmitBanner(true);
      setDoneExercises([...doneExercises, currExIdx]);
      if (isCorrect) {
        setTimeout(() => setCurrentPoints(points), 300);
        setTotalScore((prev) => prev + 1);
        setTotalReward((prev) => prev + points);
      }
    }
  };

  const handleContinueAfterAnswer = async () => {
    setShowSubmitBanner(false);
    setShowExplainButton(false);

    if (
      doneExercises.length < exercises.length &&
      currExIdx < exercises.length - 1
    ) {
      setCurrExIdx(currExIdx + 1);
    } else {
      onFinish(exercises.length);
      await submitLectureResult();
    }
  };

  const handleShowCorrectAnswer = () => {
    setShowExplainButton(true);
    if (cocosGameRef.current) {
      cocosGameRef.current.showCorrectAnswer();
    }
  };

  // Currently working on this
  const submitLectureResult = async () => {
    if (doneExercises.length !== exercises.length) {
      alert("Vui lòng hoàn thành tất cả các câu hỏi!");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createLectureResult({
        lectureId: currentLecture._id,
        correctCount: totalScore,
        totalQuestions: exercises.length,
        timeTaken: 0,
      });
      const modifiedAnswers = answers.map((ans) => ({
        ...ans,
        lectureResultId: res._id,
      }));
      await upsertAnswers(cleanedAnswerArray(modifiedAnswers));
      onFinish(exercises.length);
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message);
      }
      setIsSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exs = await getExercises({
          lectureId: currentLecture._id,
          limit: 50,
        });
        setExercises(exs.sort((a, b) => a.order - b.order));
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      }
    };
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowSubmitBanner(false);
    setCurrentPoints(0);
  }, [currExIdx]);

  return (
    <motion.div
      key="exercise"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-1 flex-row gap-[20px] pb-[20px] pr-[20px]"
    >
      {/* Topic panel */}
      <div
        className={clsx(
          "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px]",
          "h-full w-[300px] flex flex-col pt-[10px] pl-[20px]",
        )}
      >
        {/** Exit button */}
        <div
          className={clsx(
            "h-[40px] w-[120px] items-center relative cursor-pointer",
            "bg-[#C7434C] rounded-[15px] overflow-hidden",
            "hover:brightness-110 transition-all duration-200",
          )}
          onClick={onExit}
        >
          <div
            className={clsx(
              "h-full w-full flex flex-row items-center justify-center bg-[#FF5964] text-white",
              "rounded-tl-[60px] rounded-br-[60px] rounded-tr-[20px] rounded-bl-[20px] gap-[10px]",
              "font-medium",
            )}
          >
            <FontAwesomeIcon icon={faClose} />
            <label className="select-none cursor-pointer">Thoát</label>
          </div>
          <span
            className={clsx(
              "absolute h-[10px] aspect-square bg-[rgba(255,255,255,0.5)] rounded-full",
              "top-0 right-0 -translate-x-[50%] translate-y-[50%]",
            )}
          />
        </div>
        {/* Question numbers area */}
        <div
          className={clsx(
            "flex flex-col text-white mt-[50px]",
            roboto.className,
          )}
        >
          <h2 className="max-w-[250px] text-wrap text-[23px] font-bold">
            {currentLecture?.title}
          </h2>
        </div>
        <div className="flex flex-row flex-wrap gap-[8px] max-w-[90%] mt-[50px] max-h-80 overflow-y-auto">
          {exercises.map((ex, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (!doneExercises.includes(idx)) setCurrExIdx(idx);
              }}
              className={clsx(
                "h-[40px] aspect-square rounded-full cursor-pointer relative font-bold",
                currExIdx === idx
                  ? "bg-[#1DA492] text-white"
                  : doneExercises.includes(idx)
                    ? "bg-amber-500 text-white"
                    : "bg-[#C4F1EB] text-[#1DA492]",
                "hover:opacity-90 flex items-center justify-center",
                righteous.className,
              )}
            >
              {idx + 1}
              <span
                className={clsx(
                  "absolute left-0 ml-[2px] rotate-45 -translate-y-[10px] translate-x-[22px]",
                  "h-[7px] w-[12px] rounded-[1000px]",
                  "[clip-path:ellipse(50%_50%_at_50%_50%)]",
                  currExIdx === idx || doneExercises.includes(idx)
                    ? "bg-[rgba(255,255,255,0.3)]"
                    : "bg-white",
                )}
              />
            </div>
          ))}
        </div>
        {/* Submit button */}
        <div
          className={clsx(
            "h-[60px] w-[230px] bg-amber-700 rounded-[15px]",
            isSubmitting
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:brightness-110",
            "transition-all duration-200 overflow-hidden font-bold text-white mt-auto mb-10",
          )}
          onClick={isSubmitting ? undefined : submitLectureResult}
          data-testid="submit-btn"
        >
          <div
            className={clsx(
              "h-full w-full bg-amber-600 relative",
              "flex items-center justify-center",
              "font-bold text-white text-[20px]",
              "rounded-tl-[40px] rounded-br-[40px]",
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                Đang nộp...
              </div>
            ) : (
              "Nộp bài"
            )}
            {!isSubmitting && (
              <span
                className={clsx(
                  "h-[20px] aspect-square bg-[rgba(255,255,255,0.3)] absolute",
                  "top-0 right-0 -translate-x-[50%] translate-y-[30%] rounded-full",
                )}
              ></span>
            )}
          </div>
        </div>
      </div>

      {/* Main container */}
      <div
        className={clsx(
          "relative flex flex-col flex-1 bg-[rgba(0,0,0,0.7)] gap-[10px] rounded-[20px] pt-[20px] overflow-hidden",
        )}
      >
        <div className="flex flex-col gap-[10px] items-center">
          <div
            className={clsx(
              "text-white font-bold bg-[#1DA492] rounded-full",
              "px-[20px] py-[5px] w-fit flex items-center justify-center",
            )}
          >
            {`CÂU ${currExIdx + 1}`}
          </div>
        </div>
        {/** Interactive area */}
        <div className="max-h-[440px] w-full flex items-center justify-center">
          <CocosGameWrapper
            data-testid="cocos-game"
            exercises={exercises}
            currentExerciseIndex={currExIdx}
            ref={cocosGameRef}
            onAnswerChecked={handleAnswerChecked}
          />
        </div>
        {/** Buttons and Banners */}
        <div className="flex flex-1 flex-row w-full items-end justify-center">
          <AnimatePresence mode="wait">
            {!showSubmitBanner ? (
              // Check button
              <motion.div
                key="submit-button"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={clsx(
                  "h-[50px] w-[250px] bg-[#1DA492] rounded-[15px] cursor-pointer",
                  "hover:brightness-110 transition-all duration-200 overflow-hidden",
                  "font-bold text-white flex items-center mb-10",
                )}
                onClick={handleCheckAnswer}
              >
                <div
                  className={clsx(
                    "h-full w-full bg-[#23BEAA] cursor-pointer relative",
                    "flex items-center justify-center",
                    "font-bold text-white text-[16px]",
                    "rounded-tl-[40px] rounded-br-[40px]",
                  )}
                >
                  Kiểm tra câu trả lời
                  <span
                    className={clsx(
                      "h-[20px] aspect-square bg-[rgba(255,255,255,0.3)] absolute",
                      "top-0 right-0 -translate-x-[50%] translate-y-[30%] rounded-full",
                    )}
                  ></span>
                </div>
              </motion.div>
            ) : (
              // Submit banner
              <motion.div
                key="submit-banner"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-[90%] relative w-full bg-[rgba(255,255,255,0.15)] border-t-2 border-t-[rgba(255,255,255,0.2)] flex flex-row items-center px-[50px]"
              >
                <Image
                  src={isAnswerCorrect ? congrats : sadFace}
                  alt=""
                  height={200}
                  width={200}
                  className="absolute -top-16 z-10"
                  style={{
                    filter:
                      "drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.5))",
                  }}
                />
                <div className="flex flex-col gap-[10px] ml-60">
                  <h1
                    className={clsx(
                      roboto.className,
                      "text-2xl font-bold",
                      isAnswerCorrect ? "text-green-400" : "text-red-400",
                    )}
                  >
                    {isAnswerCorrect
                      ? "GIỎI QUÁ ! BẠN LÀM ĐÚNG RỒI !"
                      : "TIẾC QUÁ ! BẠN LÀM SAI RỒI !"}
                  </h1>
                  {currentPoints > 0 && (
                    <div className="flex flex-row gap-[15px] items-center text-[#FF9600] text-xl font-medium">
                      +
                      <span>
                        <Image
                          src="https://res.cloudinary.com/dirr7ovdh/image/upload/f_auto,q_auto/v1761541691/crystal_x9l493.svg"
                          height={50}
                          width={50}
                          alt=""
                        />
                      </span>
                      <animated.span>
                        {number.to((n) => Math.floor(n))}
                      </animated.span>
                      thạch anh
                    </div>
                  )}
                </div>
                {isAnswerCorrect ? (
                  <div
                    className="flex flex-row gap-[20px] text-3xl text-white items-center justify-center font-bold ml-auto mr-0 cursor-pointer hover:gap-[40px] hover:mr-[20px] transition-all duration-200"
                    onClick={handleContinueAfterAnswer}
                  >
                    <span>
                      TIẾP <br /> TỤC
                    </span>
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-[20px] items-center justify-center ml-auto mr-0">
                    {!showExplainButton ? (
                      <div
                        className="h-[50px] w-[200px] text-white text-xl rounded-full bg-red-400 flex items-center justify-center cursor-pointer hover:brightness-105"
                        onClick={handleShowCorrectAnswer}
                      >
                        Xem đáp án
                      </div>
                    ) : (
                      <div
                        className="h-[50px] w-[200px] text-white text-xl rounded-full bg-amber-500 flex items-center justify-center cursor-pointer hover:brightness-105"
                        onClick={() => setShowExplainModal(true)}
                      >
                        Xem giải thích
                      </div>
                    )}
                    <div
                      className="flex flex-row gap-[10px] text-xl text-white items-center justify-center font-bold cursor-pointer hover:gap-[20px] transition-all duration-200"
                      onClick={handleContinueAfterAnswer}
                    >
                      <span>TIẾP TỤC</span>
                      <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preload theme background */}
        <div className="hidden">
          <Image
            src={themeBackgrounds[THEME_ARRAY[Number(gradeLevel) - 1]]}
            alt="preload"
            width={0}
            height={0}
            priority
          />
        </div>

        {/* Explain Modal */}
        <ExplainModal
          theme={THEME_ARRAY[Number(gradeLevel) - 1]}
          explanation={exercises[currExIdx]?.explanation}
          isOpen={showExplainModal}
          onClose={() => setShowExplainModal(false)}
        />
      </div>
    </motion.div>
  );
}
