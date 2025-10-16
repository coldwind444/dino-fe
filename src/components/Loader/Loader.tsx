'use client'

import './Loader.css'

export default function Loader() {
    return (
        <div className="h-screen w-screen bg-[azure] gap-[20px] flex flex-col items-center justify-center">
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <label className='text-[25px] font-bold text-[#1DA492]'>Đang tải dữ liệu ...</label>
        </div>
    )
}