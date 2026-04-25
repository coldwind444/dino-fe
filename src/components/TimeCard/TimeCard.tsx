'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { roboto, chewy } from "@/app/fonts";

const morning = "/assets/home/sunrise.png";
const afternoon = "/assets/home/sunset.png";
const night = "/assets/home/moonlight.png";


const timeConfig = [
  {
    start: 5,
    end: 12,
    greeting: "Chúc buổi sáng tốt lành!",
    image: morning,
    shadow: "#FED876",
    bg: "#FDF1D2",
    timeColor: "#F1A12E",
    textColor: "#1DA492",
  },
  {
    start: 12,
    end: 18,
    greeting: "Buổi chiều thật đẹp nhé!",
    image: afternoon,
    shadow: "#FDBEA1",
    bg: "#FFE5D9",
    timeColor: "#E85D04",
    textColor: "#6A4C93",
  },
  {
    start: 18,
    end: 24,
    greeting: "Chúc bạn buổi tối vui vẻ!",
    image: night,
    shadow: "#0D0719",
    bg: "#2D1B4E",
    timeColor: "#FFB347",
    textColor: "#CDB4DB",
  },
  {
    start: 0,
    end: 5,
    greeting: "Chúc bạn buổi tối vui vẻ!",
    image: night,
    shadow: "#0D0719",
    bg: "#2D1B4E",
    timeColor: "#FFB347",
    textColor: "#CDB4DB",
  },
];

export function TimeCard({ username }: { username: string }) {
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [imageSrc, setImageSrc] = useState(morning);
  const [colors, setColors] = useState({
    shadow: "#FED876",
    bg: "#FDF1D2",
    timeColor: "#F1A12E",
    textColor: "#1DA492",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const hoursStr = String(hours).padStart(2, "0");
      setTime(`${hoursStr}:${minutes}`);

      const current = timeConfig.find(
        ({ start, end }) => hours >= start && hours < end
      );
      if (current) {
        setGreeting(current.greeting);
        setImageSrc(current.image);
        setColors({
          shadow: current.shadow,
          bg: current.bg,
          timeColor: current.timeColor,
          textColor: current.textColor,
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[270px] h-[170px]">
      <div
        className="absolute inset-0 rounded-[15px] translate-x-[4px] translate-y-[4px]"
        style={{ backgroundColor: colors.shadow }}
      />

      <div
        className={clsx("relative", "rounded-[15px]", "w-full h-full")}
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.shadow,
        }}
      >
        <div
          className={clsx(
            "absolute top-[19px] right-[37px]",
            "text-[28px] font-bold",
            chewy.className
          )}
          style={{ color: colors.timeColor }}
        >
          {time}
        </div>

        <div
          className={clsx(
            roboto.className,
            "absolute top-[100px] right-[37px] text-[19px] font-medium"
          )}
          style={{ color: colors.textColor }}
        >
          <div>Chào {username},</div>
          <div>{greeting}</div>
        </div>

        <Image
          src={imageSrc}
          alt="Thời gian trong ngày"
          width={120}
          height={120}
          className="absolute bottom-[90px] right-1/2"
        />
      </div>
    </div>
  );
}