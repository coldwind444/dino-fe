"use client";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GradeProgressResponse, GradeResponse, TopicResponse } from "@/types";
import { PaginationTopicResponse } from "@/apis";
import { useLessonStore } from "@/stores/lessonStore";

interface LessonClientProps {
  topics: PaginationTopicResponse;
  grade: GradeResponse;
  userQuartz: number;
  gradeProgress: GradeProgressResponse;
  noUnlocked: number;
  noComplete: number;
  recentTopic?: TopicResponse;
  firstTopic?: TopicResponse;
  changePage: (isNext: boolean) => void;
}

export default function LessonView({
  topics,
  grade,
  userQuartz,
  gradeProgress,
  noUnlocked,
  noComplete,
  recentTopic,
  firstTopic,
  changePage,
}: LessonClientProps) {
  const router = useRouter();
  const { gradeLevel } = useLessonStore();

  const navigateToLecture = (topicId: string) => {
    router.push(`/student/adventure/${gradeLevel}/${topicId}`);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex gap-6 p-6">
        <aside className="w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-2xl p-6 text-white mb-6 relative overflow-hidden flex items-center justify-center">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#5ED9C6] bg-opacity-10 rounded-full"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#A8EDEA] bg-opacity-15 rounded-full"></div>
            <div className="absolute -top-2 -left-2 w-10 h-10 bg-[#E6FCF9] bg-opacity-20 rounded-full"></div>

            <h3 className="text-lg font-semibold relative z-10 text-center ml-6">
              Chương trình lớp {gradeLevel}
            </h3>
          </div>

          <div className="bg-[#23BEAA] rounded-3xl relative">
            {/* Progress Card */}
            <div className="mb-4 bg-white rounded-[20px] border-[1px] border-[#23BEAA] p-4 -translate-x-[3px] w-full">
              <div className="flex flex-col items-center">
                {grade && (
                  <Image
                    src={grade?.description || ""}
                    alt="progress"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain mb-2"
                  />
                )}
                <div className="text-[14px] text-gray-700 font-medium mb-1">
                  Tiến trình hiện tại
                </div>
                <div className="text-4xl font-bold text-[#23BEAA] mb-3">
                  {Math.floor(gradeProgress?.percent || 0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#23BEAA] h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.floor(gradeProgress?.percent || 0)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="mb-4 flex items-center flex-col justify-center gap-[15px] bg-white rounded-[20px] border-[1px] border-[#1ABC9C] p-5 -translate-x-[3px] -translate-y-[3px] w-full h-[170px]">
              <div className="text-center text-[15px] text-gray-500 font-bold mb-4">
                TỔNG THẠCH ANH ĐANG CÓ
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-15 h-15 flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/dirr7ovdh/image/upload/v1761541691/crystal_x9l493.svg"
                    alt="crystal"
                    width={70}
                    height={70}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-4xl font-bold text-[#FF9600] leading-none mb-1">
                    {userQuartz}
                  </div>
                  <div className="text-xs text-[#FF9600] font-bold uppercase tracking-wide">
                    Tinh thể thạch anh
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className=" rounded-3xl p-5 h-[150px]">
              <div className="space-y-2 text-sm text-white font-bold">
                <div>
                  Số chủ đề đã học: <strong>{noComplete}</strong>
                </div>
                <div>
                  Số chủ đề đã mở khóa:{" "}
                  <strong>{`${noUnlocked}/${topics?.pagination.total}`}</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Featured Topic */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#23BEAA] rounded-3xl translate-x-[4px] translate-y-[4px]" />
            <div className="relative bg-[#F3FFFD] rounded-3xl border-[3px] border-[#23BEAA] p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex justify-start pl-8">
                  <div className="w-40 h-40 flex items-center justify-center">
                    {(recentTopic || firstTopic) && (
                      <Image
                        src={
                          recentTopic
                            ? recentTopic?.description
                            : firstTopic?.description || ""
                        }
                        alt="featured topic"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="inline-block bg-[#C4F1EB] text-[#1DA492] text-[18px] font-bold px-5 py-2 rounded-full text-sm mb-4">
                    {`Chủ đề ${recentTopic ? recentTopic?.level : firstTopic?.level}`}
                  </div>
                  <h2 className="text-xl font-bold text-[#1ABC9C] mb-6 px-4">
                    {recentTopic ? recentTopic?.title : firstTopic?.title}
                  </h2>
                  <button
                    className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors relative cursor-pointer"
                    onClick={() =>
                      navigateToLecture(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                        recentTopic ? recentTopic?._id : firstTopic?._id!,
                      )
                    }
                  >
                    <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-white/40" />
                    {recentTopic ? "Tiếp tục" : "Bắt đầu"}
                    <FontAwesomeIcon icon={faPlay} className="text-sm" />
                  </button>
                </div>
                <div className="flex-1"></div>
              </div>
            </div>
          </div>

          {/* Topic Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {topics?.items?.map((topic, index) => {
              return (
                <div
                  key={index}
                  className="relative h-[320px] transition-all hover:scale-105"
                  onClick={() => navigateToLecture(topic._id)}
                >
                  <div className="absolute inset-0 rounded-3xl translate-x-[4px] translate-y-[4px] bg-[#23BEAA]" />
                  <div
                    className="relative h-full bg-[#F3FFFD] rounded-3xl border-[3px] border-[#23BEAA] 
                              flex flex-col items-center justify-center cursor-pointer p-6"
                  >
                    <div className="w-32 h-32 mb-6 flex items-center justify-center">
                      <Image
                        src={topic.description}
                        alt="topic image"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                    <div className="inline-block bg-[#1ABC9C] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                      Chủ đề {topic.level}
                    </div>
                    <h3 className="text-base font-bold text-[#1ABC9C] text-center leading-snug px-2">
                      {topic.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => changePage(false)}
              className="cursor-pointer w-12 h-12 rounded-full border-2 border-[#1ABC9C] flex items-center justify-center text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1ABC9C]"
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
              onClick={() => changePage(true)}
              className="cursor-pointer w-12 h-12 rounded-full border-2 border-[#1ABC9C] flex items-center justify-center text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1ABC9C]"
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
