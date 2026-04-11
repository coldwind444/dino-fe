'use client'

import clsx from "clsx"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"

export default function RoundedTextBox({
    value,
    width = '400',
    onChange,
    placeholder,
    requirement,
    isValid,
    showTooltip = false
}: {
    value: string
    width?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    requirement?: string
    isValid?: boolean
    showTooltip?: boolean
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative" style={{ width: `${width}px` }}>
            <div
                className={clsx(
                    'h-[50px] border-2 border-[rgba(0,0,0,0.15)] rounded-full overflow-hidden w-full',
                    'focus-within:border-[#23BEAA] transition-all duration-150',
                    'flex flex-row gap-[20px] items-center'
                )}
            >
                <input
                    className="h-full flex-1 pl-[30px] border-none outline-none text-[17px]"
                    placeholder={placeholder}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={value}
                />
                {isValid !== undefined && value.length > 0 && (
                    <div className="flex flex-row items-center gap-[15px] pr-[20px]">
                        <FontAwesomeIcon
                            icon={isValid ? faCheck : faXmark}
                            className={isValid ? "text-[#23BEAA]" : "text-red-500"}
                        />
                    </div>
                )}
            </div>
            {isFocused && showTooltip && requirement && !isValid && (
                <div className="absolute top-[100%] left-0 mt-[10px] p-[10px] bg-[#333] text-white rounded-[8px] shadow-lg z-50 text-[13px] w-full text-center pointer-events-none">
                    {requirement}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-[#333]"></div>
                </div>
            )}
        </div>
    )
}