'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import { Righteous, Roboto } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import confetti from '../../../../../../../public/assets/exercises/confetti.png';
import sadFace from '../../../../../../../public/assets/exercises/sad.png';

import { World, Lecture, Topic } from "../[topic]/page";

import Volume from "@/components/Volume/Volume";
import LectureSlider from "@/components/LectureSlider/LectureSlider";
import { useLessonStore } from "@/stores/lessonStore";
import { useRouter } from "next/navigation";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });

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
}

export default function LectureClient({
    grade,
    topicOrder,
    world,
    topic,
    lectures,
}: LectureClientProps) {
    const { lectureIdx, setLectureIdx } = useLessonStore();
    const router = useRouter()
    const [mode, setMode] = useState(MODE.LECTURE);

    const currentLecture = lectures[lectureIdx];
    const currentDifficulty = currentLecture?.difficultyNo ?? 0;
    const currentLand = world.lands?.[currentDifficulty];

    const [exercises, setExercises] = useState<string[]>([]);
    const [currExIdx, setCurrExIdx] = useState(0);
    const [isLoadingExercises, setIsLoadingExercises] = useState(false);

    const [showSubmitBanner, setShowSubmitBanner] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(true);

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
            } catch (error) {
                console.error("Error fetching exercises:", error);
            } finally {
                setIsLoadingExercises(false);
            }
        }
        fetchExerciseData();
    }, [lectureIdx]);

    const doExercise = () => {
        setMode(MODE.EXERCISE);
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden">
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
                    {mode === MODE.LECTURE &&
                        <div className="h-[50px] w-fit px-[20px] flex items-center bg-[rgba(0,0,0,0.7)] rounded-[15px] ml-[15px]">
                            <label className="text-white font-bold text-[20px]">
                                {`LỚP ${grade} - THẾ GIỚI: ${world.world.toUpperCase()}`}
                            </label>
                        </div>}
                </div>

                {/* Body */}
                <AnimatePresence mode="wait">
                    {mode === MODE.LECTURE ?
                        (
                            // Lectures Mode View
                            <motion.div key="lecture"
                                initial={{ opacity: 0, x: -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 60 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="flex flex-1 flex-row gap-[20px] pb-[20px] pr-[20px]">
                                {/* Topic panel */}
                                <div
                                    className={clsx(
                                        "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px] h-full w-[400px] flex flex-col pt-[10px]"
                                    )}
                                >
                                    <div className="h-[60px] ml-[20px] w-[220px] bg-[#1DA492] rounded-[20px] flex items-center justify-center cursor-pointer overflow-hidden hover:brightness-110 transition-all duration-200"
                                        onClick={() => router.back()}>
                                        <div className="h-full w-full rounded-tl-[50px] rounded-br-[50px] flex flex-row gap-[10px] items-center justify-center bg-[#23BEAA] relative">
                                            <FontAwesomeIcon icon={faArrowLeft} className="text-white mr-2" />
                                            <span className="text-white font-medium text-[20px]">Quay lại</span>
                                            <span className="h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)] top-0 right-0 mt-[10px] mr-[10px] absolute"></span>
                                        </div>
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
                                {/* Exercises panel */}
                                <div className="flex flex-1 bg-[rgba(0,0,0,0.7)] rounded-[20px] py-[30px] overflow-hidden">
                                    <LectureSlider
                                        lectures={lectures}
                                        doExercise={doExercise}
                                        milestone={world.milestone}
                                        onLectureSelectionChange={setLectureIdx}
                                    />
                                </div>
                            </motion.div>
                        ) :
                        (
                            // Exercises Mode View
                            <motion.div key="exercise"
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="flex flex-1 flex-row gap-[20px] pb-[20px] pr-[20px]">
                                {/* Topic panel */}
                                <div
                                    className={clsx(
                                        "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px]",
                                        "h-full w-[300px] flex flex-col pt-[10px] pl-[20px]"
                                    )}
                                >
                                    {/** Exit button */}
                                    <div className={clsx(
                                        "h-[40px] w-[120px] items-center relative cursor-pointer",
                                        "bg-[#C7434C] rounded-[15px] overflow-hidden",
                                        "hover:brightness-110 transition-all duration-200"
                                    )} onClick={() => setMode(MODE.LECTURE)}>
                                        <div className={clsx(
                                            "h-full w-full flex flex-row items-center justify-center bg-[#FF5964] text-white",
                                            "rounded-tl-[60px] rounded-br-[60px] rounded-tr-[20px] rounded-bl-[20px] gap-[10px]",
                                            "font-medium"
                                        )}>
                                            <FontAwesomeIcon icon={faClose} />
                                            <label className="select-none cursor-pointer">Thoát</label>
                                        </div>
                                        <span className={clsx(
                                            "absolute h-[10px] aspect-square bg-[rgba(255,255,255,0.5)] rounded-full",
                                            "top-0 right-0 -translate-x-[50%] translate-y-[50%]"
                                        )} />
                                    </div>
                                    {/* Main */}
                                    <div className={clsx("flex flex-col text-white mt-[50px]", roboto.className)}>
                                        <label className="text-[18px] font-semibold">{`Bài ${lectureIdx + 1}`}</label>
                                        <h2 className="max-w-[250px] text-wrap text-[25px] font-bold">{currentLecture.title}</h2>
                                    </div>
                                    <div className="flex flex-row flex-wrap gap-[8px] max-w-[85%] mt-[50px]">
                                        {exercises.map((ex, idx) => (
                                            <div key={idx} onClick={() => setCurrExIdx(idx)}
                                                className={clsx(
                                                    'h-[40px] aspect-square rounded-full cursor-pointer relative font-bold',
                                                    currExIdx === idx ? 'bg-[#1DA492] text-white' : 'bg-[#C4F1EB] text-[#1DA492]',
                                                    'hover:opacity-90 flex items-center justify-center',
                                                    righteous.className
                                                )}>
                                                {idx + 1}
                                                <span className={clsx(
                                                    "absolute left-0 ml-[2px] rotate-45 -translate-y-[10px] translate-x-[22px]",
                                                    "h-[7px] w-[12px] rounded-[1000px]",
                                                    "[clip-path:ellipse(50%_50%_at_50%_50%)]",
                                                    currExIdx === idx ? "bg-[rgba(255,255,255,0.3)]" : "bg-white"
                                                )} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={clsx(
                                        'h-[60px] w-[230px] bg-amber-700 rounded-[15px] cursor-pointer',
                                        'hover:brightness-110 transition-all duration-200 overflow-hidden',
                                        'font-bold text-white mt-[100px]'
                                    )}>
                                        <div className={clsx(
                                            'h-full w-full bg-amber-600 cursor-pointer relative',
                                            'flex items-center justify-center',
                                            'font-bold text-white text-[20px]', 'rounded-tl-[40px] rounded-br-[40px]'
                                        )}>
                                            Nộp bài
                                            <span className={clsx(
                                                "h-[20px] aspect-square bg-[rgba(255,255,255,0.3)] absolute",
                                                "top-0 right-0 -translate-x-[50%] translate-y-[30%] rounded-full"
                                            )}></span>
                                        </div>
                                    </div>
                                </div>
                                {/* Lectures panel */}
                                <div className={clsx(
                                    "flex flex-col flex-1 bg-[rgba(0,0,0,0.7)] gap-[10px] rounded-[20px] pt-[20px] overflow-hidden"
                                )}>
                                    <div className="flex flex-col gap-[10px] items-center">
                                        <div className={clsx(
                                            "text-white font-bold bg-[#1DA492] rounded-full",
                                            'px-[20px] py-[5px] w-fit flex items-center justify-center'
                                        )}>
                                            {`CÂU ${currExIdx + 1}`}
                                        </div>
                                        <p className="max-w-full text-center text-wrap text-white text-[18px] font-semibold">
                                            {exercises[currExIdx]}
                                        </p>
                                    </div>
                                    {/** Interactive area */}
                                    <div className="min-h-[440px] w-full"></div>
                                    {/** Buttons */}
                                    <div className="flex flex-1 flex-row w-full items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            {!showSubmitBanner ?
                                                (
                                                    // Submit Button
                                                    <motion.div key="submit-button"
                                                        initial={{ opacity: 0, y: 0 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -30 }}
                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                        className={clsx(
                                                            'h-[50px] w-[250px] bg-[#1DA492] rounded-[15px] cursor-pointer',
                                                            'hover:brightness-110 transition-all duration-200 overflow-hidden',
                                                            'font-bold text-white flex items-center'
                                                        )} onClick={() => setShowSubmitBanner(true)}>
                                                        <div className={clsx(
                                                            'h-full w-full bg-[#23BEAA] cursor-pointer relative',
                                                            'flex items-center justify-center',
                                                            'font-bold text-white text-[16px]', 'rounded-tl-[40px] rounded-br-[40px]'
                                                        )}>
                                                            Kiểm tra câu trả lời
                                                            <span className={clsx(
                                                                "h-[20px] aspect-square bg-[rgba(255,255,255,0.3)] absolute",
                                                                "top-0 right-0 -translate-x-[50%] translate-y-[30%] rounded-full"
                                                            )}></span>
                                                        </div>
                                                    </motion.div>) :
                                                (
                                                    // Submit Result Banner
                                                    <motion.div key="submit-banner"
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -30 }}
                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                        className="
                                                        h-full w-full bg-[rgba(255,255,255,0.15)] border-t-2 border-t-[rgba(255,255,255,0.2)]
                                                        flex flex-row items-center px-[50px]
                                                        ">
                                                        <Image
                                                            src={isAnswerCorrect ? confetti : sadFace}
                                                            alt="" height={100} width={100} />
                                                        <div className="flex flex-col gap-[10px] ml-[100px]">
                                                            <h1 className={clsx(
                                                                roboto.className,
                                                                'text-2xl font-bold', isAnswerCorrect ? 'text-green-400' : 'text-red-400'
                                                            )}>
                                                                {isAnswerCorrect ? 'GIỎI QUÁ ! BẠN LÀM ĐÚNG RỒI !' : 'TIẾC QUÁ ! BẠN LÀM SAI RỒI !'}
                                                            </h1>
                                                            <div className="flex flex-row gap-[15px] items-center text-[#FF9600] text-xl font-medium">
                                                                +
                                                                <span>
                                                                    <Image src='https://res.cloudinary.com/dirr7ovdh/image/upload/v1761541691/crystal_x9l493.svg'
                                                                        height={50} width={50} alt="" />
                                                                </span>
                                                                100 thạch anh
                                                            </div>
                                                        </div>
                                                        {
                                                            isAnswerCorrect ?
                                                                (
                                                                    <div className="flex flex-row gap-[20px] text-3xl text-white items-center justify-center font-bold ml-auto mr-0
                                                                                cursor-pointer hover:gap-[40px] hover:mr-[20px] transition-all duration-200">
                                                                        <span>TIẾP <br /> TỤC</span>
                                                                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                                                                    </div>
                                                                ) :
                                                                (
                                                                    <div className="flex flex-col gap-[20px] items-center justify-center ml-auto mr-0">
                                                                        <div className="h-[50px] w-[200px] text-white text-xl rounded-full bg-red-400 flex items-center justify-center cursor-pointer hover:brightness-105">
                                                                            Xem đáp án
                                                                        </div>
                                                                        <div className="flex flex-row gap-[10px] text-xl text-white items-center justify-center font-bold
                                                                                cursor-pointer hover:gap-[20px] transition-all duration-200">
                                                                            <span>TIẾP TỤC</span>
                                                                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                        }
                                                    </motion.div>
                                                )
                                            }
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}
