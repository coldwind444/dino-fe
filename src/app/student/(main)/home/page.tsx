"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Roboto, Righteous, Chewy } from "next/font/google";
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

const roboto = Roboto({ subsets: ["latin"] });
const righteous = Righteous({ weight: "400" });
const chewy = Chewy({ subsets: ["latin"], weight: "400" });
const trophy = "/assets/home/trophy.png";

const SAMPLE_THUMB_PATH = "/assets/landing/egg_normal.png";
const morning = "/assets/home/sunrise.png";
const afternoon = "/assets/home/sunset.png";
const night = "/assets/home/moonlight.png";

const timeConfig = [
  { start: 5, end: 12, greeting: "Chúc buổi sáng tốt lành!", image: morning },
  { start: 12, end: 18, greeting: "Chúc buổi chiều vui vẻ!", image: afternoon },
  { start: 18, end: 24, greeting: "Chúc buổi tối an lành!", image: night },
  { start: 0, end: 5, greeting: "Chúc buổi tối an lành!", image: night },
];

export function TimeCard({ username }: { username: string }) {
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [imageSrc, setImageSrc] = useState(morning);

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
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[270px] h-[170px]">
      <div className="absolute inset-0 bg-[#FED876] rounded-[15px] translate-x-[6px] translate-y-[6px]" />

      <div
        className={clsx(
          "relative bg-[#FFF4D6]",
          "rounded-[15px] shadow-sm border border-[#FED876]",
          "w-full h-full"
        )}
      >
        <div
          className={clsx(
            "absolute top-[19px] right-[37px]",
            "text-[28px] font-bold text-[#F59E0B]",
            chewy.className
          )}
        >
          {time}
        </div>

        <div
          className={clsx(
            roboto.className,
            "absolute top-[100px] right-[37px] text-[19px] text-[#F1A12E]"
          )}
        >
          <div>Chào {username},</div>
          <div>{greeting}</div>
        </div>

        <Image
          src={imageSrc}
          alt="Thời gian trong ngày"
          width={120}
          height={120}
          className="absolute bottom-[90px] right-1/2 "
        />
      </div>
    </div>
  );
}

export default function StudentHome() {
  const username = "Tân";

  return (
    <div className="w-full h-full p-6 sm:p-10">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <TimeCard username={username} />
        </div>

        <div className="lg:col-span-9 mt-[30px] lg:mt-0 lg:pr-[60px]">
          <div className="relative h-[170px] w-[910px] ">
            <div className="absolute inset-0 bg-[#23BEAA] rounded-[15px] translate-x-[6px] translate-y-[6px]" />

            <div
              className={clsx(
                "relative h-full z-10",
                "border-2 border-[#23BEAA]",
                "bg-[#F3FFFD]",
                "rounded-[15px]",
                "flex items-center gap-6"
              )}
            >
              <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center">
                <Image src={trophy} alt="trophy" width={300} height={300} />
              </div>
              <div className="flex-1 pl-10">
                <h3 className="text-xl font-bold text-[#23BEAA]">
                  Luôn nỗ lực mỗi ngày để trở nên giỏi hơn !
                </h3>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    className={clsx(
                      "px-6 py-3 rounded-full shadow-md",
                      "bg-[#1DA492] text-white"
                    )}
                  >
                    CHỌN LỚP
                  </button>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        className={clsx(
                          "relative w-14 h-14 rounded-full flex items-center justify-center",
                          "font-bold text-xl transition-all hover:scale-105",
                          "bg-[#C4F1EC] text-[#23BEAA] hover:bg-[#23BEAA] hover:text-white group"
                        )}
                      >
                        <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-white transition-colors group-hover:bg-white/40" />
                        <span className="absolute bottom-3 left-2 w-2.5 h-2.5 rounded-full bg-white transition-colors group-hover:bg-white/30" />
                        <span className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-white/80 transition-colors group-hover:bg-white/20" />
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Area */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start  w-[900px] h-[333px]">
        {/* Lesson Card */}
        <div className="lg:col-span-8">
          <div className="relative ">
            <div className="absolute inset-0 bg-[#6B21A8] rounded-[15px] translate-x-[6px] translate-y-[6px]" />

            <div
              className={clsx(
                "relative h-full z-10",
                "bg-[#F5EEFF] border-2 border-[#C9A7FF]",
                "rounded-[15px] shadow-md flex items-center gap-6 p-6 pb-[90px]"
              )}
            >
              <div
                className={clsx(
                  "flex-shrink-0 w-36 h-36 bg-white rounded-xl",
                  "flex items-center justify-center shadow-sm"
                )}
              >
                <Image
                  src={SAMPLE_THUMB_PATH}
                  alt="lesson"
                  width={120}
                  height={120}
                />
              </div>

              <div className="flex-1 pl-4">
                <span
                  className={clsx(
                    "absolute top-2.5 right-2.5",
                    "text-base bg-[#E9D5FF] text-[#6B21A8] font-medium",
                    "px-6 py-2 rounded-full"
                  )}
                >
                  Đang học
                </span>

                <div>
                  <h4 className="text-3xl font-bold text-[#6B21A8]">
                    Một số phép toán cơ bản
                  </h4>
                </div>

                <p className="mt-3 text-[rgba(0,0,0,0.6)]">
                  Ôn luyện các phép tính cộng, trừ, nhân, chia cơ bản.
                </p>

                <button
                  className={clsx(
                    "absolute bottom-2.5 left-2.5 right-2.5",
                    "flex items-center justify-center px-8 py-4",
                    "bg-[#6B21A8] text-white rounded-[30px] shadow-lg text-lg hover:bg-[#8B5CF6] transition-colors"
                  )}
                >
                  <span className="absolute top-3 right-30 w-2 h-2 rounded-full bg-white/40" />
                  <span className="absolute bottom-4 left-38 w-3 h-3 rounded-full bg-white/30" />
                  <span className="absolute bottom-3 right-40 w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span>Tiếp tục học</span>
                  <FontAwesomeIcon icon={faPlay} className="ml-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4  w-[590px] ">
          <div className="p-4">
            <h5 className="font-semibold">Ôn lại kiến thức</h5>
            <div className="mt-3 flex flex-col gap-3 max-h-[360px] overflow-auto pr-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "flex items-center justify-between p-3 rounded-[30px]",
                    "bg-[#FFF0F0] border border-[#F5C6C6]"
                  )}
                >
                  <div className="text-sm text-[#D65A5A]">
                    Các số đếm từ 1 đến 10
                  </div>
                  <button
                    aria-label="refresh"
                    className={clsx(
                      "w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm"
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faRotateRight}
                      className="text-[#FF6B6B]"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
