import clsx from "clsx";
import Image from "next/image";
import { motion } from "framer-motion";
import { roboto, coiny } from "@/app/fonts";
import { useSpring, animated } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBook,
  faCoins,
  faGift,
  faGraduationCap,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { LectureResponse, TopicResponse } from "@/types";
import { useEffect, useState, useRef } from "react";

import { createProgress, updateUserQuartz } from "@/apis";
import Loader from "@/components/Loader/Loader";

const trophy = "/assets/exercises/trophy.png";
const flags = "/assets/exercises/flags.png";

interface FinishViewProps {
  grade: string;
  topic: TopicResponse;
  currentLecture: LectureResponse;
  score: number;
  reward: number;
  maxScore: number;
  onContinue: () => void;
}

export default function FinishView({
  grade,
  topic,
  currentLecture,
  score,
  reward,
  maxScore,
  onContinue,
}: FinishViewProps) {
  // Rising animated points
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedReward, setAnimatedReward] = useState(0);
  const spring = useSpring({
    from: {
      reward: 0,
      score: 0,
    },
    to: {
      reward: animatedReward,
      score: animatedScore,
    },
    config: { duration: 800 },
  });

  // UI States
  const [loading, setLoading] = useState(false);
  const hasUpdatedRef = useRef(false);

  // Effects
  useEffect(() => {
    setTimeout(() => {
      setAnimatedScore(score);
      setAnimatedReward(reward);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!reward || !score || hasUpdatedRef.current) return;

    const updateResult = async () => {
      hasUpdatedRef.current = true;
      setLoading(true);
      try {
        await Promise.all([
          updateUserQuartz(reward),
          createProgress({
            topicId: topic._id,
            lectureId: currentLecture._id,
            completion: 100,
            status: "completed",
          }),
        ]);
      } catch (error) {
        console.log("Failed to update quartz.", error);
        hasUpdatedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    updateResult();
  }, [reward, score, currentLecture._id, topic._id]);

  return (
    <motion.div
      key="finish-popup"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="h-[95vh] w-[45vw] bg-[rgba(255,255,255,0.4)] rounded-[20px] ml-auto mr-auto -translate-y-14 flex items-center justify-center">
        <div className="h-[90%] w-[85%] rounded-[20px] bg-white shadow-[0_25px_50px_rgba(0,0,0,0.25)] flex flex-col">
          {/** Header */}
          <div className="rounded-tl-[20px] rounded-tr-[20px] h-[32%] w-full bg-gradient-to-r from-0% from-[#5946E5] to-100% to-[#AB3AED] flex flex-row items-center justify-between">
            <Image src={flags} alt="" height={150} width={150} />
            <div className="flex flex-col items-center justify-center gap-1">
              <Image src={trophy} alt="" height={100} width={100} />
              <label
                className={clsx(
                  "text-white font-bold mt-2",
                  coiny.className,
                  "text-3xl",
                )}
              >
                CHÚC MỪNG
              </label>
              <label className={clsx("text-white text-xl", roboto.className)}>
                Bạn thật là đỉnh !
              </label>
            </div>
            <Image
              src={flags}
              alt=""
              height={150}
              width={150}
              className="scale-x-[-1]"
            />
          </div>
          {/** Body */}
          <div className="flex flex-1 flex-col py-3 px-5 gap-3 items-center">
            <label className="text-[#1F2937] font-bold text-2xl">
              Hoàn thành bài học
            </label>
            {/** Lecture Info */}
            <div className="h-fit w-full bg-[#EFF6FF] rounded-[10px] py-5 px-10 flex flex-col gap-5">
              <div className="flex flex-row gap-7 items-center">
                <div className="aspect-square h-12 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-[20px]">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className={clsx("flex flex-col", roboto.className)}>
                  <label className="text-[#4B5563] text-xs">Khối lớp</label>
                  <label className="text-[#1F2937] text-[16px] font-bold">
                    Lớp {grade}
                  </label>
                </div>
              </div>
              <div className="flex flex-row gap-7 items-center">
                <div className="aspect-square h-12 bg-[#4F46E5] rounded-full flex items-center justify-center text-white text-[20px]">
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className={clsx("flex flex-col", roboto.className)}>
                  <label className="text-[#4B5563] text-xs">Chủ đề</label>
                  <label className="text-[#1F2937] text-[16px] font-bold">
                    {topic?.title || ""}
                  </label>
                </div>
              </div>
              <div className="flex flex-row gap-7 items-center">
                <div className="aspect-square h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white text-[20px]">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className={clsx("flex flex-col", roboto.className)}>
                  <label className="text-[#4B5563] text-xs">Bài học</label>
                  <label className="text-[#1F2937] text-[16px] font-bold">
                    {currentLecture?.title || ""}
                  </label>
                </div>
              </div>
            </div>
            {/** Score and Reward */}
            <div className="flex flex-row gap-2 min-h-[20%] h-fit w-full">
              <div className="h-fit w-1/2 rounded-[10px] text-white flex flex-row gap-12 px-5 py-3 items-center bg-gradient-to-br from-0% from-[#F59E0B] to-100% to-[#F97316]">
                <div className="flex flex-col items-center justify-center gap-1">
                  <FontAwesomeIcon className="text-4xl" icon={faCoins} />
                  <label className="text-[16px]">Tổng điểm</label>
                </div>
                <div className="flex flex-row gap-2">
                  <animated.span className="font-medium text-3xl">
                    {spring.score.to((n) => Math.floor(n))}
                  </animated.span>
                  <span className="font-medium text-3xl">{`/ ${maxScore}`}</span>
                </div>
              </div>
              <div className="h-fit w-1/2 rounded-[10px] text-white flex flex-row gap-5 px-5 py-3 items-center bg-gradient-to-br from-0% from-[#EC4899] to-100% to-[#7C3AED]">
                <div className="flex flex-col items-center justify-center gap-1">
                  <FontAwesomeIcon className="text-4xl" icon={faGift} />
                  <label className="text-[16px]">Phần thưởng</label>
                </div>
                <div className="font-medium text-3xl flex flex-row items-center">
                  <Image
                    src="https://res.cloudinary.com/dirr7ovdh/image/upload/f_auto,q_auto/v1761541691/crystal_x9l493.svg"
                    height={30}
                    width={30}
                    alt=""
                    className="inline-block mr-2"
                  />
                  <animated.span>
                    {spring.reward.to((n) => Math.floor(n))}
                  </animated.span>
                </div>
              </div>
            </div>
            {/** Continue Button */}
            <button
              disabled={loading}
              className="flex flex-row h-[50px] text-white items-center justify-center w-2/3 ml-auto mr-auto 
                    cursor-pointer hover:opacity-90 transition-all duration-200 bg-[#4F46E5] rounded-[15px] px-10 gap-5 mt-3
                    disabled:opacity-80 disabled:cursor-not-allowed relative"
              onClick={onContinue}
            >
              <label className="cursor-pointer">Tiếp tục</label>
              <FontAwesomeIcon icon={faArrowRight} />
              <div className="absolute left-2">
                <Loader isLoading={loading} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
