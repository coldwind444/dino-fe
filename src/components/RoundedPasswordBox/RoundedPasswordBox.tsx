'use client'

import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { useState } from "react"

export default function RoundedPasswordBox({ width = '400', onChange, onStateChange, placeholder } : 
    {
        width?: string
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
        onStateChange?: (state : boolean) => void
        placeholder: string
    }) 
{
    const [show, setShow] = useState(false)

    const handleStateChange = () => {
        setShow(prev => !prev)
        onStateChange?.(show)
    }

    return (
        <div className={clsx(
            'h-[50px] border-2 border-[rgba(0,0,0,0.15)] rounded-full',
            'focus-within:border-[#23BEAA] transition-all duration-150',
            'flex flex-row gap-[20px] items-center'
        )}  style={{ width: `${width}px`}}>
            <input className="h-full w-[80%] pl-[30px] border-none outline-none text-[17px]" 
                    placeholder={placeholder} 
                    onChange={onChange} 
                    type={show ? 'text' : 'password'}/>
            <FontAwesomeIcon className="text-[rgba(0,0,0,0.7)] cursor-pointer" 
                            icon={show ? faEyeSlash : faEye} 
                            onClick={() => handleStateChange() }/>
        </div>
    )
}