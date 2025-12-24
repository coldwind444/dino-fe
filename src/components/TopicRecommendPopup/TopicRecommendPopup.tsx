'use client'

import clsx from "clsx"
import { Baloo_2 } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import boy from '../../../public/assets/home/boy_riding_pencil.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons"

const baloo = Baloo_2()

export default function TopicRecommendPopup({ close }: { close: () => void }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-screen w-screen bg-[rgba(0,0,0,0.5)] flex items-center justify-center absolute top-0 left-0 z-50"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 140, damping: 15 }}
                    className="h-[70%] w-[60%] bg-white rounded-2xl flex flex-row gap-8 p-7 items-center relative shadow-2xl"
                >
                    {/** Illustration */}
                    <Image src={boy} height={550} width={550} alt="" className="absolute -translate-x-1/2" />
                    {/** Close button */}
                    <div className="absolute aspect-square h-20 bg-amber-500 rounded-full top-0 right-0 translate-x-1/3 -translate-y-1/4
                                    hover:brightness-110 cursor-pointer flex items-center justify-center
                                    text-white text-3xl shadow-inner"
                        onClick={close}>
                        <FontAwesomeIcon icon={faClose} />
                        <span className="absolute top-0 right-0 aspect-square h-3 w-6 rotate-45 mt-3 mr-2
                                        [clip-path:ellipse(50%_50%_at_50%_50%)] bg-[rgba(255,255,255,0.4)] rounded-full"></span>
                    </div>
                    {/** Main */}
                    <div className="flex flex-col w-3/4 h-full ml-auto mr-0 items-center gap-10">
                        {/** Title */}
                        <h1 className={clsx(baloo.className, 'text-4xl font-bold text-[#23BEAA]')}>GỢI Ý CHƯƠNG TRÌNH HỌC</h1>
                        {/** Image placeholder */}
                        <div className="h-40 aspect-square bg-blue-950 rounded-full"></div>
                        {/** Topic info */}
                        <div className={clsx("flex flex-col gap-2 items-center justify-center w-full", baloo.className)}>
                            <div className={clsx(
                                "rounded-full h-fit bg-amber-500 w-fit px-3 py-1.5 flex items-center justify-center text-white font-bold text-sm",
                            )}>
                                Chủ đề 1
                            </div>
                            <p className='text-2xl text-amber-500 font-bold max-h-20 max-w-[80%] text-center text-wrap'>
                                Các phép toán cơ bản
                            </p>
                        </div>
                        {/** Time */}
                        <div className={clsx("flex flex-col items-center justify-center w-full", baloo.className)}>
                            <p className='text-xl text-[#1DA492] font-bold max-h-20 max-w-[80%] text-center text-wrap'>
                                Học kỳ 1 - Lớp 1
                            </p>
                            <p className='text-3xl text-[#1DA492] font-bold max-h-20 max-w-[80%] text-center text-wrap'>
                                12-11-2025
                            </p>
                        </div>
                        {/** Learn button */}
                        <div className="flex flex-row gap-5 w-40 text-white text-xl font-bold h-16 rounded-full 
                                        bg-pink-500 absolute items-center justify-center -right-15
                                        translate-y-50 shadow-[0_0_10px_rgba(0,0,0,0.25)]
                                        cursor-pointer hover:brightness-110 transition-all duration-200
                                        hover:gap-7">
                            <span className={clsx("text-center leading-tight", baloo.className)}>HỌC <br /> NGAY</span>
                            <FontAwesomeIcon className="text-xl" icon={faArrowRight}/>
                            <span className="absolute [clip-path:ellipse(50%_50%_at_50%_50%)] h-4 w-6 bg-[rgba(255,255,255,0.4)]
                                            top-2 right-2 rotate-45"></span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
