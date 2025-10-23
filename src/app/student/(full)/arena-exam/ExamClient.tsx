'use client'

import { faArrowLeftLong, faArrowRightLong, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { Righteous } from "next/font/google"
import { useState } from "react"

interface ExamClientProps {
    questions: string[]
}

const righteous = Righteous({ weight: '400' })

export default function ExamClient({ questions }: ExamClientProps) {
    const [currSection, setCurrSection] = useState(0)
    const [currQuestion, setCurrQuestion] = useState(0)

    return (
        <div className="h-screen w-screen bg-[#FFF6EA] flex flex-row gap-[15px] py-[30px]">
            {/** Side area */}
            <div className="w-1/5 h-full flex flex-col gap-[15px]">
                {/** Question panel */}
                <div className="h-3/4 w-full bg-white rounded-br-[20px] rounded-tr-[20px] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                    {/** Exit button */}
                    <div className={clsx(
                        "h-[55px] w-[160px] bg-[#DE4B54] ml-auto mr-auto",
                        'rounded-[20px] overflow-hidden -translate-y-[15px] cursor-pointer',
                        'hover:opacity-90'
                    )}>
                        <div className={clsx(
                            "h-full w-full rounded-tl-[50px] rounded-br-[40px] bg-[#FF5964] relative",
                            'flex flex-row gap-[10px] text-white text-[18px] items-center justify-center font-medium'
                        )}>
                            <FontAwesomeIcon icon={faClose} />
                            <label className="cursor-pointer">Thoát</label>
                            <span className={clsx(
                                "absolute h-[15px] aspect-square rounded-full bg-[rgba(255,255,255,0.3)]",
                                'top-0 right-0 mr-[10px] mt-[5px]'
                            )}></span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center px-[30px] mt-[20px]">
                        {/** Title */}
                        <label className="text-[22px] font-bold text-[#F9740B] leading-7">
                            ĐỀ THI ĐẤU TRƯỜNG <br />
                            TUẦN 11
                        </label>
                        {/** Questions */}
                        <div className="w-full h-[250px] mt-[40px] flex flex-row gap-x-[10px] gap-y-[5px] flex-wrap">
                            {questions.filter((_, idx) => idx >= currSection * 25 && idx < (currSection + 1) * 25)
                                .map((val, idx) => {
                                    const globalIdx = currSection * 25 + idx;
                                    return (
                                        <div key={globalIdx}
                                            className={clsx(
                                                "h-[40px] cursor-pointer aspect-square rounded-[10px] flex items-center justify-center text-[18px] relative",
                                                globalIdx === currQuestion ? 'bg-[#FF9600] text-white' : 'bg-[#C5DCFF] text-[#3B84F2]',
                                                'hover:opacity-90'
                                            )} onClick={() => setCurrQuestion(idx)}>
                                            <label className={clsx(
                                                "cursor-pointer font-bold", righteous.className
                                            )}>
                                                {globalIdx + 1}
                                            </label>
                                            <span className={clsx(
                                                "absolute h-[10px] aspect-square rounded-full bg-[rgba(255,255,255,0.5)]",
                                                'top-0 right-0 mt-[3px] mr-[3px]'
                                            )}></span>
                                        </div>
                                    )
                                }
                                )}
                        </div>
                        {/** Control */}
                        <div className="flex flex-row gap-[10px] mt-[40px] w-full">
                            {/** Prev button */}
                            <div className={clsx(
                                "flex flex-row gap-[15px] items-center justify-center text-[#C03603] font-bold",
                                'cursor-pointer hover:opacity-90 group',
                                'h-[50px] w-1/2 border-2 border-[#C03603] rounded-[15px]'
                            )} onClick={() => {
                                if (currSection > 0) setCurrSection(prev => prev - 1)
                            }}>
                                <FontAwesomeIcon className="group-hover:scale-150 transition-all duration-200"
                                    icon={faArrowLeftLong} />
                                <label className="cursor-pointer">Trước</label>
                            </div>
                            {/** Next button */}
                            <div className={clsx(
                                "flex flex-row gap-[15px] items-center justify-center text-[#C03603] font-bold",
                                'cursor-pointer hover:opacity-90 group',
                                'h-[50px] w-1/2 border-2 border-[#C03603] rounded-[15px]'
                            )} onClick={() => {
                                console.log('next')
                                if (currSection < 3) setCurrSection(prev => prev + 1)
                            }}>
                                <label className="cursor-pointer">Sau</label>
                                <FontAwesomeIcon className="group-hover:scale-150 transition-all duration-200"
                                    icon={faArrowRightLong} />
                            </div>
                        </div>
                    </div>
                </div>
                {/** Number of done + Submit */}
                <div className={clsx(
                    "w-full flex-1 bg-white rounded-br-[20px] rounded-tr-[20px]",
                    'shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col gap-[30px] px-[40px] py-[20px]'
                )}>
                    <div className="flex flex-row w-full items-center justify-between font-bold text-[22px]">
                        <label>ĐÃ LÀM:</label>
                        <label className="text-[#1DA492]">50/100</label>
                    </div>
                    <div className={clsx(
                        "bg-[#1DA492] h-[60px] w-full rounded-[20px] overflow-hidden",
                        'cursor-pointer hover:opacity-90'
                    )}>
                        <div className={clsx(
                            'h-full w-full flex items-center justify-center text-white text-[18px]',
                            'rounded-tl-[50px] rounded-br-[50px] bg-[#23BEAA] font-bold relative'
                        )}>
                            NỘP BÀI
                            <span className="absolute h-[15px] aspect-square rounded-full top-0 right-0 mt-[8px] mr-[8px] bg-[rgba(255,255,255,0.3)]"></span>
                        </div>
                    </div>
                </div>
            </div>
            {/** Main area */}
            <div className="h-full flex flex-1 flex-col gap-[15px] pr-[30px]">
                <div className="bg-white rounded-[20px] h-[91%] shadow-[0_0_15px_rgba(0,0,0,0.1)] p-[20px] flex flex-col gap-[20px]">
                    <div className="h-[40px] w-fit px-[30px] bg-[#23BEAA] text-white font-bold flex items-center justify-center text-[18px] rounded-full">
                        {`Câu ${currQuestion + 1}`}
                    </div>
                    <p className="w-full h-fit text-wrap ml-[20px] text-[18px] font-medium">{questions[currQuestion]}</p>
                </div>
                <div className="flex-1 flex flex-row gap-[20px]">
                    <div className="h-[50px] w-[170px] bg-[#8A2BE2] rounded-full ml-auto mr-[10px] flex flex-row gap-[15px] relative text-white text-[18px] font-medium items-center justify-center cursor-pointer hover:opacity-90"
                        onClick={() => {
                            if (currQuestion > 0) {
                                const target = currQuestion - 1
                                setCurrQuestion(target)
                                if (target < 25*currSection) setCurrSection(prev => prev - 1)
                            }
                        }}>
                        <FontAwesomeIcon icon={faArrowLeftLong} />
                        <label className="cursor-pointer">Câu trước</label>
                        <span className="h-[15px] absolute aspect-square bg-[rgba(255,255,255,0.3)] rounded-full top-0 right-0 mt-[8px] mr-[10px]"></span>
                    </div>
                    <div className="h-[50px] w-[170px] bg-[#8A2BE2] rounded-full mr-0 flex flex-row gap-[15px] relative text-white text-[18px] font-medium items-center justify-center cursor-pointer hover:opacity-90"
                        onClick={() => {
                            if (currQuestion < 99) {
                                const target = currQuestion + 1
                                setCurrQuestion(target)
                                if (target > 25*(currSection + 1) - 1) setCurrSection(prev => prev + 1)
                            }
                        }}>
                        <label className="cursor-pointer">Câu sau</label>
                        <FontAwesomeIcon icon={faArrowRightLong} />
                        <span className="h-[15px] absolute aspect-square bg-[rgba(255,255,255,0.3)] rounded-full top-0 right-0 mt-[8px] mr-[10px]"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}