'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVolumeHigh, faVolumeLow, faVolumeOff, faVolumeXmark } from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"
import { useState } from "react"

const STATE = {
  HIGH: faVolumeHigh,
  LOW: faVolumeLow,
  OFF: faVolumeOff,
  MUTE: faVolumeXmark
} as const

type StateKey = keyof typeof STATE

export default function Volume() {
  const [value, setValue] = useState(50)
  const [state, setState] = useState<StateKey>("HIGH")
  const [muted, setMuted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setValue(val)
    if (val === 0) setState("OFF")
    else if (val < 30) setState("LOW")
    else setState("HIGH")
  }

  const progress = (value / 100) * 100
  const backgroundStyle = {
    background: `linear-gradient(to right, #1DA492 ${progress}%, #e5e7eb ${progress}%)`,
  }

  return (
    <div className="flex flex-row items-center gap-[5px] w-fit">
      {/* Icon button */}
      <div onClick={() => setMuted(prev => !prev )}
        className={clsx(
          "relative aspect-square h-[40px] bg-[#1DA492] rounded-full",
          "text-white flex items-center justify-center",
          "hover:opacity-85 cursor-pointer transition-all"
        )}
      >
        <FontAwesomeIcon icon={muted ? STATE.MUTE : STATE[state]} />
        <span
          className={clsx(
            "absolute bottom-0 mb-[2px]",
            "h-[5px] w-[10px] rounded-[1000px] bg-[rgba(255,255,255,0.3)]",
            "[clip-path:ellipse(50%_50%_at_50%_50%)]"
          )}
        />
        <span
          className={clsx(
            "absolute left-0 ml-[2px] rotate-45 -translate-y-[12px] translate-x-[5px]",
            "w-[6px] h-[12px] rounded-[1000px] bg-[rgba(255,255,255,0.3)]",
            "[clip-path:ellipse(50%_50%_at_50%_50%)]"
          )}
        />
      </div>

      {/* Slider */}
      <input disabled={muted}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        style={backgroundStyle}
        className="
          disabled:opacity-50 disabled:cursor-not-allowed
          w-[110px] h-2 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#1DA492]
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[#1DA492]
        "
      />
    </div>
  )
}
