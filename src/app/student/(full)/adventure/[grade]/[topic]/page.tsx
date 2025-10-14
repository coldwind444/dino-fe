import { FC } from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Volume from "@/components/Volume/Volume";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface MilestonesPageProps {
    params: {
        grade: string;
        topic: string;
    };
}

const roboto = Roboto()

const Milestones: FC<MilestonesPageProps> = async ({ params }) => {
    const res = await fetch('https://cdn.jsdelivr.net/gh/coldwind444/sample_data/milestone_sample_data.json', { cache: 'no-store' });
    const data = await res.json();
    const world = data[params.grade]

    return (
        <div className="h-screen w-screen">
            {/** Back ground image */}
            <Image className="h-full w-full object-fill" fill src={world.lands[0].illustration} alt="" />
            {/** Main */}
            <div className="absolute h-full w-full flex flex-col gap-[10px]">
                { /** Header */}
                <div className="flex flex-row gap-[10px] p-[15px] items-center">
                    {/** Mode container */}
                    <div className="relative px-[25px] py-[6px] bg-[#1DA492] rounded-[15px] text-white font-bold">
                        <label className={clsx(roboto.className,'text-[15px]')}>Đang ở chế độ phiêu lưu</label>
                        <div className="absolute right-0 -translate-y-[28px] mr-[6px]">
                            <div className="h-[12px] aspect-square rounded-full bg-[rgba(255,255,255,0.3)]" />
                            <div className={clsx(
                                "h-[5px] aspect-square rounded-full bg-[rgba(255,255,255,0.3)]",
                                '-translate-x-[5px] -translate-y-[2px]'
                            )} />
                        </div>
                    </div>
                    {/** Volume */}
                    <Volume/>
                </div>
                {/** Body */}
                <div className="flex flex-1 flex-row gap-[20px]">
                    {/** Topic panel */}
                    <div className={clsx(
                        "bg-[rgba(0,0,0,0.7)] rounded-tr-[20px] rounded-br-[20px] h-[98%] w-[400px]",
                        'flex flex-col p-[10px]'
                    )}>
                        {/** Back button */}
                        <div className={clsx(
                            'h-[60px] w-[220px] rounded-[20px] bg-[#1DA492] cursor-pointer',
                            'hover:opacity-90'
                        )}>
                            <div className={clsx(
                                'h-[60px] w-[220px] bg-[#1DA492] relative flex flex-row text-white font-medium text-[20px]',
                                'bg-[#23BEAA] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px]',
                                'items-center justify-center gap-[15px]'
                            )}>
                                <FontAwesomeIcon icon={faArrowLeft}/>
                                <label className="select-none cursor-pointer">Quay lại</label>
                                <span className={clsx(
                                    "h-[15px] aspect-square rounded-full absolute bg-[rgba(255,255,255,0.3)]",
                                    'right-0 top-0 mt-[5px] mr-[10px]'
                                )}/>
                                <span className={clsx(
                                    "h-[6px] aspect-square rounded-full absolute bg-[rgba(255,255,255,0.3)]",
                                    'right-0 top-0 mt-[15px] mr-[25px]'
                                )}/>
                            </div>
                        </div>
                        {/** Topic brand */}
                        <div className="flex flex-col items-center justify-center mt-7 gap-[20px]">
                            <Image src={world.topics[2].brand} alt="" height={120} width={120}/>
                            <div className={clsx(
                                "h-fit w-fit px-[30px] py-[10px] bg-[#1DA492] text-white font-medium rounded-full",
                                roboto.className
                            )}>
                                {`CHỦ ĐỀ 3`}
                            </div>
                            <label className={clsx(roboto.className, 'text-white text-[22px] font-medium text-center text-wrap max-w-full')}>
                                {'Hình học cơ bản'}
                            </label>
                        </div>
                        {/** Detail */}
                        <div className="flex flex-col items-center text-white font-medium text-[18px] mt-[50px]">
                            <label>{`Mức độ: `}</label>
                            <label>{`Khu vực: `}</label>
                        </div>
                        <div></div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default Milestones;