'use client';

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { Roboto } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { World, Lecture, Topic } from "../[topic]/page";

import Volume from "@/components/Volume/Volume";
import LectureSlider from "@/components/LectureSlider/LectureSlider";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

interface LectureClientProps {
    grade: string;
    topicOrder: string;
    world: World;
    topic: Topic;
    lectures: Lecture[];
}

export default function LectureClient({
    grade,
    topicOrder,
    world,
    topic,
    lectures,
}: LectureClientProps) {
    const [lectureIdx, setLectureIdx] = useState(0);

    const currentLecture = lectures[lectureIdx];
    const currentDifficulty = currentLecture?.difficultyNo ?? 0;
    const currentLand = world.lands?.[currentDifficulty];

    const doExercise = () => {
        confirm("Bắt đầu làm bài tập");
    };

    return (
        <div className="h-screen w-screen relative">
            <Image
                className="h-full w-full object-fill"
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
                    <div className="h-[50px] w-fit px-[20px] flex items-center bg-[rgba(0,0,0,0.7)] rounded-[15px] ml-[15px]">
                        <label className="text-white font-bold text-[20px]">
                            {`LỚP ${grade} - THẾ GIỚI: ${world.world.toUpperCase()}`}
                        </label>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-row gap-[20px] pb-[20px] pr-[20px]">
                    {/* Topic panel */}
                    <div
                        className={clsx(
                            "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px] h-full w-[400px] flex flex-col pt-[10px]"
                        )}
                    >
                        <div className="h-[60px] ml-[20px] w-[220px] bg-[#1DA492] rounded-[20px] flex items-center justify-center cursor-pointer hover:opacity-90">
                            <FontAwesomeIcon icon={faArrowLeft} className="text-white mr-2" />
                            <span className="text-white font-medium text-[20px]">Quay lại</span>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-7 gap-[20px]">
                            <Image src={topic?.brand || ""} alt="" height={120} width={120} />
                            <div
                                className={clsx(
                                    "h-fit w-fit px-[30px] py-[10px] bg-[#1DA492] text-white font-bold rounded-full",
                                    roboto.className
                                )}
                            >
                                {`CHỦ ĐỀ ${topicOrder}`}
                            </div>
                            <label
                                className={clsx(
                                    roboto.className,
                                    "text-white text-[22px] font-bold text-center text-wrap max-w-[300px]"
                                )}
                            >
                                {topic?.name || ""}
                            </label>
                        </div>

                        <div className="flex flex-col pl-[50px] text-white font-bold text-[18px] mt-[100px]">
                            <label>{`Mức độ: ${currentLecture?.difficultyName || ""}`}</label>
                            <label>{`Khu vực: ${currentLand?.name || ""}`}</label>
                        </div>
                    </div>

                    {/* Lectures panel */}
                    <div className="flex flex-1 bg-[rgba(0,0,0,0.7)] rounded-[20px] py-[30px] overflow-hidden">
                        <LectureSlider
                            lectures={lectures}
                            doExercise={doExercise}
                            milestone={world.milestone}
                            onLectureSelectionChange={setLectureIdx}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
