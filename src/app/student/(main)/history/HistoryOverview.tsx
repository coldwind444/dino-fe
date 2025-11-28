'use client'

import Filter from "@/components/Filter/Filter"
import { faClock, faCalendar } from "@fortawesome/free-regular-svg-icons"
import { faCheckCircle, faNewspaper, faStar, faVialCircleCheck, faWarning, faXmarkSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"

interface HistoryRecord {
    name: string
    accuracy: number
    date: string
    duration: string
}

interface HistoryOverviewProps {
    records?: HistoryRecord[]
    onViewDetail: () => void
}

const defaultRecords: HistoryRecord[] = [
    { name: 'Đấu trường', accuracy: 95, date: 'Thứ Năm, 17:00 20-11-2025 ', duration: '15 phút' },
    { name: 'Đấu trường', accuracy: 55, date: 'Thứ Năm, 17:00 20-11-2025 ', duration: '15 phút' },
    { name: 'Đấu trường', accuracy: 35, date: 'Thứ Năm, 17:00 20-11-2025 ', duration: '15 phút' },
]

export default function HistoryOverview({ records = defaultRecords, onViewDetail }: HistoryOverviewProps) {
    const handleFilter = (studentId?: string, startDate?: Date, endDate?: Date, category?: string, keyword?: string) => {
        alert('Filter clicked !')
    }

    return (
        <div className="h-full w-full p-5 flex flex-row gap-5">
            <Filter hasCategorySelectBox hasSearchBox filter={handleFilter} />
            {/** Statistic */}
            <div className="flex flex-1 flex-col gap-6">
                {/** Overall */}
                <div className="flex flex-col gap-4">
                    <label className="font-medium text-xl">Thống kê tổng quát</label>
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col h-40 w-80 bg-gradient-to-r from-0% from-[#60A0FF] to-100% to-[#4D01FE] 
                                text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg">
                            <label className="font-medium">Số bài tập đã làm</label>
                            <label className="ml-auto mr-auto text-5xl font-medium">147</label>
                            <FontAwesomeIcon icon={faNewspaper} className="absolute top-0 right-0 text-4xl mt-3 mr-3" />
                        </div>
                        <div className="flex flex-col h-40 w-80 bg-gradient-to-r from-0% from-[#3BC16A] to-100% to-[#01A139] 
                                text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg">
                            <label className="font-medium">Độ chính xác</label>
                            <label className="ml-auto mr-auto text-5xl font-medium">90%</label>
                            <FontAwesomeIcon icon={faVialCircleCheck} className="absolute top-0 right-0 text-4xl mt-3 mr-3" />
                        </div>
                    </div>
                </div>
                {/** History */}
                <div className="flex flex-1 flex-col gap-4">
                    <label className="font-medium text-xl">Lịch sử làm bài</label>
                    {/** List */}
                    <div className="flex flex-col gap-2 w-full flex-1">
                        {records.map((val, idx) => (
                            <div key={idx} className={clsx(
                                'h-24 w-full rounded-xl border-2 flex flex-row px-5 py-2 items-center',
                                val.accuracy >= 80 ? 'border-[#23BEAA] '
                                    : val.accuracy >= 50 ? 'border-[#F9740B]' : 'border-[#FF5964]'
                            )}>
                                {/** Icon */}
                                <FontAwesomeIcon icon={val.accuracy >= 80 ? faCheckCircle : val.accuracy >= 50 ? faWarning : faXmarkSquare}
                                    className={clsx(
                                        'text-5xl',
                                        val.accuracy >= 80 ? 'text-[#23BEAA]' :
                                            val.accuracy >= 50 ? 'text-[#F9740B]' : 'text-[#FF5964]'
                                    )} />
                                {/** Info */}
                                <div className="flex flex-col ml-5 gap-1">
                                    <label className={clsx(
                                        'text-xl font-bold',
                                        val.accuracy >= 80 ? 'text-[#23BEAA]' :
                                            val.accuracy >= 50 ? 'text-[#F9740B]' : 'text-[#FF5964]'
                                    )}>
                                        {val.name}
                                    </label>
                                    <div className="flex flex-row gap-5 font-medium">
                                        <div className="flex flex-row gap-1 text-[rgba(0,0,0,0.5)] items-center">
                                            <FontAwesomeIcon icon={faClock} />
                                            <label>{val.duration}</label>
                                        </div>
                                        <div className="flex flex-row gap-1 text-[rgba(0,0,0,0.5)] items-center">
                                            <FontAwesomeIcon icon={faCalendar} />
                                            <label>{val.date}</label>
                                        </div>
                                    </div>
                                </div>
                                {/** Accuracy */}
                                <div className="flex flex-col gap-1 ml-50">
                                    <div className="flex flex-row gap-3 items-center">
                                        <label className={clsx(
                                            'text-2xl font-medium',
                                            val.accuracy >= 80 ? 'text-[#23BEAA]' :
                                                val.accuracy >= 50 ? 'text-[#F9740B]' : 'text-[#FF5964]'
                                        )}>
                                            {`${val.accuracy}%`}
                                        </label>
                                        <div className="flex flex-row gap-1 text-amber-400">
                                            {[...Array(val.accuracy >= 80 ? 3 : val.accuracy >= 50 ? 2 : 1)]
                                                .map((_, idx) => (
                                                    <FontAwesomeIcon key={idx} icon={faStar} />
                                                ))}
                                        </div>
                                    </div>
                                    <label className="font-medium text-[rgba(0,0,0,0.5)]">{`${val.accuracy}/100`}</label>
                                </div>
                                {/** View button */}
                                <div className={clsx(
                                    "h-fit w-fit px-8 py-2 font-medium text-white flex items-center justify-center rounded-full",
                                    'cursor-pointer hover:brightness-110 transition-all duration-200 ml-auto mr-5',
                                    val.accuracy >= 80 ? 'bg-[#23BEAA]' :
                                        val.accuracy >= 50 ? 'bg-[#F9740B]' : 'bg-[#FF5964]'
                                )} onClick={onViewDetail}>Xem</div>
                            </div>
                        ))}
                    </div>
                    {/** Pagination */}
                    <div className="flex flex-row items-center mb-5">
                        <label className="font-medium text-[rgba(0,0,0,0.5)]">Hiển thị 1-3 trên 10 kết quả</label>
                        <div className="ml-auto mr-0 flex flex-row gap-2">
                            <div className="h-fit w-30 px-5 py-2 border-2 border-black cursor-pointer hover:bg-gray-100
                                        flex items-center justify-center rounded-2xl font-medium">
                                Trước
                            </div>
                            <div className="h-fit w-30 px-5 py-2 border-2 border-black cursor-pointer hover:bg-gray-100
                                        flex items-center justify-center rounded-2xl font-medium">
                                Sau
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}