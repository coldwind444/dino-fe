"use client";

import Image from "next/image";
import { Roboto } from "next/font/google";
import top1 from "../../../../../public/assets/leaderboard/top1.png";
import top2 from "../../../../../public/assets/leaderboard/top2.svg";
import top3 from "../../../../../public/assets/leaderboard/top3.svg";
import dino from "../../../../../public/assets/leaderboard/dino_trophy.png";
import {
  MyPositionInRankResponse,
  QuartzLeaderboardItemResponse,
  UserProfileResponse,
} from "@/types";
import { useEffect, useState } from "react";
import { getMyRank, getQuartzLeaderboard, getUserProfile } from "@/apis/user";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { formatNumberAbbreviation, isValidUrl } from "@/helpers/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const gradientColors = [
  "from-yellow-400 to-orange-400",
  "from-blue-400 to-blue-500",
  "from-pink-400 to-pink-500",
  "from-teal-400 to-teal-500",
  "from-purple-400 to-purple-500",
  "from-green-400 to-green-500",
  "from-red-400 to-red-500",
  "from-indigo-400 to-indigo-500",
];

const getRandomColor = (index: number) => {
  return gradientColors[index % gradientColors.length];
};

export default function LeaderboardContent() {
  // Data
  const [leaderboardData, setLeaderboardData] = useState<
    QuartzLeaderboardItemResponse[]
  >([]);
  const [myProfile, setMyProfile] = useState<UserProfileResponse | null>(null);
  const [leaderboardMyRank, setLeaderboardMyRank] =
    useState<MyPositionInRankResponse | null>(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const leaderboardData = await getQuartzLeaderboard(11);
        const myProfile = await getUserProfile();
        const myRank = await getMyRank();
        if (!ignore) {
          setMyProfile(myProfile);
          setLeaderboardData(leaderboardData);
          setLeaderboardMyRank(myRank);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading || !myProfile || !leaderboardData) return <ScreenLoader />;

  return (
    <div
      className={`${roboto.className} flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}
    >
      {/* LEFT SIDEBAR */}
      <div className="w-64 relative h-[660px] mt-2 ml-6">
        <div className="bg-gradient-to-b from-teal-400 to-teal-500 rounded-3xl h-full relative">
          <div
            className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 70% 40%, 50% 0, 30% 40%)",
            }}
          />

          <div className="bg-white rounded-3xl shadow-lg mt-4 mb-6 mr-1.5 overflow-hidden relative">
            <div className="absolute top-0 left-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-br-3xl px-6 py-3 ">
              <p className="text-white text-sm font-medium">
                Thành tích của bạn
              </p>
            </div>

            <div className="p-6 pt-8">
              <div className="flex justify-center mb-4 mt-6">
                <div className="relative w-20 h-30 flex items-center justify-center">
                  <Image
                    src="https://res.cloudinary.com/dirr7ovdh/image/upload/v1761541691/crystal_x9l493.svg"
                    alt="crown"
                    width={80}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <p className="text-center text-gray-700 text-sm mb-3">
                Hiện tại bạn đã
                <br />
                tích lũy được
              </p>
              <p className="text-center text-5xl font-bold text-orange-500 mb-2">
                {formatNumberAbbreviation(myProfile.quartz || 0)}
              </p>
              <p className="text-center text-xs text-orange-400 uppercase tracking-wide font-medium">
                Tinh thể thạch anh
              </p>
            </div>
          </div>

          {/* Rank Card */}
          <div className="flex justify-center">
            <div className="rounded-t-3xl p-8 text-white text-center">
              <p className="text-sm font-medium mb-4">Vị trí của bạn</p>
              <p className="text-6xl font-bold">
                {leaderboardMyRank?.quartz?.rank
                  ? formatNumberAbbreviation(leaderboardMyRank?.quartz?.rank)
                  : "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        {/* Top 3 Banner */}
        <div className="bg-[#4D42CA] rounded-3xl pt-16 px-8 pb-8 mb-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 h-full">
            <Image
              src={dino}
              alt="dino mascot"
              width={1536}
              height={1024}
              className="h-full w-auto object-contain"
            />
          </div>

          <div className="flex items-end justify-center gap-8 relative z-10 pl-[200px]">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-blue-400 relative">
                {isValidUrl(leaderboardData[1]?.avatarUrl) &&
                !leaderboardData[1]?.avatarUrl.endsWith(".svg") ? (
                  <Image
                    src={leaderboardData[1].avatarUrl}
                    alt="avatar"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUserAlt}
                      className="w-10 h-10 text-gray-400"
                    />
                  </div>
                )}
                <Image
                  src={top2}
                  alt="polygon 4"
                  width={48}
                  height={48}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <p className="text-white font-semibold mb-2">
                {leaderboardData[1]?.name}
              </p>
              <div className="bg-blue-500 rounded-full px-4 py-1 text-white text-sm font-bold">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 border-4 border-yellow-400 relative">
                {isValidUrl(leaderboardData[0]?.avatarUrl) &&
                !leaderboardData[0]?.avatarUrl.endsWith(".svg") ? (
                  <Image
                    src={leaderboardData[0].avatarUrl}
                    alt="avatar"
                    width={112}
                    height={112}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUserAlt}
                      className="w-10 h-10 text-gray-400"
                    />
                  </div>
                )}
                <Image
                  src={top1}
                  alt="crown"
                  width={64}
                  height={64}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <p className="text-white font-bold mb-2">
                {leaderboardData[0]?.name}
              </p>
              <div className="bg-yellow-500 rounded-full px-5 py-1 text-white text-base font-bold">
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-pink-400 relative">
                {isValidUrl(leaderboardData[2]?.avatarUrl) &&
                !leaderboardData[2]?.avatarUrl.endsWith(".svg") ? (
                  <Image
                    src={leaderboardData[2].avatarUrl}
                    alt="avatar"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUserAlt}
                      className="w-10 h-10 text-gray-400"
                    />
                  </div>
                )}
                <Image
                  src={top3}
                  alt="polygon 5"
                  width={48}
                  height={48}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <p className="text-white font-semibold mb-2">
                {leaderboardData[2]?.name}
              </p>
              <div className="bg-pink-500 rounded-full px-4 py-1 text-white text-sm font-bold">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="grid grid-cols-2 gap-4">
          {leaderboardData
            .filter((_, index) => index >= 3)
            .map((user, index) => (
              <div
                key={user._id}
                className={`bg-gradient-to-r ${getRandomColor(
                  index,
                )} rounded-2xl px-6 py-4 flex items-center justify-between shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-xl text-gray-700">
                    {index + 4}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    {isValidUrl(user?.avatarUrl) &&
                    !user?.avatarUrl.endsWith(".svg") ? (
                      <Image
                        src={user.avatarUrl}
                        alt="avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faUserAlt}
                          className="w-10 h-10 text-gray-400"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-white font-semibold">
                    {user.name.length === 0 ? "Không có tên" : user.name}
                  </p>
                </div>
                <p className="text-white font-bold text-lg">
                  {formatNumberAbbreviation(user.quartz)}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
