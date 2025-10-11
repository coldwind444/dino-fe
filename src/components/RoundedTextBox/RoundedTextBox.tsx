'use client'

import clsx from "clsx"

export default function RoundedTextBox({ width = '400', onChange, placeholder } : 
    {
        width?: string
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
        placeholder: string
    }) 
{
    return (
        <div className={clsx(
            'h-[50px] border-2 border-[rgba(0,0,0,0.15)] rounded-full',
            'focus-within:border-[#23BEAA] transition-all duration-150'
        )}  style={{ width: `${width}px`}}>
            <input className="h-full w-[90%] pl-[30px] border-none outline-none text-[17px]" 
                    placeholder={placeholder} 
                    onChange={onChange}/>
        </div>
    )
}