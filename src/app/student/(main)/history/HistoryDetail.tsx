'use client'

import { faCalendar as faCalendarSolid, faClipboardQuestion, faClock as faClockSolid, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnswerDetailData } from "@/components/AnswerDetail/AnswerDetail"
import AnswerDetail from "@/components/AnswerDetail/AnswerDetail"
import Link from "next/link"

interface HistoryDetailProps {
    onBack: () => void
    answerDetails?: AnswerDetailData[]
}

const mockAnswerDetails: AnswerDetailData[] = [
    {
        type: "multiple-choice",
        questionNumber: 1,
        status: "correct",
        question: "What is the capital of France?",
        studentAnswer: "Paris",
        correctAnswer: "Paris",
    },
    {
        type: "true-false",
        questionNumber: 2,
        status: "wrong",
        question: "The Earth is flat.",
        studentAnswer: "Đúng",
        correctAnswer: "Sai",
    },
    {
        type: "matching",
        questionNumber: 3,
        status: "partial",
        question: "Match each country with its capital.",
        studentAnswer: [
            { left: "Japan", right: "Tokyo" },
            { left: "Italy", right: "Milan" },
            { left: "Germany", right: "Berlin" },
        ],
        correctAnswer: [
            { left: "Japan", right: "Tokyo" },
            { left: "Italy", right: "Rome" },
            { left: "Germany", right: "Berlin" },
        ],
    },
    {
        type: "fill-in-blank",
        questionNumber: 4,
        status: "partial",
        question: "Fill in the missing words: The ___ brown ___ jumps over the ___ dog.",
        studentAnswer: ["quick", "black", "lazy"],
        correctAnswer: ["quick", "brown", "lazy"],
    },
]

export default function HistoryDetail({ onBack, answerDetails = mockAnswerDetails }: HistoryDetailProps) {
    return (
        <div className="flex flex-col gap-5 p-5 h-full w-full">
            {/** Links */}
            <span className="flex h-fit flex-row gap-2 font-medium ml-3">
                <Link onClick={onBack} className="text-[rgba(0,0,0,0.5)] cursor-pointer hover:underline" href=''>Lịch sử</Link>
                <label className="text-[rgba(0,0,0,0.5)]">{'>'}</label>
                <Link className="text-teal-500 cursor-pointer hover:underline" href=''>Chi tiết bài làm - Đấu trường tuần 11</Link>
            </span>
            {/** Main */}
            <div className="flex-1 w-full flex flex-row gap-5">
                {/** Statistic */}
                <div className="flex flex-col gap-3 h-full w-1/3">
                    {/** Name */}
                    <div className="h-30 w-full bg-gradient-to-r from-0% to-100% 
                            from-[#23BEAA] to-[#1DA492] rounded-xl shadow-lg px-10
                            flex flex-col gap-3 text-white justify-center">
                        <h1 className="font-bold text-2xl">Đấu trường tuần 11</h1>
                        <div className="flex flex-row gap-2 items-center">
                            <FontAwesomeIcon className="text-xl" icon={faCalendarSolid} />
                            <label>Thứ Năm, 17:00 20-11-2025</label>
                        </div>
                    </div>
                    {/** Data */}
                    <div className="flex flex-row gap-x-2 gap-y-3 flex-wrap w-full">
                        <div className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#FE6EBC] to-100% to-[#FC098D] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg">
                            <label className="font-medium">Tổng số câu hỏi</label>
                            <label className="ml-auto mr-auto mt-4 text-5xl font-medium">100</label>
                            <FontAwesomeIcon icon={faClipboardQuestion} className="absolute top-0 right-0 text-2xl mt-3 mr-3" />
                        </div>
                        <div className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#5A9CFF] to-100% to-[#0066FF] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg">
                            <label className="font-medium">Thời gian làm bài</label>
                            <label className="ml-auto mr-auto mt-5 text-3xl font-medium">2d 1h 24m 26s</label>
                            <FontAwesomeIcon icon={faClockSolid} className="absolute top-0 right-0 text-2xl mt-3 mr-3" />
                        </div>
                        <div className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#3BC16A] to-100% to-[#01A139] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg">
                            <label className="font-medium">Số câu đúng</label>
                            <label className="ml-auto mr-auto mt-4 text-5xl font-medium">90</label>
                            <FontAwesomeIcon icon={faCheck} className="absolute top-0 right-0 text-2xl mt-3 mr-3" />
                        </div>
                        <div className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#FF5661] to-100% to-[#D02833] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg">
                            <label className="font-medium">Số câu sai</label>
                            <label className="ml-auto mr-auto mt-4 text-5xl font-medium">10</label>
                            <FontAwesomeIcon icon={faXmark} className="absolute top-0 right-0 text-2xl mt-3 mr-3" />
                        </div>
                    </div>
                </div>
                {/** Details */}
                <div className="flex flex-col gap-3 flex-1 h-full">
                    <label className="font-medium text-[17px] text-[rgba(0,0,0,0.5)]">Chi tiết bài làm</label>
                    <div className="flex flex-col max-h-[550px] w-full pr-10 overflow-y-auto">
                        {answerDetails.map((item, index) => (
                            <AnswerDetail key={index} data={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}