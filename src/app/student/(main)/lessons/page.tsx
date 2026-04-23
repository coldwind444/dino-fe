"use client";

import { useLessonStore } from "@/stores/lessonStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCrown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {
  GradeProgressResponse,
  GradeResponse,
  TermResponse,
  TopicResponse,
  UserProfileResponse,
} from "@/types";
import {
  getGrades,
  getGradeProgress,
  getTopics,
  getUserProfile,
  getRecentTopics,
  PaginationTopicResponse,
  getOngoingTerm,
  getNoCompletedTopics,
} from "@/apis";
import { formatNumberAbbreviation } from "@/helpers/utils";

const TOPICS_PER_PAGE = 4;

export default function LessonsPage() {
  const router = useRouter();
  const { gradeLevel } = useLessonStore();

  // Data state
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [ongoingTerm, setOngoingTerm] = useState<TermResponse | null>(null);
  const [topicsPgRes, setTopicsPgRes] =
    useState<PaginationTopicResponse | null>(null);
  const [myProfile, setMyProfile] = useState<UserProfileResponse | null>();
  const [gradeProgress, setGradeProgress] =
    useState<GradeProgressResponse | null>();
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);
  const [noCompletedTopics, setNoCompletedTopics] = useState(0);
  const [firstTopic, setFirstTopic] = useState<TopicResponse | null>(null);

  // Loading state
  const [profileLoading, setProfileLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Handle
  const handleChangePage = (isNext: boolean) => {
    if (isNext) {
      if (currentPage < (topicsPgRes?.pagination.totalPages || 1)) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const navigateToLecture = (topicId: string) => {
    router.push(`/student/adventure/${gradeLevel}/${topicId}`);
  };

  // Init fetch grade and user data
  useEffect(() => {
    let ignore = false;

    const fetchInitialData = async () => {
      setProfileLoading(true);
      try {
        const [ongoingTerm, grades, profile] = await Promise.all([
          getOngoingTerm(),
          getGrades({ level: gradeLevel }),
          getUserProfile(),
        ]);
        if (!ignore) {
          setOngoingTerm(ongoingTerm);
          setGrade(grades[0]);
          setMyProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      ignore = true;
    };
  }, [gradeLevel]);

  // Fetch related data when grade is set
  useEffect(() => {
    if (!grade || !ongoingTerm) return;

    let ignore = false;

    const fetchLessonData = async () => {
      setDataLoading(true);
      try {
        const [topics, progress, recent, noCompletedTopics] = await Promise.all(
          [
            getTopics({
              gradeId: grade._id,
              termId: ongoingTerm._id,
              limit: TOPICS_PER_PAGE,
              page: currentPage,
            }),
            getGradeProgress(grade._id),
            getRecentTopics(1),
            getNoCompletedTopics(),
          ],
        );

        if (!ignore) {
          if (topics.pagination.page === 1) {
            setFirstTopic(topics.items[0]);
          }
          setTopicsPgRes(topics);
          setGradeProgress(progress);
          setNoCompletedTopics(noCompletedTopics);

          if (recent?.length > 0 && recent[0]) {
            const filteredTopics = recent.filter(
              (t) => t.gradeId === grade._id,
            );
            setRecentTopic(filteredTopics[0]);
          } else {
            setRecentTopic(null);
          }
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchLessonData();

    return () => {
      ignore = true;
    };
  }, [grade, currentPage, ongoingTerm]);

  const isLoading = profileLoading || dataLoading;
  const isPremiumUser = myProfile?.premium?.isPremium || false;

  const topicsWithPremiumRequiredFlag = topicsPgRes?.items.map((topic) => {
    return { ...topic, premiumRequired: topic.isPremium && !isPremiumUser };
  });

  const featuredTopic = recentTopic || firstTopic;

  return (
    <div className="w-full min-h-screen">
      <div className="flex gap-6 p-6">
        <aside className="w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-2xl p-6 text-white mb-6 relative overflow-hidden flex items-center justify-center">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#5ED9C6] bg-opacity-10 rounded-full"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#A8EDEA] bg-opacity-15 rounded-full"></div>
            <div className="absolute -top-2 -left-2 w-10 h-10 bg-[#E6FCF9] bg-opacity-20 rounded-full"></div>

            <h3 className="text-lg font-semibold relative z-10 text-center ml-6">
              Chương trình lớp {gradeLevel || "---"}
            </h3>
          </div>

          <div className="bg-[#23BEAA] rounded-3xl relative">
            {/* Progress Card */}
            <div className="mb-4 bg-white rounded-[20px] border-[1px] border-[#23BEAA] p-4 -translate-x-[3px] w-full">
              <div className="flex flex-col items-center">
                {isLoading ? (
                  <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-2" />
                ) : (
                  grade && (
                    <Image
                      src={grade?.description || ""}
                      alt="progress"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain mb-2"
                    />
                  )
                )}
                <div className="text-[14px] text-gray-700 font-medium mb-1">
                  Tiến trình hiện tại
                </div>
                <div className="text-4xl font-bold text-[#23BEAA] mb-3">
                  {isLoading ? "---%" : `${Math.floor(gradeProgress?.percent || 0)}%`}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#23BEAA] h-2 rounded-full transition-all"
                    style={{
                      width: `${isLoading ? 0 : Math.floor(gradeProgress?.percent || 0)}%`,
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
                    {isLoading ? "---" : formatNumberAbbreviation(myProfile?.quartz || 0)}
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
                  Số chủ đề đã học: <strong>{isLoading ? "---" : noCompletedTopics}</strong>
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
                    {isLoading ? (
                      <div className="w-32 h-32 bg-gray-200 rounded-3xl animate-pulse" />
                    ) : (
                      featuredTopic && (
                        <Image
                          src={featuredTopic.description}
                          alt="featured topic"
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="inline-block bg-[#C4F1EB] text-[#1DA492] text-[18px] font-bold px-5 py-2 rounded-full text-sm mb-4">
                    {`Chủ đề ${isLoading ? "---" : featuredTopic?.level || "---"}`}
                  </div>
                  <h2 className="text-xl font-bold text-[#1ABC9C] mb-6 px-4">
                    {isLoading ? "---" : featuredTopic?.title || "---"}
                  </h2>
                  <button
                    className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !featuredTopic}
                    onClick={() =>
                      featuredTopic && navigateToLecture(featuredTopic._id)
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
            {isLoading
              ? // Skeleton loaders
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative h-[320px]">
                    <div className="absolute inset-0 rounded-3xl translate-x-[4px] translate-y-[4px] bg-gray-200" />
                    <div className="relative h-full bg-white rounded-3xl border-[3px] border-gray-200 flex flex-col items-center justify-center p-6 animate-pulse">
                      <div className="w-32 h-32 bg-gray-200 rounded-2xl mb-6" />
                      <div className="w-24 h-8 bg-gray-200 rounded-full mb-4" />
                      <div className="w-32 h-4 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))
              : topicsWithPremiumRequiredFlag?.map((topic, index) => {
                  if (topic.premiumRequired) {
                    return (
                      <div
                        key={index}
                        className="relative h-[320px] transition-all hover:scale-105 cursor-pointer"
                        onClick={() => router.push("/student/upgrade")}
                      >
                        <div className="absolute inset-0 rounded-3xl translate-x-[4px] translate-y-[4px] bg-[#FF9600]" />
                        <div
                          className="relative h-full bg-white rounded-3xl border-[3px] border-[#FF9600] 
                                    flex flex-col gap-6 items-center justify-center p-6"
                        >
                          <div className="mb-6">
                            <FontAwesomeIcon
                              icon={faCrown}
                              className="text-[#FF9600] text-6xl"
                            />
                          </div>
                          <p className="text-base font-bold text-[#FF9600] text-center mb-6 px-2 cursor-pointer">
                            {`Bạn cần nâng cấp tài khoản để mở khóa chủ đề ${topic.level}.`}
                          </p>
                        </div>
                      </div>
                    );
                  }

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
              disabled={isLoading || currentPage === 1}
              onClick={() => handleChangePage(false)}
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
              disabled={
                isLoading ||
                currentPage >= (topicsPgRes?.pagination.totalPages || 1)
              }
              onClick={() => handleChangePage(true)}
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
