"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Roboto, Righteous, Chewy, Fredoka } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faFireFlameCurved,
  faBarsProgress,
  faTrophy,
  faGamepad,
  faPlay,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLessonStore } from "@/stores/lessonStore";
import CocosGame from "@/components/GameComponent/CocosComponent";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const righteous = Righteous({ weight: "400", subsets: ["latin"] });
const chewy = Chewy({ subsets: ["latin"], weight: "400" });
const fredoka = Fredoka();

const trophy = "/assets/home/trophy.png";
const SAMPLE_THUMB_PATH = "/assets/landing/egg_normal.png";
const morning = "/assets/home/sunrise.png";
const afternoon = "/assets/home/sunset.png";
const night = "/assets/home/moonlight.png";

const timeConfig = [
  {
    start: 5,
    end: 12,
    greeting: "Chúc bạn buổi sáng tốt lành!",
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

interface LessonsData {
  [grade: string]: Array<{
    name: string;
    brand?: string;
  }>;
}

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

interface StudentHomeProps {
  lessons?: LessonsData;
}

export default function StudentHome({ lessons }: StudentHomeProps) {
  const username = "Tân";

  const { gradeId, setGradeId, setTopicId, setLectureIdx } = useLessonStore();

  return (
    <div className="w-full min-h-screen p-6 sm:p-10 pl-[63px] pr-[69px]">
      <div className="flex flex-col lg:flex-row gap-[21px]">
        <div className="pt-[32px]">
          <TimeCard username={username} />
        </div>

        <div className="flex-1">
          <div className="relative h-[203px] w-full">
            <div className="absolute inset-0 bg-[#23BEAA] rounded-[15px] translate-x-[4px] translate-y-[4px]" />

            <div
              className={clsx(
                "relative h-full z-[1]",
                "border-2 border-[#23BEAA]",
                "bg-[#F3FFFD]",
                "rounded-[15px]",
                "flex items-center gap-6"
              )}
            >
              <div className="w-60 h-60 flex-shrink-0 flex items-center justify-center pb-4 pl-6">
                <Image src={trophy} alt="trophy" width={300} height={300} />
              </div>
              <div className="flex-1 pl-10 flex flex-col gap-[20px]">
                <h3 className="text-3xl font-medium text-[#23BEAA]">
                  Luôn nỗ lực mỗi ngày để trở nên giỏi hơn !
                </h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative inline-block h-[90px] w-[180px] rounded-[30px] bg-[#1DA492] overflow-hidden">
                    <span className="absolute top-6 left-6 w-2 h-2 rounded-full bg-white/40" />
                    <span className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-white/30" />
                    <div
                      className={clsx(
                        "h-full w-full rounded-tl-[50px] rounded-bl-[50px] rounded-br-[50px]",
                        "bg-[#23BEAA] text-[20px] text-white font-bold flex items-center justify-center"
                      )}
                    >
                      CHỌN LỚP
                    </div>
                  </div>

                  <div className="flex items-center gap-5 ml-[30px]">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setGradeId(n.toString());
                          setTopicId("1");
                          setLectureIdx(0);
                        }}
                        className={clsx(
                          "relative aspect-square h-20 rounded-full flex items-center justify-center",
                          "font-bold text-3xl transition-all hover:scale-105 group cursor-pointer",
                          "bg-[#C4F1EC] text-[#23BEAA] hover:bg-[#23BEAA] hover:text-white group",
                          n.toString() === gradeId
                            ? "bg-amber-500 text-white"
                            : "",
                          fredoka.className
                        )}
                      >
                        <span
                          className={clsx(
                            "absolute [clip-path:ellipse(50%_50%_at_50%_50%)] rounded-full h-[15px] w-[30px]",
                            "bg-[rgba(255,255,255)] bottom-0 right-0 mb-[13px] mr-[5px] -rotate-45",
                            "group-hover:bg-[rgba(255,255,255,0.5)]",
                            n.toString() === gradeId
                              ? "bg-[rgba(255,255,255,0.5)]"
                              : ""
                          )}
                        ></span>
                        <span
                          className={clsx(
                            "absolute [clip-path:ellipse(50%_50%_at_50%_50%)] rounded-full h-[10px] w-[20px]",
                            "bg-[rgba(255,255,255)] left-0 rotate-90 group-hover:bg-[rgba(255,255,255,0.5)]",
                            n.toString() === gradeId
                              ? "bg-[rgba(255,255,255,0.5)]"
                              : ""
                          )}
                        ></span>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="mt-8 mb-[50px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Lesson Card */}
        <div className="lg:col-span-5">
          <div className="relative h-[400px]">
            <div className="absolute inset-0 bg-[#9B5DE5] rounded-[15px] translate-x-[4px] translate-y-[4px]" />

            <div
              className={clsx(
                "relative h-full z-[1]",
                "bg-[#F5EEFF] border-2 border-[#9B5DE5]",
                "rounded-[15px] shadow-md flex flex-col p-6"
              )}
            >
              <span
                className={clsx(
                  "absolute top-3.5 right-2.5",
                  "text-base bg-[#E9D5FF] text-[#6B21A8] font-medium",
                  "px-6 py-2 rounded-full"
                )}
              >
                Đang học
              </span>

              <div className="flex-1 flex items-center gap-6">
                <div
                  className={clsx(
                    "flex-shrink-0 w-36 h-36 rounded-xl",
                    "flex items-center justify-center"
                  )}
                >
                  <Image
                    src={lessons?.["1"]?.[5]?.brand || SAMPLE_THUMB_PATH}
                    alt="lesson"
                    width={120}
                    height={120}
                  />
                </div>

                <div className="flex-1 pl-4">
                  <h4 className="text-3xl font-bold">
                    {lessons?.["1"]?.[5]?.name || "Một số phép toán cơ bản"}
                  </h4>
                </div>
              </div>

              <div
                className={clsx(
                  "h-[70px] w-full rounded-[20px] bg-[#5E1C9A] overflow-hidden cursor-pointer",
                  "hover:opacity-90 group"
                )}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center",
                    "h-full w-full relative bg-[#8A2BE2] text-white text-[22px] font-medium",
                    "rounded-tl-[50px] rounded-br-[60px] relative"
                  )}
                >
                  Tiếp tục học
                  <span className="absolute top-0 right-0 mt-[7px] mr-[10px] h-[25px] aspect-square bg-[rgba(255,255,255,0.5)] rounded-full" />
                  <FontAwesomeIcon icon={faPlay} className="ml-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <aside className="lg:col-span-4 w-fit h-fit">
          <div>
            <h5 className="font-semibold">Ôn lại kiến thức</h5>
            <div className="mt-3 flex flex-col gap-3 h-[360px] w-[830px] overflow-y-auto pr-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`review-${i}`}
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-[20px]",
                    "bg-[#FFF6F6] border-2 border-[#FF9292] min-h-[80px] pl-[50px]"
                  )}
                >
                  <div className="text-xl text-[#FF9292] font-medium">
                    {lessons?.["1"]?.[i]?.name || `Bài học ${i + 1}`}
                  </div>
                  <button
                    type="button"
                    aria-label="refresh"
                    className={clsx(
                      "w-10 h-10 rounded-full bg-white flex items-center justify-center",
                      "shadow-md border border-gray-200 hover:shadow-lg hover:scale-105",
                      "transition-all duration-200 group"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faRotateRight}
                      className="text-[#FF6B6B] group-hover:rotate-180 transition-transform duration-300"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
