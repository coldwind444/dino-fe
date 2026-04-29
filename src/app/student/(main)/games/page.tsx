"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  faCrown,
  faPlay,
  faSearch,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";

import single from "../../../../../public/assets/games/single.webp";
import pvp from "../../../../../public/assets/games/pvp.webp";
import { getMinigames } from "@/apis/minigame";
import { MiniGameResponse } from "@/types";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { APIError } from "@/apis/config";

export default function Games() {
  // Data state
  const [mode, setMode] = useState<"single" | "pvp">("single");
  const [minigames, setMinigames] = useState<MiniGameResponse[]>([]);
  const [search, setSearch] = useState("");

  // Loading
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    let ignore = false;
    const fetchMinigames = async () => {
      try {
        setLoading(true);
        const minigames = await getMinigames({ isActive: true });
        if (!ignore) setMinigames(minigames);
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMinigames();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <ScreenLoader />;

  return (
    <div className="h-full w-full p-5 flex flex-col gap-5">
      {/** Tab bar */}
      <div
        className="h-20 w-full bg-gradient-to-r from-0% to-100% from-[#53DB97] to-[#0695B6] 
                            rounded-2xl flex flex-row px-10 items-center gap-40"
      >
        {/** Tab buttons */}
        <div className="flex flex-row gap-10 h-full items-center ml-auto mr-0 relative">
          <label
            className={clsx(
              "text-xl font-medium cursor-pointer",
              mode === "single" ? "text-white" : "text-[rgba(255,255,255,0.7)]",
            )}
            onClick={() => setMode("single")}
          >
            Chơi đơn
          </label>
          <label
            className={clsx(
              "text-xl font-medium cursor-pointer",
              mode === "pvp" ? "text-white" : "text-[rgba(255,255,255,0.7)]",
            )}
            onClick={() => setMode("pvp")}
          >
            Tương tác
          </label>
          <div
            className={clsx(
              "h-1 w-10 bg-white absolute bottom-4 rounded-full transition-all duration-200",
              mode === "single" ? "translate-x-1/2" : "translate-x-37",
            )}
          ></div>
        </div>
        {/** Search box */}
        <div
          className="h-12 w-100 border border-[rgba(255,255,255,0.7)] rounded-2xl px-5 items-center
                                flex flex-row gap-2 focus-within:border-white focus-within:shadow-[0_0_10px_rgba(255,255,255,0.5)]
                                transition-all duration-150"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="text-xl text-[rgba(255,255,255,0.5)]"
          />
          <input
            className="h-full flex-1 outline-none border-none text-white text-[18px]"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm"
          />
        </div>
      </div>
      {/** Main */}
      <div className="flex flex-row gap-10 w-full">
        {/** Illustration */}
        <div className="w-1/3 h-full block relative">
          <AnimatePresence mode="wait">
            {mode === "single" ? (
              <motion.div
                key="single"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute -top-25 left-20"
              >
                <Image src={single} alt="" height={280} width={280} priority />
              </motion.div>
            ) : (
              <motion.div
                key="pvp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute -top-35 left-20"
              >
                <Image src={pvp} alt="" height={340} width={340} priority />
              </motion.div>
            )}
          </AnimatePresence>
          {mode === "single" ? (
            <label className="text-5xl text-[#006E69] font-bold z-10 absolute bottom-45 right-10">
              Chơi Đơn
            </label>
          ) : (
            <label className="text-5xl text-[#824738] font-bold z-10 absolute bottom-45 right-10">
              Tương Tác
            </label>
          )}
          {mode === "single" ? (
            <label className="text-[28px] text-[#23BEAA] font-bold z-10 absolute bottom-13 right-0">
              THỬ THÁCH BẢN THÂN <br /> CHINH PHỤC TOÁN HỌC !
            </label>
          ) : (
            <label className="text-[28px] text-[#FF9600] font-bold z-10 absolute bottom-13 right-0">
              HỢP LỰC HOẶC ĐỐI ĐẦU, <br /> BẠN CHỌN KIỂU NÀO ?
            </label>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 657 682"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              className="transition-colors duration-300"
              d="M627 0C643.569 1.64286e-06 657 13.4315 657 30V429C657 456.614 634.614 479 607 479H195C167.386 479 145 501.386 145 529V591C145 618.614 167.386 641 195 641H646C652.075 641 657 645.925 657 652C657 668.569 643.569 682 627 682H30C13.4315 682 0 668.569 0 652V30C6.50742e-06 13.4315 13.4315 3.20117e-07 30 0H627Z"
              fill="url(#paint0_linear_1733_758)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1733_758"
                x1="328.5"
                y1="0"
                x2="328.5"
                y2="682"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.466346"
                  style={{ transition: "stop-color 0.3s ease" }}
                  stopColor={mode === "single" ? "#C4EEDE" : "#FFD3A5"}
                />
                <stop
                  offset="1"
                  style={{ transition: "stop-color 0.3s ease" }}
                  stopColor={mode === "single" ? "#C8DBF8" : "#FFFAC5"}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/** Game list */}
        <div className="flex flex-1 max-h-[520px] flex-wrap flex-row gap-x-4 gap-y-6 overflow-y-auto pr-10">
          {(() => {
            const filteredGames = minigames
              .filter((val) =>
                mode === "single"
                  ? val.gameType === "singleplayer"
                  : val.gameType === "multiplayer",
              )
              .filter((val) =>
                val.title.toLowerCase().startsWith(search.toLowerCase()),
              );

            if (filteredGames.length === 0) {
              return (
                <div className="w-full mt-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <FontAwesomeIcon icon={faBoxOpen} className="text-6xl" />
                  <label className="text-xl font-medium">
                    Không có trò chơi nào
                  </label>
                </div>
              );
            }

            return filteredGames.map((val, idx) => (
              // Game Card
              <div
                key={idx}
                className={clsx(
                  "h-90 w-70 border-2 rounded-2xl",
                  true ? "border-[#23BEAA]" : "border-[#F1A12E]",
                  "flex flex-col gap-2 p-2",
                )}
              >
                {/** Thumbnail */}
                <div className="h-1/2 w-full rounded-xl overflow-hidden">
                  <Image
                    src={val.thumbnail}
                    height={640}
                    width={349}
                    loading="lazy"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                {/** Label */}
                <div className="flex flex-col ml-2 gap-2 mb-3">
                  <label className="text-[18px] font-medium">{val.title}</label>
                  <div className="max-w-full max-h-20 overflow-y-auto pr-3">
                    <p className="text-sm font-medium text-wrap text-justify text-gray-400">
                      {val.description}
                    </p>
                  </div>
                </div>
                {/** Play button */}
                <div
                  className={clsx(
                    "h-12 w-full rounded-xl",
                    true ? "bg-[#23BEAA]" : "bg-[#F1A12E]",
                    "flex flex-row text-white font-medium items-center mt-auto mb-0 ",
                    "hover:brightness-110 cursor-pointer transition-all duration-150",
                  )}
                  onClick={() => window.open(val.gameUrl)}
                >
                  <label className="mr-auto ml-20 cursor-pointer">
                    {true ? "Chơi ngay" : "Mua Premium"}
                  </label>
                  <FontAwesomeIcon
                    className="ml-auto mr-5 text-xl"
                    icon={true ? faPlay : faCrown}
                  />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
