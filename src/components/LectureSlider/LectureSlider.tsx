'use client'

import { useState, useRef, useEffect } from "react";
import { Lecture } from "@/app/student/(full)/adventure/[grade]/[topic]/page"
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useLectureStore } from "@/stores/lectureStore";
import clsx from "clsx";

export default function LectureSlider({
    lectures, doExercise, onLectureSelectionChange, milestone
}: {
    lectures: Lecture[],
    doExercise: () => void,
    onLectureSelectionChange: (index: number) => void,
    milestone: string
}) {
    const { lectureIdx: idx, setLectureIdx: setIdx } = useLectureStore();
    const [translate, setTranslate] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const ITEM_WIDTH = 520; // roughly 280px image + 200px svg + 20px gap

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const IMAGE_CENTER_OFFSET = 140; // anchor point within each 500px block
            const newTranslate = containerWidth / 2 - (idx * ITEM_WIDTH + IMAGE_CENTER_OFFSET);
            setTranslate(newTranslate);
        }
    }, [idx]);

    const forward = () => {
        if (idx < lectures.length - 1) {
            const newIdx = idx + 1;
            setIdx(newIdx);
            onLectureSelectionChange(newIdx);
        }
    }

    const backward = () => {
        if (idx > 0) {
            const newIdx = idx - 1;
            setIdx(newIdx);
            onLectureSelectionChange(newIdx);
        }
    }

    return (
        <div className="h-full w-full overflow-hidden flex flex-col items-center gap-[100px]">
            {/* Header */}
            <h1 className="text-white font-bold text-[25px] text-wrap text-center px-[20px] min-h-[70px] w-full select-none cursor-pointer">
                {lectures[idx]?.title}
            </h1>

            {/* Slider */}
            <div ref={containerRef} className="relative -mt-[20px] mb-[20px] w-full overflow-hidden">
                <div
                    className={clsx(
                        "flex flex-row gap-[20px] h-fit w-fit transition-transform duration-500 ease-in-out"
                    )}
                    style={{
                        transform: `translateX(${translate}px)`
                    }}
                >
                    {lectures.map((lecture, index) => (
                        <div key={index} className="flex flex-row gap-[20px] items-center">
                            <Image
                                src={milestone}
                                alt=""
                                width={280}
                                height={280}
                                className={clsx(
                                    "aspect-square flex-shrink-0 object-contain",
                                    index === idx ? "scale-100" : "scale-75 opacity-60",
                                    "transition-all duration-500"
                                )}
                            />
                            {index !== lectures.length - 1 && (
                                <svg
                                    className="mt-[40px]"
                                    width="200"
                                    height="100"
                                    viewBox="0 0 500 100"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0 50 C100 0, 200 100, 300 50 S500 100, 500 50"
                                        stroke="#29D9C2"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray="25 25"
                                        fill="none"
                                    />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-row w-full items-center justify-between px-[30px]">
                <FontAwesomeIcon
                    className="text-white text-[40px] cursor-pointer hover:scale-125 transition-all duration-150"
                    icon={faArrowLeft}
                    onClick={backward}
                />
                <div className="overflow-hidden h-[60px]">
                    <iframe className="absolute -translate-y-[90px] -translate-x-[20px]" src="https://cdn.lottielab.com/l/2HPdkE6AbKUhHe.html" height={200}/>
                    <div
                        className="h-[60px] w-[200px] rounded-[20px] bg-[#1DA492] cursor-pointer hover:opacity-90"
                        onClick={doExercise}
                    >
                        <div className="h-full w-full flex items-center justify-center gap-[10px] relative bg-[#23BEAA] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px]">
                            <label className="text-white font-semibold text-[20px] select-none cursor-pointer">
                                Làm bài nào !
                            </label>
                            <span className="h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] absolute right-0 top-0 mt-[7px] mr-[10px]"></span>
                            <span className="h-[5px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] absolute right-0 top-0 mt-[20px] mr-[25px]"></span>
                        </div>
                    </div>
                </div>
                <FontAwesomeIcon
                    className="text-white text-[40px] cursor-pointer hover:scale-125 transition-all duration-150"
                    icon={faArrowRight}
                    onClick={forward}
                />
            </div>
        </div>
    )
}
