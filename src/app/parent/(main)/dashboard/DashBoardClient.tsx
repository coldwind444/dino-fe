'use client'

import clsx from "clsx"
import Image from "next/image"

const results = [
    { id: 1, time: '2023-10-01 10:00', name: 'Bài tập Toán cơ bản', score: '85%' },
    { id: 2, time: '2023-10-03 14:30', name: 'Bài tập Toán nâng cao', score: '90%' },
    { id: 3, time: '2023-10-05 09:15', name: 'Bài tập Đại số', score: '78%' },
    { id: 4, time: '2023-10-07 11:45', name: 'Bài tập Hình học', score: '88%' },
    { id: 5, time: '2023-10-09 13:20', name: 'Bài tập Toán ứng dụng', score: '92%' },
    { id: 6, time: '2023-10-11 15:00', name: 'Bài tập Lý thuyết số', score: '80%' },
    { id: 7, time: '2023-10-01 10:00', name: 'Bài tập Toán cơ bản', score: '85%' },
    { id: 8, time: '2023-10-03 14:30', name: 'Bài tập Toán nâng cao', score: '90%' },
    { id: 9, time: '2023-10-05 09:15', name: 'Bài tập Đại số', score: '78%' },
    { id: 10, time: '2023-10-07 11:45', name: 'Bài tập Hình học', score: '88%' },
    { id: 11, time: '2023-10-09 13:20', name: 'Bài tập Toán ứng dụng', score: '92%' },
    { id: 12, time: '2023-10-11 15:00', name: 'Bài tập Lý thuyết số', score: '80%' },
]

export default function DashBoardClient() {
    return (
        <div className="h-full w-full p-[15px] flex flex-row gap-[20px]">
            {/** Statistics */}
            <div className="flex flex-col gap-[15px] w-2/5 h-full">
                {/** Cards container */}
                <div className="flex flex-row flex-wrap gap-x-[15px] gap-y-[15px] w-full h-[56%]">
                    {/** Card 1 */}
                    <div className="h-[calc(50%-7.5px)] w-[calc(50%-7.5px)] rounded-[20px] bg-[#3B84F2]">
                        <div className="flex flex-col bg-white border-2 border-[#3B84F2] rounded-[20px] h-[97%] w-[98%] py-[10px] px-[20px] gap-5">
                            <label className="cursor-pointer text-xl font-bold text-[#3B84F2]">
                                Số chủ đề đã học
                            </label>
                            <span className="text-6xl font-bold mt-[10px] text-[#3B84F2] mr-auto ml-auto select-none">12</span>
                        </div>
                    </div>
                    {/** Card 2 */}
                    <div className="h-[calc(50%-7.5px)] w-[calc(50%-7.5px)] rounded-[20px] bg-[#3BB766]">
                        <div className="flex flex-col bg-white border-2 border-[#3BB766] rounded-[20px] h-[97%] w-[98%] py-[10px] px-[20px] gap-5">
                            <label className="cursor-pointer text-xl font-bold text-[#3BB766]">
                                Điểm trung bình
                            </label>
                            <span className="text-6xl font-bold mt-[10px] text-[#3BB766] mr-auto ml-auto select-none">8.5</span>
                        </div>
                    </div>
                    {/** Card 3 */}
                    <div className="h-[calc(50%-7.5px)] w-[calc(50%-7.5px)] rounded-[20px] bg-[#FF5964]">
                        <div className="flex flex-col bg-white border-2 border-[#FF5964] rounded-[20px] h-[97%] w-[98%] py-[10px] px-[20px] gap-5">
                            <label className="cursor-pointer text-xl font-bold text-[#FF5964]">
                                Xếp hạng học tập
                            </label>
                            <span className="text-6xl font-bold mt-[10px] text-[#FF5964] mr-auto ml-auto select-none">687</span>
                        </div>
                    </div>
                    {/** Card 4 */}
                    <div className="h-[calc(50%-7.5px)] w-[calc(50%-7.5px)] rounded-[20px] bg-[#F1A12E]">
                        <div className="flex flex-col bg-white border-2 border-[#F1A12E] rounded-[20px] h-[97%] w-[98%] py-[10px] px-[20px] gap-5">
                            <label className="cursor-pointer text-xl font-bold text-[#F1A12E]">
                                Điểm TB đấu trường
                            </label>
                            <span className="text-6xl font-bold mt-[10px] text-[#F1A12E] mr-auto ml-auto select-none">90.3</span>
                        </div>
                    </div>
                </div>
                {/** Arena statistic arena */}
                <div className="flex-1 flex flex-row">
                    {/** Badge frame */}
                    <div className={clsx(
                        "h-full w-[calc(50%-7.5px)] border-2 rounded-[20px] flex flex-col py-[10px] gap-4",
                        'border-[#8A2BE2]', 'shadow-[4px_0px_4px_rgba(0,0,0,0.25)]'
                    )}>
                        <label className="text-xl text-[rgba(0,0,0,0.7)] ml-auto mr-auto font-bold">Xếp hạng đấu trường</label>
                        <Image src={"https://res.cloudinary.com/dirr7ovdh/image/upload/v1761140898/Badge_07_t0e515.svg"}
                            alt="badge" height={140} width={140} className="mr-auto ml-auto" />
                        <span className={clsx(
                            "text-white w-full py-[8px] text-center font-bold text-xl bg-[#8A2BE2]",
                            "shadow-[0px_4px_10px_rgba(0,0,0,0.25)]"
                        )}>
                            Chuyên gia Toán
                        </span>
                    </div>
                    {/** Points & Ranks frame */}
                    <div className="flex flex-1 flex-col gap-[25px]">
                        {/** Position */}
                        <div className="flex flex-col pl-[20px] gap-[15px]">
                            <label className={clsx('text-xl font-bold', 'text-[#8A2BE2]')}>Xếp hạng tuần</label>
                            {/** Comboboxes and position container */}
                            <div className="flex flex-row gap-[15px]">
                                {/** Combo-boxes */}
                                <div className="flex flex-col gap-[8px] w-2/5">
                                    {/** Week */}
                                    <div className={clsx(
                                        "h-[35px] w-[90%] border-2 border-[rgba(0,0,0,0.2)] rounded-full overflow-hidden",
                                    )}>
                                        <select name="week" id="weekSelect" className="h-full w-[90%] outline-none border-none pl-[15px] cursor-pointer text-sm font-medium">
                                            <option value="1">Tuần 1</option>
                                            <option value="2">Tuần 2</option>
                                            <option value="3">Tuần 3</option>
                                            <option value="4">Tuần 4</option>
                                        </select>
                                    </div>
                                    {/** Month */}
                                    <div className={clsx(
                                        "h-[35px] w-[90%] border-2 border-[rgba(0,0,0,0.2)] rounded-full overflow-hidden",
                                    )}>
                                        <select name="week" id="weekSelect" className="h-full w-[90%] outline-none border-none pl-[15px] cursor-pointer text-sm font-medium">
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={i + 1}>Th.{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/** Year */}
                                    <div className={clsx(
                                        "h-[35px] w-[90%] border-2 border-[rgba(0,0,0,0.2)] rounded-full overflow-hidden",
                                    )}>
                                        <select name="week" id="weekSelect" className="h-full w-[90%] outline-none border-none pl-[15px] cursor-pointer text-sm font-medium">
                                            <option value="2022">N.2022</option>
                                            <option value="2023">N.2023</option>
                                            <option value="2024">N.2024</option>
                                            <option value="2025">N.2025</option>
                                        </select>
                                    </div>
                                </div>
                                {/** Rank display */}
                                <div className="h-full flex-1 rounded-[20px] bg-[#8A2BE2] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col text-white font-bold justify-center items-center gap-[15px]">
                                    <label className="text-xs text-center">Vị trí trên <br /> bảng xếp hạng</label>
                                    <label className="text-3xl">91231</label>
                                </div>
                            </div>
                        </div>
                        {/** Points  */}
                        <div className="h-[60px] w-full bg-[#8A2BE2] rounded-tr-[15px] rounded-br-[15px] text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-row justify-between px-[20px] items-center font-medium text-xl">
                            <label>Battle Points:</label>
                            <label>120831</label>
                        </div>
                    </div>
                </div>
            </div>

            {/** History */}
            <div className="flex flex-col gap-[20px] flex-1">
                {/** Header and user select */}
                <div className="flex flex-row justify-between">
                    <label className="font-bold text-xl">Lịch sử làm bài</label>
                    <div className="h-[40px] w-[250px] border-2 border-[rgba(0,0,0,0.2)] rounded-full">
                        <select name="user" id="userSelect" className="h-full w-[90%] cursor-pointer pl-[20px] outline-none border-none">
                            <option value="1">Nguyễn Văn A</option>
                            <option value="2">Nguyễn Văn B</option>
                            <option value="3">Nguyễn Văn C</option>
                        </select>
                    </div>
                </div>
                {/** History content */}
                <div className="flex flex-col gap-[25px]">
                    {/** Filter by date */}
                    <div className="flex flex-row gap-[30px] pl-[50px]">
                        {/** From date */}
                        <div className="flex flex-row gap-[10px] items-center">
                            <label className="font-bold text-[rgba(0,0,0,0.5)]">Từ ngày:</label>
                            <div className="h-[40px] w-[200px] border-2 border-[rgba(0,0,0,0.2)] rounded-full">
                                <input type="date" className="h-full w-[90%] pl-[20px] outline-none border-none rounded-full cursor-pointer" />
                            </div>
                        </div>
                        {/** To date */}
                        <div className="flex flex-row gap-[10px] items-center">
                            <label className="font-bold text-[rgba(0,0,0,0.5)]">Đến ngày:</label>
                            <div className="h-[40px] w-[200px] border-2 border-[rgba(0,0,0,0.2)] rounded-full">
                                <input type="date" className="h-full w-[90%] pl-[20px] outline-none border-none rounded-full cursor-pointer" />
                            </div>
                        </div>
                        {/** Filter button */}
                        <button className="h-[40px] px-[40px] rounded-full cursor-pointer bg-[#23BEAA] text-white hover:opacity-90">Lọc</button>
                    </div>
                    {/** History entries */}
                    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="h-[55px] rounded-2xl font-semibold text-white px-8 flex flex-row justify-between items-center bg-[#23BEAA] shadow-md">
                            <label className="w-[10%] text-center">#</label>
                            <label className="w-[25%] text-center">Thời gian</label>
                            <label className="w-[40%] text-center">Tên / Loại bài tập</label>
                            <label className="w-[20%] text-center">Kết quả</label>
                        </div>

                        {/* Rows */}
                        {results.slice(0, 6).map((result, index) => (
                            <div
                                key={index}
                                className="h-[55px] rounded-2xl font-medium px-8 flex flex-row justify-between items-center border border-[#23BEAA] text-[#23BEAA] bg-white hover:bg-[#E8F9F6] transition-all duration-200 shadow-sm"
                            >
                                <label className="w-[10%] text-center">{index + 1}</label>
                                <label className="w-[25%] text-center">{result.time}</label>
                                <label className="w-[40%] text-center truncate">{result.name}</label>
                                <label className="w-[20%] text-center">{result.score}</label>
                            </div>
                        ))}
                    </div>
                    {/** Pagination */}
                    <div className="flex flex-row justify-between px-[20px] items-center">
                        <label className="text-[rgba(0,0,0,0.5)] font-medium">Hiển thị 1-6 trên 12 kết quả</label>
                        <div className="flex flex-row gap-[10px]">
                            <div className="h-[50px] w-[180px] text-white flex items-center justify-center bg-[#23BEAA] cursor-pointer
                                            font-bold rounded-tl-[20px] rounded-tr-[50px] rounded-bl-[50px] rounded-br-[20px] hover:opacity-90">
                                Trước
                            </div>
                            <div className="h-[50px] w-[180px] text-white flex items-center justify-center bg-[#23BEAA] cursor-pointer
                                            font-bold rounded-tl-[50px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[50px] hover:opacity-90">
                                Sau
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}