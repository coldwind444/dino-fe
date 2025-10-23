"use client";
import { useState } from "react";
import Image from "next/image";
import mission from "../../../../../public/assets/mission/mission.png";
const trophy = "/assets/home/trophy.png";
const missions = [
  { id: 1, progress: 230, goal: 500, reward: 1300 },
  { id: 2, progress: 230, goal: 500, reward: 1200 },
  { id: 3, progress: 230, goal: 500, reward: 1200 },
  { id: 4, progress: 230, goal: 500, reward: 1200 },
];

export default function MissionPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-white  flex-col">
      {/* BODY */}
      <main className="flex flex-1 p-8 space-x-8 max-h-[700px]">
        <div className="w-[400px] flex flex-col">
          <div
            className="rounded-t-2xl px-[40px] py-6 text-white flex flex-col items-center justify-center"
            style={{ backgroundColor: "#1B2657" }}
          >
            <h2 className="font-roboto text-[25px] font-bold text-center">
              NHIỆM VỤ HÀNG NGÀY
            </h2>
            <p className="font-roboto text-[15px]  font-bold text-center mt-2">
              Làm nhiệm vụ <br />
              và thu thập thật nhiều thạch anh nào!
            </p>
          </div>

          <div
            className="rounded-b-2xl h-[600px] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${mission.src})` }}
          ></div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">DANH SÁCH NHIỆM VỤ</h3>
          <div className="space-y-4">
            {missions.map((m) => (
              <div
                key={m.id}
                className="relative bg-[#A8EDEA] rounded-[30px] flex items-center justify-between pl-8 pr-4 py-6 shadow-sm overflow-hidden h-[100px]"
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

                <div className="relative z-10">
                  <p className="font-semibold text-teal-700 text-base">
                    Thu thập được {m.goal} thạch anh từ Bài học.
                  </p>
                  <p className="text-sm text-teal-600 mt-1">
                    Tiến trình: {m.progress}/{m.goal}
                  </p>
                </div>

                <div className="absolute left-[57%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                  <p
                    className={`font-roboto text-[20px] font-bold text-white mb-1`}
                  >
                    Phần thưởng
                  </p>

                  <div className="flex items-center justify-center space-x-2">
                    <Image src={trophy} alt="Trophy" width={28} height={28} />
                    <p
                      className="text-3xl font-bold"
                      style={{ color: "#FFE566" }}
                    >
                      {m.reward}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-end">
                  <button
                    className="relative text-white font-bold w-[100px] py-3 rounded-[30px] transition uppercase shadow-lg"
                    style={{ backgroundColor: "#FF7F50" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#FFA76B")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#FF7F50")
                    }
                  >
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/40" />
                    <span className="absolute bottom-2 left-3 w-3 h-3 rounded-full bg-white/30" />
                    Nhận
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-purple-100 rounded-full hover:bg-purple-200 hover:scale-105 hover:shadow-md transition transform"
            >
              Trước đó
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 hover:scale-105 hover:shadow-md transition transform"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
