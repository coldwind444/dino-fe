"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import mission from "../../../../../public/assets/mission/mission.webp";
import { AchievementResponse } from "@/types";
import { claimMissionReward, getMyMission } from "@/apis/mission";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faClose } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { APIError } from "@/apis/config";

export default function MissionPage() {
  // Data state
  const [achievements, setAchievements] = useState<AchievementResponse[]>();

  // UI state
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"incomplete" | "complete">(
    "incomplete",
  );
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  // Functions
  const buildGoalStringContent = (achievement: AchievementResponse) => {
    switch (achievement.unitType) {
      case "lecture":
        return `Hoàn thành ${achievement.goal} bài học`;
      case "exercise":
        return `Làm ${achievement.goal} bài tập`;
      case "battle":
        return `Tham gia ${achievement.goal} trận đấu`;
      case "arena":
        return `Tham gia ${achievement.goal} kì đấu trường`;
      case "daily_login":
        return `Đăng nhập ${achievement.goal} lần/ngày`;
      case "minigame":
        return `Chơi ${achievement.goal} trò chơi`;
      default:
        return "";
    }
  };

  const claimMission = async (
    achievementId: string,
    mappingId: string,
    reward: number,
  ) => {
    try {
      setClaimingId(mappingId);
      await claimMissionReward(achievementId);

      setRewardAmount(reward);
      setShowRewardModal(true);

      // Refresh missions after claiming
      const data = await getMyMission();
      setAchievements(data);
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message);
      }
    } finally {
      setClaimingId(null);
    }
  };

  // Effects
  useEffect(() => {
    let ignore = false;

    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await getMyMission();
        if (!ignore) setAchievements(data);
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredAchievements = achievements?.filter((m) =>
    activeTab === "complete" ? m.claimed : !m.claimed,
  );

  if (loading) {
    return <ScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* BODY */}
      <main className="flex flex-1 p-8 space-x-8 max-h-[800px]">
        <div className="w-[400px] flex flex-col">
          <div
            className="rounded-t-2xl px-[40px] py-6 text-white flex flex-col items-center justify-center border-[3px]"
            style={{ backgroundColor: "#1B2657", borderColor: "#1B2657" }}
          >
            <h2 className="font-roboto text-[25px] font-bold text-center">
              NHIỆM VỤ HÀNG NGÀY
            </h2>
            <p className="font-roboto text-[15px] font-medium text-center mt-2">
              Làm nhiệm vụ và thu thập <br />
              thật nhiều thạch anh nào!
            </p>
          </div>

          <div className="rounded-b-2xl h-[500px] flex items-center justify-center relative overflow-hidden">
            <Image src={mission} alt="" priority fill />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold uppercase">
              Danh sách nhiệm vụ
            </h3>
            <div className="flex bg-gray-100 rounded-full py-1 px-2 border-2 border-teal-500/20">
              <button
                onClick={() => setActiveTab("incomplete")}
                className={clsx(
                  "px-5 py-2 rounded-full font-bold transition-all duration-200 cursor-pointer",
                  activeTab === "incomplete"
                    ? "bg-teal-500 text-white shadow-md transform scale-105"
                    : "text-gray-500 hover:text-teal-500",
                )}
              >
                Chưa hoàn thành
              </button>
              <button
                onClick={() => setActiveTab("complete")}
                className={clsx(
                  "px-5 py-2 rounded-full font-bold transition-all duration-200 cursor-pointer",
                  activeTab === "complete"
                    ? "bg-teal-500 text-white shadow-md transform scale-105"
                    : "text-gray-500 hover:text-teal-500",
                )}
              >
                Đã hoàn thành
              </button>
            </div>
          </div>

          <div className="space-y-3 h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredAchievements && filteredAchievements.length > 0 ? (
              filteredAchievements.map((m) => (
                <div
                  key={m._id}
                  className="relative bg-[#A8EDEA] rounded-[30px] flex items-center justify-between pl-8 pr-4 py-6 shadow-sm overflow-hidden h-[110px] flex-shrink-0"
                >
                  <div
                    className="absolute inset-y-0 bg-teal-500 w-[50%]"
                    style={{
                      left: "42%",
                      clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)",
                    }}
                  ></div>

                  <div
                    className="absolute inset-y-0 right-0 bg-[#A8EDEA] w-[40%]"
                    style={{
                      left: "67%",
                      clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)",
                    }}
                  ></div>

                  <div className="relative z-10 w-[35%]">
                    <h1 className="font-bold text-teal-800 text-lg truncate mb-1">
                      {m.title}
                    </h1>
                    <p className="font-medium text-teal-700 text-sm">
                      {buildGoalStringContent(m)}
                    </p>
                    <div className="mt-2 w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-600 h-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (m.progress / m.goal) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-[12px] font-bold text-teal-600 mt-1">
                      Tiến trình: {m.progress}/{m.goal}
                    </p>
                  </div>

                  <div className="absolute left-[57%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                    <p className="font-roboto text-[16px] font-bold text-white mb-1">
                      Phần thưởng
                    </p>

                    <div className="flex items-center justify-center space-x-2">
                      <Image
                        src="https://res.cloudinary.com/dirr7ovdh/image/upload/f_auto,q_auto/v1761541691/crystal_x9l493.svg"
                        alt="Crystal"
                        width={24}
                        height={24}
                        priority
                      />
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#FFE566" }}
                      >
                        {m.reward}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-end">
                    <button
                      onClick={() =>
                        claimMission(m.achievementId, m._id, m.reward)
                      }
                      disabled={claimingId !== null || m.claimed || !m.finished}
                      className={clsx(
                        "relative text-white font-bold w-[120px] py-3 rounded-[30px] transition uppercase shadow-lg cursor-pointer flex items-center justify-center gap-2",
                        m.claimed
                          ? "bg-gray-400 cursor-not-allowed"
                          : !m.finished
                            ? "bg-gray-300 cursor-not-allowed opacity-70"
                            : "bg-[#FF7F50] hover:bg-[#FFA76B]",
                      )}
                    >
                      {claimingId === m._id ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <>
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/40" />
                          <span className="absolute bottom-2 left-3 w-3 h-3 rounded-full bg-white/30" />
                          {m.claimed ? "Đã nhận" : "Nhận"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200">
                <p className="text-xl font-medium">Không có nhiệm vụ nào</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={clsx(
              "fixed inset-0 z-[100] flex items-center justify-center",
              !showRewardModal && "hidden",
            )}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowRewardModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 20 }}
              className="relative z-10 w-[600px] flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowRewardModal(false)}
                className="absolute -top-10 -right-10 text-white/80 hover:text-white text-3xl transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faClose} />
              </button>

              {/* Text */}
              <h2 className="text-white text-3xl font-bold text-center mb-8 drop-shadow-lg">
                Chúc mừng bạn đã nhận được <br />
                <span className="text-orange-400 text-5xl flex items-center gap-4 mt-4">
                  <Image
                    src="https://res.cloudinary.com/dirr7ovdh/image/upload/f_auto,q_auto/v1761541691/crystal_x9l493.svg"
                    alt="Crystal"
                    width={48}
                    height={48}
                    priority
                  />
                  {rewardAmount}
                  <span className="text-white text-3xl font-bold">
                    thạch anh
                  </span>
                </span>{" "}
              </h2>

              {/* Lottie Animation Iframe */}
              <div className="w-[500px] h-[500px] bg-transparent flex items-center justify-center">
                <iframe
                  src="https://lottie.host/embed/71b1f83a-1673-4146-b8df-d0cfc6fe3d2f/QfO0slGk89.lottie"
                  className="w-full h-full border-none pointer-events-none"
                  title="Reward Animation"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23beaa;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1da492;
        }
      `}</style>
    </div>
  );
}
