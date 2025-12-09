'use client";'

import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Roboto } from "next/font/google";
import LectureSlider from "@/components/LectureSlider/LectureSlider";
import { GradeResponse, WorldResponse, LandResponse, TopicResponse, LectureResponse } from "@/types";
import { useEffect, useState } from "react";
import { useLessonStore } from "@/stores/lessonStore";
import { getLecturesByTopicId, getTopicById } from "@/apis";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

interface MilestonesViewProps {
  world: WorldResponse;
  land: LandResponse;
  topic: TopicResponse;
  lectures: LectureResponse[];
  onBack: () => void;
  onDoExercise: () => void;
}

export default function MilestonesView({ world, land, topic, lectures, onBack, onDoExercise }: MilestonesViewProps) {
  const { lectureIdx } = useLessonStore();
  
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
          "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px] h-full w-[400px] flex flex-col pt-[10px]"
        )}
      >
        <div
          className="h-[60px] ml-[20px] w-[220px] bg-[#1DA492] rounded-[20px] flex items-center justify-center cursor-pointer overflow-hidden hover:brightness-110 transition-all duration-200"
          onClick={onBack}
        >
          <div className="h-full w-full rounded-tl-[50px] rounded-br-[50px] flex flex-row gap-[10px] items-center justify-center bg-[#23BEAA] relative">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-white mr-2"
            />
            <span className="text-white font-medium text-[20px]">
              Quay lại
            </span>
            <span className="h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] top-0 right-0 mt-[10px] mr-[10px] absolute"></span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-7 gap-[20px]">
          <Image
            src={topic?.description || ''}
            alt=""
            height={120}
            width={120}
          />
          <div
            className={clsx(
              "h-fit w-fit px-[30px] py-[10px] bg-[#1DA492] text-white font-bold rounded-full",
              roboto.className
            )}
          >
            {`CHỦ ĐỀ ${topic?.weekNumbers[0] || ""}`}
          </div>
          <label
            className={clsx(
              roboto.className,
              "text-white text-[22px] font-bold text-center text-wrap max-w-[300px]"
            )}
          >
            {topic?.title || ""}
          </label>
        </div>
        <div className="flex flex-col pl-[50px] text-white font-bold text-[18px] mt-[100px]">
          <label>{`Mức độ: ${lectures[lectureIdx].contentType || ""}`}</label>
          <label>{`Khu vực: ${land.name || ""}`}</label>
        </div>
      </div>
      {/* Exercises panel */}
      <div className="flex flex-1 bg-[rgba(0,0,0,0.7)] rounded-[20px] py-[30px] overflow-hidden">
        <LectureSlider
          lectures={lectures}
          doExercise={onDoExercise}
          milestone={world.milestoneUrl || ''}
        />
      </div>
    </motion.div>
  );
}