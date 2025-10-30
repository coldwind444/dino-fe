"use client";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import ProfilePopup from "@/components/ProfilePopup/ProfilePopup";

interface Topic {
  name: string;
  brand: string;
}

interface LessonsData {
  [grade: string]: Topic[];
}

interface LessonClientProps {
  lessons?: LessonsData;
}

export default function LessonClient({ lessons }: LessonClientProps) {
  const username = "Tân";
  const egg = "assets/landing/egg_normal";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [currentPage, setCurrentPage] = useState(0);

  const topics = lessons?.[selectedGrade] || [];
  const SAMPLE_THUMB_PATH = "/assets/landing/egg_normal.png";
  const TOPICS_PER_PAGE = 4;
  const totalPages = Math.ceil(topics.length / TOPICS_PER_PAGE);
  const currentTopics = topics.slice(
    currentPage * TOPICS_PER_PAGE,
    (currentPage + 1) * TOPICS_PER_PAGE
  );

  const colors = ["#23BEAA"];

  const getRandomColor = (index: number) => {
    return colors[index % colors.length];
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex gap-6 p-6">
        <aside className="w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-2xl p-6 text-white mb-6 relative overflow-hidden flex items-center justify-center">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#5ED9C6] bg-opacity-10 rounded-full"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#A8EDEA] bg-opacity-15 rounded-full"></div>
            <div className="absolute top-2 left-2 w-8 h-8 bg-[#E6FCF9] bg-opacity-20 rounded-full"></div>

            <h3 className="text-lg font-semibold relative z-10 text-center ml-6">
              Chương trình lớp {selectedGrade}
            </h3>
          </div>

          <div className="bg-[#5ED9C6] rounded-3xl  relative">
            {/* Progress Card */}
            <div className="mb-4 bg-white rounded-[20px] border-[1px] border-[#1ABC9C] p-4 -translate-x-[3px]  w-full">
              <div className="flex flex-col items-center">
                <Image
                  src={`/${egg}.png`}
                  alt="egg progress"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain mb-2"
                />
                <div className="text-xs text-gray-700 font-medium mb-1">
                  Tiến trình hiện tại
                </div>
                <div className="text-4xl font-bold text-[#1ABC9C] mb-3">
                  40%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#1ABC9C] h-2 rounded-full transition-all"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="mb-4 bg-white rounded-[20px] border-[1px] border-[#1ABC9C] p-5 -translate-x-[3px] -translate-y-[3px] w-full">
              <div className="text-center text-sm text-gray-700 font-medium mb-4">
                Đã tích lũy được từ lớp học này
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-15 h-15 flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/dirr7ovdh/image/upload/v1761541691/crystal_x9l493.svg"
                    alt="crystal"
                    width={60}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-[#F39C12] leading-none mb-1">
                    202
                  </div>
                  <div className="text-xs text-[#F39C12] font-bold uppercase tracking-wide">
                    Tinh thể thạch anh
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className=" rounded-3xl p-5">
              <div className="space-y-2 text-sm text-white font-bold">
                <div>
                  Số chủ đề đã học: <strong>4</strong>
                </div>
                <div>
                  Chủ đề học gần nhất: <strong>4</strong>
                </div>
                <div>
                  Số chủ đề đã mở khóa: <strong>{topics.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Featured Topic */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#1ABC9C] rounded-3xl translate-x-[4px] translate-y-[4px]" />
            <div className="relative bg-gradient-to-br from-[#E8F8F5] to-[#D5F4EC] rounded-3xl border-[3px] border-[#1ABC9C] p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex justify-start pl-8">
                  <div className="w-40 h-40 flex items-center justify-center">
                    <Image
                      src={topics[0]?.brand || SAMPLE_THUMB_PATH}
                      alt="featured topic"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="inline-block bg-[#A7F3D0] text-[#059669] px-5 py-2 rounded-full text-sm font-medium mb-4">
                    Chủ đề 1
                  </div>
                  <h2 className="text-xl font-bold text-[#1ABC9C] mb-6 px-4">
                    {topics[0]?.name || "Chủ đề đầu tiên"}
                  </h2>
                  <button className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors relative">
                    <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-white/40" />
                    Bắt đầu
                    <FontAwesomeIcon icon={faPlay} className="text-sm" />
                  </button>
                </div>
                <div className="flex-1"></div>
              </div>
            </div>
          </div>

          {/* Topic Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {currentTopics.map((topic, index) => {
              const globalIndex = currentPage * TOPICS_PER_PAGE + index;
              return (
                <div key={index} className="relative">
                  <div
                    className="absolute inset-0 rounded-3xl translate-x-[4px] translate-y-[4px]"
                    style={{ backgroundColor: getRandomColor(index) }}
                  />
                  <div
                    className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border-[3px] flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg p-6 h-full"
                    style={{ borderColor: getRandomColor(index) }}
                  >
                    <div className="w-32 h-32 mb-6 flex items-center justify-center">
                      <Image
                        src={topic.brand || SAMPLE_THUMB_PATH}
                        alt={topic.name}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                    <div className="inline-block bg-[#1ABC9C] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                      Chủ đề {globalIndex + 1}
                    </div>
                    <h3 className="text-base font-bold text-[#1ABC9C] text-center leading-snug px-2">
                      {topic.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="w-12 h-12 rounded-full border-2 border-[#1ABC9C] flex items-center justify-center text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1ABC9C]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="w-12 h-12 rounded-full border-2 border-[#1ABC9C] flex items-center justify-center text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1ABC9C]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
