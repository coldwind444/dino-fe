'use client'

import { FC, use, useEffect, useState } from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Volume from "@/components/Volume/Volume";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRouter } from "next/navigation";
import LectureSlider from "@/components/LectureSlider/LectureSlider";
import Loader from "@/components/Loader/Loader";

interface MilestonesPageProps {
    params: Promise<{
        grade: string;
        topic: string;
    }>;
}

interface World {
    world: string;
    milestone: string;
    lands: Land[];
    topics: Topic[];
}

interface Land {
    name: string;
    illustration: string;
}

interface Topic {
    name: string;
    brand: string;
}

export interface Lecture {
    title: string;
    difficultyNo: number;
    difficultyName: string;
}

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

const Milestones: FC<MilestonesPageProps> = ({ params }) => {
    const { grade, topic } = React.use(params)
    const router = useRouter();
    const [world, setWorld] = useState<World | undefined>();
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [lectureIdx, setLectureIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    const doExercise = () => {
        confirm("Bắt đầu làm bài tập");
    }

    const onLectureSelectionChange = (index: number) => {
        setLectureIdx(index);
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const [worldRes, lectureRes] = await Promise.all([
                    fetch(
                        "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/milestone_updated.json",
                        { cache: "no-store" }
                    ),
                    fetch(
                        "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/lecture_data_sample.json",
                        { cache: "no-store" }
                    ),
                ]);

                const worldData = await worldRes.json();
                const lectureData = await lectureRes.json();
                console.log(lectureData)

                setWorld(worldData[grade]);
                setLectures(lectureData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [grade]);

    // Show loading state until data ready
    if (loading || !world || lectures.length === 0) {
        return (
            <Loader/>
        );
    }

    const currentLecture = lectures[lectureIdx];
    const currentDifficulty = currentLecture?.difficultyNo ?? 0;
    const currentLand = world.lands?.[currentDifficulty];
    const topicIndex = Number(topic) - 1;
    const currentTopic = world.topics?.[topicIndex];

    return (
        <div className="h-screen w-screen">
            {/* Background */}
            <Image
                className="h-full w-full object-fill"
                fill
                src={currentLand?.illustration || ""}
                alt=""
            />

            {/* Main content */}
            <div className="absolute h-full w-full flex flex-col gap-[10px]">
                {/* Header */}
                <div className="flex flex-row gap-[10px] p-[15px] items-center">
                    {/* Mode label */}
                    <div className="relative px-[25px] py-[6px] bg-[#1DA492] rounded-[15px] text-white font-bold">
                        <label className={clsx(roboto.className, "text-[15px]")}>
                            Đang ở chế độ phiêu lưu
                        </label>
                        <div className="absolute right-0 -translate-y-[28px] mr-[6px]">
                            <div className="h-[12px] aspect-square rounded-full bg-[rgba(255,255,255,0.3)]" />
                            <div
                                className={clsx(
                                    "h-[5px] aspect-square rounded-full bg-[rgba(255,255,255,0.3)]",
                                    "-translate-x-[5px] -translate-y-[2px]"
                                )}
                            />
                        </div>
                    </div>
                    <Volume />
                    {/** World label */}
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
                            "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px] h-full w-[400px]",
                            "flex flex-col pt-[10px]"
                        )}
                    >
                        {/* Back button */}
                        <div
                            className={clsx(
                                "h-[60px] ml-[20px] w-[220px] rounded-[20px] bg-[#1DA492] cursor-pointer hover:opacity-90"
                            )}
                        >
                            <div
                                className={clsx(
                                    "h-[60px] w-[220px] bg-[#1DA492] relative flex flex-row text-white font-medium text-[20px]",
                                    "bg-[#23BEAA] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px]",
                                    "items-center justify-center gap-[15px]"
                                )}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                <label className="select-none cursor-pointer">Quay lại</label>
                                <span
                                    className={clsx(
                                        "h-[15px] aspect-square rounded-full absolute bg-[rgba(255,255,255,0.3)]",
                                        "right-0 top-0 mt-[5px] mr-[10px]"
                                    )}
                                />
                                <span
                                    className={clsx(
                                        "h-[6px] aspect-square rounded-full absolute bg-[rgba(255,255,255,0.3)]",
                                        "right-0 top-0 mt-[15px] mr-[25px]"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Topic brand */}
                        <div className="flex flex-col items-center justify-center mt-7 gap-[20px]">
                            <Image
                                src={currentTopic?.brand || ""}
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
                                {`CHỦ ĐỀ ${topic}`}
                            </div>
                            <label
                                className={clsx(
                                    roboto.className,
                                    "text-white text-[22px] font-bold text-center text-wrap max-w-[300px]"
                                )}
                            >
                                {currentTopic?.name || ""}
                            </label>
                        </div>

                        {/* Detail */}
                        <div className="flex flex-col pl-[50px] text-white font-bold text-[18px] mt-[100px]">
                            <label>{`Mức độ: ${currentLecture?.difficultyName || ""}`}</label>
                            <label>{`Khu vực: ${currentLand?.name || ""}`}</label>
                        </div>
                    </div>
                    {/** Lectures panel */}
                    <div className="flex flex-1 bg-[rgba(0,0,0,0.7)] rounded-[20px] py-[30px] overflow-hidden">
                        <LectureSlider lectures={lectures} doExercise={doExercise} milestone={world.milestone}
                                    onLectureSelectionChange={onLectureSelectionChange}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Milestones;
