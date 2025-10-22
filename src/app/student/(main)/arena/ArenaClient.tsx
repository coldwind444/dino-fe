'use client'

import Image from 'next/image';

import arena from '../../../../../public/assets/arena/arena.png';
import helmet from '../../../../../public/assets/arena/helmet.png';
import rank from '../../../../../public/scalable_assets/shared/ranks/Badge_07.svg'
import avt from '../../../../../public/avt_01.svg'

import { Baloo_2, Roboto } from 'next/font/google';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { RankRecord } from './page';
import { useState } from 'react';

const roboto = Roboto()
const baloo = Baloo_2()

interface ArenaClientProps {
    records: RankRecord[]
}

export default function ArenaClient({ records }: ArenaClientProps) {
    const [pageIdx, setPageIdx] = useState(0)

    return (
        <div className='w-full h-full flex flex-row gap-[15px] p-[15px]'>
            {/** Rule panel */}
            <div className="h-full w-fit flex flex-col relative">
                <div className='w-[324px] flex-1 bg-[#965C5A] rounded-tl-[20px] rounded-tr-[20px]'></div>
                <Image src={arena} alt='' className='rounded-br-[20px] rounded-bl-[20px]' width={324} />
                <div className='absolute top-0 flex flex-col items-center text-white w-full'>
                    <h1 className={clsx(roboto.className, 'text-[27px] font-bold mt-[20px]')}>ĐẤU TRƯỜNG</h1>
                    <p className='text-center text-wrap mt-[10px] leading-tight'>
                        Dùng kinh nghiệm và kiến thức <br /> tích lũy được để cạnh tranh với <br /> những thí sinh khác !
                    </p>
                    <div className={clsx(
                        'h-[55px] w-[200px] rounded-full bg-[#1DA492] flex items-center gap-[15px]',
                        'text-white font-medium cursor-pointer mt-[30px]',
                        'hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] transition-shadow duration-300 ease-in-out',
                    )}>
                        <label className={clsx(
                            roboto.className,
                            'cursor-pointer text-[20px] ml-[40px]'
                        )}>Xem thể lệ</label>
                        <FontAwesomeIcon className='text-[35px]' icon={faCircleQuestion} />
                    </div>
                </div>
            </div>
            {/** Arena content */}
            <div className='flex flex-1 flex-col gap-[15px]'>
                {/** Top section */}
                <div className='flex w-full flex-row gap-[15px]'>
                    {/** Join border */}
                    <div className='h-[220px] w-1/2 bg-[#F9740B] rounded-[20px]'>
                        <div className={clsx(
                            'h-[214px] w-[99%] bg-[#FFF5ED] rounded-[20px] border-2',
                            'border-[#F9740B] flex flex-row items-center justify-center',
                            'gap-[60px] p-[15px]'
                        )}>
                            <Image src={helmet} alt='' className='h-[180px] w-[180px]' />
                            <div className='flex flex-col gap-[40px]'>
                                <h2 className={clsx('text-[#F9740B] text-[27px] font-bold leading-tight', roboto.className)}>
                                    ĐẤU TRƯỜNG TUẦN 11 <br /> ĐANG MỞ CỬA
                                </h2>
                                <div className={clsx(
                                    'h-[70px] w-full rounded-[20px] bg-[#E1690A] overflow-hidden cursor-pointer',
                                    'hover:opacity-90 group'
                                )}>
                                    <div className={clsx(
                                        'flex items-center justify-center',
                                        'h-full w-full relative bg-[#F9740B] text-white text-[22px] font-medium',
                                        'rounded-tl-[50px] rounded-br-[60px] relative'
                                    )}>
                                        Tham gia ngay
                                        <span className='absolute top-0 right-0 mt-[7px] mr-[10px] h-[25px] aspect-square bg-[rgba(255,255,255,0.5)] rounded-full' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** Count down border */}
                    <div className='h-[220px] w-1/2 bg-[#1DA492] rounded-[20px]'>
                        <div className={clsx(
                            'h-[214px] w-[99%] bg-[#F3FFFD] rounded-[20px] border-2',
                            'border-[#23BEAA] flex flex-col',
                            'overflow-hidden'
                        )}>
                            <div className='h-[70px] w-full bg-[#23BEAA] flex items-center justify-center text-white text-[22px] font-bold'>
                                Đấu trường kết thúc trong:
                            </div>
                            <div className='flex flex-row gap-[65px] mt-[20px] items-center justify-center'>
                                <div className='flex flex-col items-center'>
                                    <label className='text-[40px] font-bold text-[#1DA492]'>05</label>
                                    <label className='text-[25px] font-bold text-[#1DA492]'>ngày</label>
                                </div>
                                <div className='h-[100px] w-[2px] bg-[#d9d9d9]'></div>
                                <div className='flex flex-col items-center'>
                                    <label className='text-[40px] font-bold text-[#1DA492]'>23</label>
                                    <label className='text-[25px] font-bold text-[#1DA492]'>giờ</label>
                                </div>
                                <div className='h-[100px] w-[2px] bg-[#d9d9d9]'></div>
                                <div className='flex flex-col items-center'>
                                    <label className='text-[40px] font-bold text-[#1DA492]'>15</label>
                                    <label className='text-[25px] font-bold text-[#1DA492]'>phút</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/** Body section */}
                <div className='flex flex-1 flex-row gap-[15px]'>
                    {/** Ranking border */}
                    <div className={clsx(
                        'w-[350px] bg-[#8A2BE2] rounded-[20px]'
                    )}>
                        <div className={clsx(
                            'h-[99%] w-[345px] bg-white border-3 border-[#8A2BE2] rounded-[20px]',
                            'flex flex-col items-center p-[20px]'
                        )}>
                            <h1 className='text-[23px] font-bold text-[rgba(0,0,0,0.8)]'>Xếp hạng của bạn</h1>
                            <Image src={rank} alt='' className='mt-[15px] h-[170px] w-[170px]' /> {/** Rank image */}
                            {/** Ribbon */}
                            <div className="relative flex justify-center items-center w-full">
                                <svg
                                    viewBox="-25 -5 50 10"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full h-auto max-w-[600px] fill-[#8A2BE2]"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <path
                                        d="M -11 -2 
                                        L 11 -2 
                                        C 11 -1 10 -1 9 0 
                                        C 9.6667 0.6667 11 1 11 2 
                                        L -13 2 
                                        C -13 1 -11.6667 0.6667 -11 0 
                                        C -11.6667 -0.6667 -13 -1 -13 -2 
                                        L -11 -2"
                                        transform="translate(2,0) scale(2,2)"
                                    />
                                </svg>

                                <span className={clsx(
                                    baloo.className,
                                    "absolute text-white text-[clamp(1rem,2vw,1.5rem)] font-bold"
                                )}>
                                    Nhà thông thái
                                </span>
                            </div>
                            {/** Rank info */}
                            <div className='flex flex-row mt-auto mb-0 justify-around w-full'>
                                <div className='flex flex-col font-medium text-[17px] gap-[10px]'>
                                    <label className={clsx(roboto.className)}>Battle Points:</label>
                                    <label className={clsx(roboto.className)}>Vị trí hiện tại:</label>
                                </div>
                                <div className='flex flex-col font-bold text-[#8A2BE2] text-[17px] gap-[10px]'>
                                    <label className={clsx(roboto.className)}>32000 BP</label>
                                    <label className={clsx(roboto.className)}>50</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** Leaderboard */}
                    <div className='flex h-full flex-1 flex-col gap-[10px]'>
                        <h1 className='font-bold text-[18px] text-[rgba(0,0,0,0.8)]'>BẢNG XẾP HẠNG TUẦN 11</h1>
                        <div className='flex flex-col gap-[10px]'>
                            {records.filter((_, idx) => idx >= pageIdx * 4 && idx < (pageIdx + 1) * 4)
                                .map((record, idx) => (
                                    <div key={idx} className={clsx(
                                        'h-[80px] w-full rounded-[20px] border-2',
                                        'flex flex-row items-center',
                                        { 'border-[#F1A12E]': record.rank === 1 },
                                        { 'border-[#3B84F2]': record.rank === 2 },
                                        { 'border-[#FF1493]': record.rank === 3 },
                                        { 'border-[#23BEAA]': record.rank > 3 },
                                    )}>
                                        <div className={clsx(
                                            'h-full w-[70px] rounded-tl-[15px] rounded-bl-[15px]',
                                            'flex items-center justify-center text-white font-bold text-[22px]',
                                            { 'bg-[#F1A12E]': record.rank === 1 },
                                            { 'bg-[#3B84F2]': record.rank === 2 },
                                            { 'bg-[#FF1493]': record.rank === 3 },
                                            { 'bg-[#23BEAA]': record.rank > 3 },
                                        )}>
                                            {record.rank}
                                        </div>
                                        <div className={clsx(
                                            'flex flex-row gap-[35px] items-center justify-center px-[20px] text-[20px] font-bold',
                                            { 'text-[#F1A12E]': record.rank === 1 },
                                            { 'text-[#3B84F2]': record.rank === 2 },
                                            { 'text-[#FF1493]': record.rank === 3 },
                                            { 'text-[#23BEAA]': record.rank > 3 },
                                        )}>
                                            <div className='h-[50px] aspect-square overflow-hidden rounded-full'>
                                                <Image src={avt} alt='' height={50} width={50} />
                                            </div>
                                            <label className='min-w-[250px]'>{record.fullName}</label>
                                            <label className='min-w-[90px]'>{record.points}</label>
                                            <label className='min-w-[150px]'>{record.duration}</label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="flex flex-row ml-auto mr-auto gap-[50px] py-[5px]">
                            {/* Previous */}
                            <div
                                className="flex flex-row gap-[10px] items-center text-[20px] font-medium cursor-pointer group"
                                onClick={() => {
                                    if (pageIdx > 0) setPageIdx(prev => prev - 1);
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faCaretLeft}
                                    className="group-hover:scale-150 transition-all duration-150"
                                />
                                <label className="cursor-pointer">Trước</label>
                            </div>

                            {/* Next */}
                            <div
                                className="flex flex-row gap-[10px] items-center text-[20px] font-medium cursor-pointer group"
                                onClick={() => {
                                    if (pageIdx < 4) setPageIdx(prev => prev + 1);
                                }}
                            >
                                <label className="cursor-pointer">Sau</label>
                                <FontAwesomeIcon
                                    icon={faCaretRight}
                                    className="group-hover:scale-150 transition-all duration-150"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}