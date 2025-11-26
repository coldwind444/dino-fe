'use client'

import { faArrowLeftLong, faArrowRightLong, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { Righteous } from "next/font/google"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import PopupModal, { MODAL_TYPE_KEY, MODAL_TYPES } from "@/components/PopupModal/PopupModal"

interface ExamClientProps {
    questions: string[]
}

const choices = ['8 kệ và 5 quyển sách', '8 kệ và 10 quyển sách', '9 kệ và 5 quyển sách', '10 kệ và 10 quyển sách', '6 kệ và 5 quyển sách']

const righteous = Righteous({ weight: '400' })

export default function ExamClient({ questions }: ExamClientProps) {
    const router = useRouter()

    const [currSection, setCurrSection] = useState(0)
    const [currQuestion, setCurrQuestion] = useState(0)
    const [currChoice, setCurrChoice] = useState(0)
    const [modalClose, setModalClose] = useState(true)
    const [modalType, setModalType] = useState<MODAL_TYPE_KEY>('SEND')

    const handleSubmit = () => {
        setModalClose(false)
    }

    const closeModal = () => {
        setModalClose(true)
    }

    const confirmModal = () => {

    }

    return (
        <div className="h-screen w-screen flex relative">
            <div className="h-screen w-screen bg-[#F3F4F6] flex flex-row gap-[15px] pt-10 pb-5 pr-10">
                {/** Side area */}
                <div className="w-1/5 h-full flex flex-col gap-1 relative">
                    {/** Exit button */}
                    <div className={clsx(
                        "h-[55px] w-[160px] bg-[#DE4B54] translate-x-16 -translate-y-3",
                        'rounded-[20px] overflow-hidden cursor-pointer absolute top-0',
                        'hover:brightness-110 transition-all duration-200'
                    )} onClick={() => router.push('/student/arena')}>
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
                    {/** Question panel */}
                    <div className="min-h-3/4 max-h-3/4 w-full bg-white rounded-br-[20px] rounded-tr-[20px] border-[#E5E7EB] border overflow-y-auto">
                        <div className="flex flex-col justify-center px-8 mt-14 gap-7 max-h-full">
                            {/** Title */}
                            <label className="text-xl font-bold text-[#F9740B] leading-7 text-center">
                                ĐỀ THI ĐẤU TRƯỜNG <br />
                                TUẦN 11
                            </label>
                            {/** Questions */}
                            <div className="w-full max-h-[250px] overflow-y-auto flex flex-row gap-x-1 gap-y-1 flex-wrap justify-center">
                                {questions.filter((_, idx) => idx >= currSection * 25 && idx < (currSection + 1) * 25)
                                    .map((val, idx) => {
                                        const globalIdx = currSection * 25 + idx;
                                        return (
                                            <div key={globalIdx}
                                                className={clsx(
                                                    "h-10 cursor-pointer aspect-square rounded-[10px] flex items-center justify-center text-[18px] relative",
                                                    globalIdx === currQuestion ? 'bg-[#FF9600] text-white' : 'bg-[#C5DCFF] text-[#3B84F2]',
                                                    'hover:opacity-90'
                                                )} onClick={() => setCurrQuestion(globalIdx)}>
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
                            <div className="flex flex-row gap-[10px] w-full">
                                {/** Prev button */}
                                <div className={clsx(
                                    "flex flex-row gap-3 items-center justify-center text-[#C03603] font-medium",
                                    'cursor-pointer hover:opacity-90 group',
                                    'h-11 w-1/2 border-2 border-[#C03603] rounded-[15px]'
                                )} onClick={() => {
                                    if (currSection > 0) setCurrSection(prev => prev - 1)
                                }}>
                                    <FontAwesomeIcon className="group-hover:scale-125 transition-all duration-200"
                                        icon={faArrowLeftLong} />
                                    <label className="cursor-pointer">Trước</label>
                                </div>
                                {/** Next button */}
                                <div className={clsx(
                                    "flex flex-row gap-3 items-center justify-center text-[#C03603] font-medium",
                                    'cursor-pointer hover:opacity-90 group',
                                    'h-11 w-1/2 border-2 border-[#C03603] rounded-[15px]'
                                )} onClick={() => {
                                    console.log('next')
                                    if (currSection < 3) setCurrSection(prev => prev + 1)
                                }}>
                                    <label className="cursor-pointer">Sau</label>
                                    <FontAwesomeIcon className="group-hover:scale-125 transition-all duration-200"
                                        icon={faArrowRightLong} />
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
                    {/* Time left */}
                    <div className="flex flex-col h-30 w-full bg-[#FFE3F2] border-l-0 border-t-2 border-b-2 border-r-2 border-[#FF1493]
                                    rounded-tr-2xl rounded-br-2xl items-center">
                        <div className="h-fit w-fit bg-[#3E1B57] text-white rounded-bl-xl rounded-br-xl px-5 py-1.5 font-medium">
                            Thời gian còn lại:
                        </div>
                        <span className="text-3xl text-[#FF1493] font-bold mt-4">6d 12h 34m 26s</span>
                    </div>
                    <div className="flex flex-row flex-1 w-full bg-[#F0E0FF] border-l-0 border-t-2 border-b-2 border-r-2 border-[#8A2BE2]
                                    rounded-tr-2xl rounded-br-2xl text-[#8A2BE2] items-center justify-around font-medium">
                        <span className="text-xl">Đã làm:</span>
                        <span className="text-2xl font-bold">50/100</span>
                    </div>
                </div>
                {/** Main area */}
                <div className="h-full flex flex-1 flex-col gap-3 justify-around">
                    {/** Exercise card */}
                    <div className="bg-white max-h-full w-full rounded-[20px] border border-[#E5E7EB] pt-10 flex flex-col gap-10 relative">
                        {/** Question number */}
                        <div className="h-[40px] w-fit px-[30px] bg-[#23BEAA] text-white font-semibold
                                        flex items-center justify-center text-lg rounded-[10px]
                                        absolute -top-4 shadow-md ml-10">
                            {`Câu ${currQuestion + 1}`}
                        </div>
                        {/** Question content */}
                        <div className="max-h-[300px] h-fit w-full overflow-y-auto mt-3 pr-7 gap-10 flex flex-col">
                            <p className="text-wrap ml-16 text-justify text-[17px] font-medium">{questions[currQuestion]}</p>
                            {/** Image (optional) */}
                            <Image src='https://res.cloudinary.com/ddlpbdgv5/image/upload/v1764118826/Group_329_jdzxzf.png'
                                alt="" height={200} width={400} className="mr-auto ml-auto" />
                        </div>
                        {/** Choices */}
                        <div className="h-fit max-h-[250px] p-10 bg-[#F0FFFF] rounded-br-2xl
                                        rounded-bl-2xl border border-[#76D7EA] overflow-y-auto
                                        flex flex-row flex-wrap gap-5 justify-center">
                            {choices.map((val, idx) => (
                                <div key={idx} className={clsx(
                                    "h-fit w-fit py-4 px-10 rounded-4xl border-2 border-[#4E5660] text-balance font-medium cursor-pointer",
                                    currChoice === idx ? 'bg-[#D8FFFA] border-[#23BEAA] text-[#23BEAA]' : 'bg-white border-[#4E5660] text-[#1B2657]'
                                )} onClick={() => setCurrChoice(idx)}>
                                    <p className="max-w-[300px] text-justify text-wrap">{val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/** Navigation */}
                    <div className="flex flex-row gap-1 mt-auto mb-0">
                        {/** Submit button */}
                        <div className={clsx(
                            "bg-[#1DA492] h-[50px] w-[250px] rounded-[20px] overflow-hidden",
                            'cursor-pointer hover:brightness-110 transition-all duration-200'
                        )} onClick={handleSubmit}>
                            <div className={clsx(
                                'h-full w-full flex items-center justify-center text-white text-[18px]',
                                'rounded-tl-[50px] rounded-br-[50px] bg-[#23BEAA] font-bold relative'
                            )}>
                                NỘP BÀI
                                <span className="absolute h-[15px] aspect-square rounded-full top-0 right-0 mt-[8px] mr-[8px] bg-[rgba(255,255,255,0.3)]"></span>
                            </div>
                        </div>
                        {/** Prev */}
                        <div className="h-12 w-fit bg-[#FF1493] rounded-2xl ml-auto mr-[10px] flex flex-row gap-[15px] relative
                                        text-white text-[18px] font-medium items-center justify-center cursor-pointer
                                        hover:brightness-110 transition-all duration-200 py-2 px-7"
                            onClick={() => {
                                if (currQuestion > 0) {
                                    const target = currQuestion - 1
                                    setCurrQuestion(target)
                                    if (target < 25 * currSection) setCurrSection(prev => prev - 1)
                                }
                            }}>
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                            <label className="cursor-pointer">Câu trước</label>
                            <span className="h-[15px] absolute aspect-square bg-[rgba(255,255,255,0.3)] rounded-full top-0 right-0 mt-[8px] mr-[10px]"></span>
                        </div>
                        {/** Next */}
                        <div className="h-12 w-fit bg-[#FF1493] rounded-2xl mr-0 flex flex-row gap-[15px] relative
                                    text-white text-[18px] font-medium items-center justify-center cursor-pointer
                                    hover:brightness-110 transition-all duration-200 py-2 px-7"
                            onClick={() => {
                                if (currQuestion < 99) {
                                    const target = currQuestion + 1
                                    setCurrQuestion(target)
                                    if (target > 25 * (currSection + 1) - 1) setCurrSection(prev => prev + 1)
                                }
                            }}>
                            <label className="cursor-pointer">Câu sau</label>
                            <FontAwesomeIcon icon={faArrowRightLong} />
                            <span className="h-[15px] absolute aspect-square bg-[rgba(255,255,255,0.3)] rounded-full top-0 right-0 mt-[8px] mr-[10px]"></span>
                        </div>
                    </div>
                </div>
            </div>
            {!modalClose && <PopupModal type={modalType} action={confirmModal} close={closeModal}/>}
        </div>
    )
}