'use client'

import Filter from "@/components/Filter/Filter";
import Image from "next/image";

export default function Dashboard() {
    const handleFilter = () => {

    }

    return (
        <div className="h-full w-full p-5 flex flex-row gap-5">
            {/** Aside filter */}
            <Filter hasStudentSelectBox filter={handleFilter} />
            {/** Main */}
            <div className="flex flex-col gap-12 flex-1 h-full">
                {/** Learning Statistic */}
                <div className="flex flex-col gap-4">
                    <label className="text-xl font-medium">Thống kê học tập</label>
                    {/** Cards */}
                    <div className="flex flex-row gap-4 w-full">
                        {/** Topics Number */}
                        <div className="h-40 w-1/3 rounded-2xl bg-[#3B84F2]">
                            <div className="flex flex-col bg-white border-2 border-[#3B84F2] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                <label className="cursor-pointer text-[16px] font-bold text-[#3B84F2] w-full text-center">
                                    Số chủ đề đã học
                                </label>
                                <span className="text-5xl font-bold mt-2 text-[#3B84F2] mr-auto ml-auto select-none">12</span>
                            </div>
                        </div>
                        {/** Accuracy */}
                        <div className="h-40 w-1/3 rounded-2xl bg-[#3BB766]">
                            <div className="flex flex-col bg-white border-2 border-[#3BB766] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                <label className="cursor-pointer text-[16px] font-bold text-[#3BB766] w-full text-center">
                                    Tỉ lệ làm đúng
                                </label>
                                <span className="text-5xl font-bold mt-2 text-[#3BB766] mr-auto ml-auto select-none">85%</span>
                            </div>
                        </div>
                        {/** Active Hours */}
                        <div className="h-40 w-1/3 rounded-2xl bg-[#FF1493]">
                            <div className="flex flex-col bg-white border-2 border-[#FF1493] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                <label className="cursor-pointer text-[16px] font-bold text-[#FF1493] w-full text-center">
                                    Số giờ hoạt động
                                </label>
                                <span className="text-5xl font-bold mt-2 text-[#FF1493] mr-auto ml-auto select-none">120</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/** Arena Statistic */}
                <div className="flex flex-col gap-4">
                    <label className="text-xl font-medium">Thống kê đấu trường</label>
                    {/** Cards */}
                    <div className="flex flex-1 flex-row gap-5 w-full">
                        {/** Rank */}
                        <div className="flex flex-col aspect-square h-80 border-2 border-[#8A2BE2] rounded-2xl w-[35%]
                                        items-center justify-center gap-3 px-5 shadow-lg shadow-violet-500">
                            <label className="text-xl font-bold text-[rgba(0,0,0,0.5)]">
                                Bậc xếp hạng hiện tại
                            </label>
                            <Image src="https://res.cloudinary.com/dirr7ovdh/image/upload/v1761140898/Badge_07_t0e515.svg"
                                alt="rank" height={200} width={200} className="flex aspect-square h-[60%] w-auto" />
                            <span className="h-12 w-full px-3 flex items-center justify-center bg-[#8A2BE2] rounded-xl text-white font-bold shadow-lg">
                                Kiện Tướng Đại Số
                            </span>
                        </div>
                        {/** Arena Data */}
                        <div className="flex flex-1 flex-row flex-wrap gap-x-4 gap-y-2">
                            {/** Batte Points */}
                            <div className="h-38 w-[48%] rounded-2xl bg-[#C03603]">
                                <div className="flex flex-col bg-white border-2 border-[#C03603] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                    <label className="cursor-pointer text-[16px] font-bold text-[#C03603] w-full text-center">
                                        Batte Points
                                    </label>
                                    <span className="text-5xl font-bold mt-2 text-[#C03603] mr-auto ml-auto select-none">9.5M</span>
                                </div>
                            </div>

                            <div className="h-38 w-[48%] rounded-2xl bg-[#F9740B]">
                                <div className="flex flex-col bg-white border-2 border-[#F9740B] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                    <label className="cursor-pointer text-[16px] font-bold text-[#F9740B] w-full text-center">
                                        Xếp hạng tuần
                                    </label>
                                    <span className="text-5xl font-bold mt-2 text-[#F9740B] mr-auto ml-auto select-none">12</span>
                                </div>
                            </div>

                            <div className="h-38 w-[48%] rounded-2xl bg-[#FF5964]">
                                <div className="flex flex-col bg-white border-2 border-[#FF5964] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                    <label className="cursor-pointer text-[16px] font-bold text-[#FF5964] w-full text-center">
                                        Xếp hạng tổng
                                    </label>
                                    <span className="text-5xl font-bold mt-2 text-[#FF5964] mr-auto ml-auto select-none">1200</span>
                                </div>
                            </div>

                            <div className="h-38 w-[48%] rounded-2xl bg-[#F1A12E]">
                                <div className="flex flex-col bg-white border-2 border-[#F1A12E] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                                    <label className="cursor-pointer text-[16px] font-bold text-[#F1A12E] w-full text-center">
                                        Tỉ lệ làm đúng
                                    </label>
                                    <span className="text-5xl font-bold mt-2 text-[#F1A12E] mr-auto ml-auto select-none">90%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}