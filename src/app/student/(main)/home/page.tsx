"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { fredoka } from "@/app/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcaseClock,
  faChalkboard,
  faFlaskVial,
  faPlay,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLessonStore } from "@/stores/lessonStore";
import { TimeCard } from "@/components/TimeCard/TimeCard";
import EntranceTestPopup from "@/components/EntranceTestPopup/EntranceTestPopup";
import {
  getAssessmentResult,
  getCompletedTopics,
  getGradeById,
  getGrades,
  getPublishedAssessmentByGradeId,
  getRecentTopics,
  getRecommendedTopicByGradeId,
  getUserProfile,
} from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import TopicRecommendPopup from "@/components/TopicRecommendPopup/TopicRecommendPopup";
import { TopicResponse } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const trophy = "/assets/home/trophy.png";

export default function StudentHome() {
  const router = useRouter();

  // UI States
  const { gradeLevel, setGradeLevel } = useLessonStore();
  const [showAssessmentFloatButton, setShowAssessmentFloatButton] =
    useState(false);
  const [isTopicRecommendModalOpened, setIsTopicRecommendModalOpened] =
    useState(false);
  const [isEntranceTestModalOpened, setIsEntranceTestModalOpened] =
    useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Data States
  const [username, setUsername] = useState("");
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);
  const [completedTopic, setCompletedTopics] = useState<TopicResponse[]>([]);
  const [recommendedTopic, setRecommendedTopic] =
    useState<TopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Functions
  const closeEntranceTestModal = () => {
    setIsEntranceTestModalOpened(false);
    if (isInitialLoad) {
      setIsTopicRecommendModalOpened(true);
      setIsInitialLoad(false);
    }
  };

  const closeTopicRecommendModal = () => {
    setIsTopicRecommendModalOpened(false);
  };

  const startEntranceTest = () => {
    setIsEntranceTestModalOpened(false);
    setIsInitialLoad(false);
    router.push(`/student/entrance-test`);
  };

  // Effects
  useEffect(() => {
    let ignore = false;
    const fetchTopics = async () => {
      if (!gradeLevel) return;
      try {
        setIsLoading(true);
        const [recentTopicsRes, compTopicsRes, gradeRes] = await Promise.all([
          getRecentTopics(10),
          getCompletedTopics(10),
          getGrades({ level: gradeLevel }),
        ]);

        if (ignore) return;

        // Fetch recent studied topics
        if (
          recentTopicsRes &&
          recentTopicsRes.length > 0 &&
          gradeRes &&
          gradeRes.length > 0
        ) {
          const filteredTopics = recentTopicsRes.filter(
            (t) => t.gradeId === gradeRes[0]._id,
          );
          setRecentTopic(filteredTopics[0] || null);
        }

        // Fetch completed topics
        if (
          compTopicsRes &&
          compTopicsRes.length > 0 &&
          gradeRes &&
          gradeRes.length > 0
        ) {
          const filteredTopics = compTopicsRes.filter(
            (t) => t.gradeId === gradeRes[0]._id,
          );
          setCompletedTopics(filteredTopics);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
    return () => {
      ignore = true;
    };
  }, [gradeLevel]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // User data
        const userRes = await getUserProfile();
        const lastname = userRes.name.trim().split(/\s+/).pop() ?? "";
        setUsername(lastname);

        // Grade data
        if (userRes.gradeId) {
          const [grade, recommend] = await Promise.all([
            getGradeById(userRes.gradeId),
            getRecommendedTopicByGradeId(userRes.gradeId),
          ]);
          if (!ignore) {
            setRecommendedTopic(recommend);
            if (grade && (gradeLevel.length === 0 || !gradeLevel))
              setGradeLevel(grade.level.toString());
          }
        }

        // Entrance test data
        const entranceTest = await getPublishedAssessmentByGradeId(
          userRes.gradeId,
        );
        if (entranceTest) {
          const result = await getAssessmentResult(
            entranceTest._id,
            userRes._id,
          );
          if (
            result &&
            (result.status === "submitted" || result.status === "graded")
          ) {
            setShowAssessmentFloatButton(false);
          } else {
            setShowAssessmentFloatButton(true);
            setIsEntranceTestModalOpened(true);
          }
        } else {
          setShowAssessmentFloatButton(false);
          setIsTopicRecommendModalOpened(true);
        }
      } catch (err) {
        console.log("Failed to fetch data.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading || !username) {
    return <ScreenLoader />;
  }

  return (
    <div className="w-screen min-h-screen p-6 sm:p-10 pl-[63px] pr-[69px] flex flex-col">
      {showAssessmentFloatButton && (
        <div
          className="absolute h-15 w-15 top-25 right-5 cursor-pointer hover:brightness-110 z-20"
          data-testid="assessment-float-btn"
          onClick={() => setIsEntranceTestModalOpened(true)}
        >
          {/* Ping circle */}
          <div className="absolute inset-0 m-auto h-12 w-12 bg-amber-500 rounded-full animate-ping z-10"></div>
          {/* Main circle */}
          <div
            className="absolute inset-0 m-auto h-15 w-15 bg-amber-500 rounded-full
                  flex items-center justify-center text-white shadow-2xl text-xl z-20"
          >
            <FontAwesomeIcon icon={faFlaskVial} />
          </div>
          {/* Red dot */}
          <div className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full border-2 border-white z-30"></div>
        </div>
      )}
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
                "flex items-center gap-6",
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
                        "bg-[#23BEAA] text-[20px] text-white font-bold flex items-center justify-center",
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
                          setGradeLevel(n.toString());
                        }}
                        className={clsx(
                          "relative aspect-square h-20 rounded-full flex items-center justify-center",
                          "font-bold text-3xl transition-all hover:scale-105 group cursor-pointer",
                          "bg-[#C4F1EC] text-[#23BEAA] hover:bg-[#23BEAA] hover:text-white group",
                          n.toString() === gradeLevel
                            ? "bg-amber-500 text-white"
                            : "",
                          fredoka.className,
                        )}
                      >
                        <span
                          className={clsx(
                            "absolute [clip-path:ellipse(50%_50%_at_50%_50%)] rounded-full h-[15px] w-[30px]",
                            "bg-[rgba(255,255,255)] bottom-0 right-0 mb-[13px] mr-[5px] -rotate-45",
                            "group-hover:bg-[rgba(255,255,255,0.5)]",
                            n.toString() === gradeLevel
                              ? "bg-[rgba(255,255,255,0.5)]"
                              : "",
                          )}
                        ></span>
                        <span
                          className={clsx(
                            "absolute [clip-path:ellipse(50%_50%_at_50%_50%)] rounded-full h-[10px] w-[20px]",
                            "bg-[rgba(255,255,255)] left-0 rotate-90 group-hover:bg-[rgba(255,255,255,0.5)]",
                            n.toString() === gradeLevel
                              ? "bg-[rgba(255,255,255,0.5)]"
                              : "",
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
      <div className="mt-8 mb-[50px] grid lg:grid-cols-12 gap-6 items-start w-full">
        {/* Lesson Card */}
        <div className="lg:col-span-5">
          {recentTopic ? (
            <div className="relative h-[400px]">
              <div className="absolute inset-0 bg-[#9B5DE5] rounded-[15px] translate-x-[4px] translate-y-[4px]" />
              <div
                className={clsx(
                  "relative h-full z-[1]",
                  "bg-[#F5EEFF] border-2 border-[#9B5DE5]",
                  "rounded-[15px] shadow-md flex flex-col p-6",
                )}
              >
                <span
                  className={clsx(
                    "absolute top-3.5 right-2.5",
                    "text-base bg-[#E9D5FF] text-[#6B21A8] font-medium",
                    "px-6 py-2 rounded-full",
                  )}
                >
                  Đang học
                </span>
                <div className="flex-1 flex items-center gap-6">
                  <div
                    className={clsx(
                      "flex-shrink-0 w-36 h-36 rounded-xl",
                      "flex items-center justify-center",
                    )}
                  >
                    <Image
                      src={recentTopic?.description || ""}
                      alt="rtopic"
                      width={120}
                      height={120}
                    />
                  </div>
                  <div className="flex-1 pl-4">
                    <h4 className="text-3xl font-bold">{recentTopic?.title}</h4>
                  </div>
                </div>
                <div
                  className={clsx(
                    "h-[70px] w-full rounded-[20px] bg-[#5E1C9A] overflow-hidden cursor-pointer",
                    "hover:opacity-90 group",
                  )}
                >
                  <div
                    className={clsx(
                      "flex items-center justify-center",
                      "h-full w-full relative bg-[#8A2BE2] text-white text-[22px] font-medium",
                      "rounded-tl-[50px] rounded-br-[60px] relative",
                    )}
                  >
                    Tiếp tục học
                    <span className="absolute top-0 right-0 mt-[7px] mr-[10px] h-[25px] aspect-square bg-[rgba(255,255,255,0.5)] rounded-full" />
                    <FontAwesomeIcon icon={faPlay} className="ml-3" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-[400px] rounded-[15px] border-2 border-gray-300 gap-2 flex flex-col items-center justify-center">
              <FontAwesomeIcon
                icon={faBriefcaseClock}
                className="text-gray-400 text-[50px]"
              />
              <label className="text-gray-400 text-xl font-medium">{`Bạn chưa học chủ đề nào của Lớp ${gradeLevel} gần đây.`}</label>
              <Link
                href="/student/lessons"
                className="text-blue-500 cursor-pointer font-medium hover:underline"
              >
                Học ngay nào !
              </Link>
            </div>
          )}
        </div>

        {/* Review Section */}
        <aside className="lg:col-span-5 w-fit h-fit">
          {completedTopic && completedTopic.length > 0 ? (
            <div>
              <h4 className="font-semibold">Ôn lại kiến thức</h4>
              <div className="mt-3 flex flex-col gap-3 h-full w-full overflow-y-auto pr-2">
                {completedTopic.map((val, idx) => (
                  <div
                    key={`review-${idx}`}
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-[20px]",
                      "bg-[#FFF6F6] border-2 border-[#FF9292] min-h-[80px] pl-[50px]",
                    )}
                  >
                    <div className="text-xl text-[#FF9292] font-medium">
                      {val.title}
                    </div>
                    <button
                      type="button"
                      aria-label="refresh"
                      className={clsx(
                        "w-10 h-10 rounded-full bg-white flex items-center justify-center",
                        "shadow-md border border-gray-200 hover:shadow-lg hover:scale-105",
                        "transition-all duration-200 group",
                      )}
                      onClick={() => {
                        router.push(
                          `/student/adventure/${gradeLevel}/${val._id}`,
                        );
                      }}
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
          ) : (
            <div className="h-[398px] w-[830px] rounded-[15px] border-2 border-gray-300 flex flex-col gap-2 items-center justify-center">
              <FontAwesomeIcon
                icon={faChalkboard}
                className="text-gray-400 text-[50px]"
              />
              <label className="text-gray-400 text-xl font-medium">
                {`Bạn chưa hoàn thành chủ đề nào của Lớp ${gradeLevel}.`}
              </label>
            </div>
          )}
        </aside>
      </div>
      {isEntranceTestModalOpened && (
        <EntranceTestPopup
          close={closeEntranceTestModal}
          start={startEntranceTest}
          lastname={username}
        />
      )}
      {isTopicRecommendModalOpened && (
        <TopicRecommendPopup
          topic={recommendedTopic}
          close={closeTopicRecommendModal}
        />
      )}
    </div>
  );
}
