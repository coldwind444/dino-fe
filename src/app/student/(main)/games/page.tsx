'use client'

import { faCrown, faPlay, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import single from '../../../../../public/assets/games/single.png'
import pvp from '../../../../../public/assets/games/pvp.png'

const MODES = {
    SINGLE: 0,
    PVP: 1
}

const games = [
    { name: 'Game Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', plan: 'free' },
    { name: 'Game Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', plan: 'premium' },
    { name: 'Game Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', plan: 'free' },
    { name: 'Game Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', plan: 'premium' },
    { name: 'Game Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', plan: 'free' },
    { name: 'Game Name', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', plan: 'premium' },
]

export default function Games() {
    const [mode, setMode] = useState(MODES.SINGLE)

    return (
        <div className="h-full w-full p-5 flex flex-col gap-5">
            {/** Tab bar */}
            <div className="h-20 w-full bg-gradient-to-r from-0% to-100% from-[#53DB97] to-[#0695B6] 
                            rounded-2xl flex flex-row px-10 items-center gap-40">
                {/** Tab buttons */}
                <div className="flex flex-row gap-10 h-full items-center ml-auto mr-0 relative">
                    <label className={clsx(
                        "text-xl font-medium cursor-pointer",
                        mode === MODES.SINGLE ? 'text-white' : 'text-[rgba(255,255,255,0.7)]')}
                        onClick={() => setMode(MODES.SINGLE)}>
                        Chơi đơn
                    </label>
                    <label className={clsx(
                        "text-xl font-medium cursor-pointer",
                        mode === MODES.PVP ? 'text-white' : 'text-[rgba(255,255,255,0.7)]')}
                        onClick={() => setMode(MODES.PVP)}>
                        Tương tác
                    </label>
                    <div className={clsx(
                        "h-1 w-10 bg-white absolute bottom-4 rounded-full transition-all duration-200",
                        mode === MODES.SINGLE ? 'translate-x-1/2' : 'translate-x-37'
                    )}></div>
                </div>
                {/** Search box */}
                <div className="h-12 w-100 border border-[rgba(255,255,255,0.7)] rounded-2xl px-5 items-center
                                flex flex-row gap-2 focus-within:border-white focus-within:shadow-[0_0_10px_rgba(255,255,255,0.5)]
                                transition-all duration-150">
                    <FontAwesomeIcon icon={faSearch} className="text-xl text-[rgba(255,255,255,0.5)]" />
                    <input className="h-full flex-1 outline-none border-none text-white text-[18px]"
                        type="text" placeholder="Tìm kiếm" />
                </div>
            </div>
            {/** Main */}
            <div className="flex flex-row gap-10 w-full">
                {/** Illustration */}
                <div className="w-1/3 h-full block relative">
                    <AnimatePresence mode="wait">
                        {mode === MODES.SINGLE ? (
                            <motion.div
                                key="single"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute -top-25 left-20"
                            >
                                <Image src={single} alt="" height={280} width={280} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="pvp"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute -top-35 left-20"
                            >
                                <Image src={pvp} alt="" height={340} width={340} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {mode === MODES.SINGLE ?
                        <label className="text-5xl text-[#006E69] font-bold z-10 absolute bottom-45 right-10">Chơi Đơn</label> :
                        <label className="text-5xl text-[#824738] font-bold z-10 absolute bottom-45 right-10">Tương Tác</label>
                    }
                    {mode === MODES.SINGLE ?
                        <label className="text-[28px] text-[#23BEAA] font-bold z-10 absolute bottom-13 right-0">
                            THỬ THÁCH BẢN THÂN <br /> CHINH PHỤC TOÁN HỌC !
                        </label> :
                        <label className="text-[28px] text-[#FF9600] font-bold z-10 absolute bottom-13 right-0">
                            HỢP LỰC HOẶC ĐỐI ĐẦU, <br /> BẠN CHỌN KIỂU NÀO ?
                        </label>
                    }
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 657 682"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <path
                            className="transition-colors duration-300"
                            d="M627 0C643.569 1.64286e-06 657 13.4315 657 30V429C657 456.614 634.614 479 607 479H195C167.386 479 145 501.386 145 529V591C145 618.614 167.386 641 195 641H646C652.075 641 657 645.925 657 652C657 668.569 643.569 682 627 682H30C13.4315 682 0 668.569 0 652V30C6.50742e-06 13.4315 13.4315 3.20117e-07 30 0H627Z"
                            fill="url(#paint0_linear_1733_758)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_1733_758"
                                x1="328.5"
                                y1="0"
                                x2="328.5"
                                y2="682"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop
                                    offset="0.466346"
                                    style={{ transition: "stop-color 0.3s ease" }}
                                    stopColor={mode === MODES.SINGLE ? "#C4EEDE" : "#FFD3A5"}
                                />
                                <stop
                                    offset="1"
                                    style={{ transition: "stop-color 0.3s ease" }}
                                    stopColor={mode === MODES.SINGLE ? "#C8DBF8" : "#FFFAC5"}
                                />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                {/** Game list */}
                <div className="flex flex-1 max-h-[520px] flex-wrap flex-row gap-x-4 gap-y-6 overflow-y-auto pr-10">
                    {games.map((val,idx) => (
                        // Game Card
                        <div key={idx} className={clsx(
                            "h-80 w-70 border-2 rounded-2xl", val.plan === 'free' ? 'border-[#23BEAA]' : 'border-[#F1A12E]',
                            'flex flex-col gap-2 p-2'
                        )}>
                            {/** Thumbnail */}
                            <div className="h-1/2 w-full bg-blue-200 rounded-xl"></div>
                            {/** Label */}
                            <div className="flex flex-col ml-2">
                                <label className="text-[18px] font-medium">{val.name}</label>
                                <p className="text-[15px] font-medium max-w-[90%] text-wrap text-justify text-gray-400">{val.description}</p>
                            </div>
                            {/** Play button */}
                            <div className={clsx(
                                'h-12 w-full rounded-xl', val.plan === 'free' ? 'bg-[#23BEAA]' : 'bg-[#F1A12E]',
                                'flex flex-row text-white font-medium items-center mt-auto mb-0',
                                'hover:brightness-110 cursor-pointer transition-all duration-150'
                            )}>
                                <label className="mr-auto ml-20">{val.plan === 'free' ? 'Chơi ngay' : 'Mua Premium'}</label>
                                <FontAwesomeIcon className="ml-auto mr-5 text-xl" icon={val.plan === 'free' ? faPlay : faCrown}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}