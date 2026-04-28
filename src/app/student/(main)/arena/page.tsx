"use client";

import Image from "next/image";
import clsx from "clsx";
import arena from "../../../../../public/assets/arena/arena.webp";
import helmet from "../../../../../public/assets/arena/helmet.png";
import r1 from "../../../../../public/assets/arena/rule_1.webp";
import r2 from "../../../../../public/assets/arena/rule_2.webp";
import r3 from "../../../../../public/assets/arena/rule_3.webp";
import r4 from "../../../../../public/assets/arena/rule_4.webp";
import r5 from "../../../../../public/assets/arena/rule_5.webp";

import { roboto, baloo, patrick, patrick_sc } from "@/app/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faCaretLeft,
  faCaretRight,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArenaResponse,
  RankResponse,
  UserProfileResponse,
  LeaderboardResponse,
  MyPositionInRankResponse,
} from "@/types";
import {
  getUserProfile,
  getCurrentArena,
  getParticipations,
  getRankById,
  getArena,
  getArenaLeaderboard,
  getMyRank,
} from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { formatNumberAbbreviation } from "@/helpers/utils";
import { APIError } from "@/apis/config";

export default function Arena() {
  const router = useRouter();

  // Data states
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null,
  );
  const [userRank, setUserRank] = useState<RankResponse | null>(null);
  const [currentArena, setCurrentArena] = useState<ArenaResponse | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
    null,
  );
  const [previousArena, setPreviousArena] = useState<ArenaResponse | null>(
    null,
  );
  const [myRank, setMyRank] = useState<MyPositionInRankResponse | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [rulesShow, setRulesShow] = useState(false);
  const [rulesPage, setRulesPage] = useState(0);
  const [arenaDone, setArenaDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0 });

  // Functions
  const formatTimeTaken = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  useEffect(() => {
    let ignore = false;

    // Fetch initial data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userProfile = await getUserProfile();
        const myRank = await getMyRank();
        if (!ignore) {
          setUserProfile(userProfile);
          setMyRank(myRank);
        }

        // Fetch participation data
        const fetchParticipationData = async (currentArena: ArenaResponse) => {
          try {
            const userParticipation = await getParticipations({
              userId: userProfile._id,
              arenaId: currentArena._id,
            });
            if (!ignore && userParticipation.length === 1) {
              if (userParticipation[0].status === "submitted") {
                setArenaDone(true);
              }
            }
          } catch (error) {
            if (error instanceof APIError) {
              console.log(error.message);
            }
          }
        };

        // Fetch previous arena and leaderboard
        const fetchPreviousArenaAndLeaderboard = async (
          currentArena: ArenaResponse,
        ) => {
          try {
            // Get all arenas for the user's grade that is not ongoing
            const arenas = await getArena({
              gradeId: userProfile.gradeId,
              isActive: false,
            });

            // Filter the past arenas and sort by start time in descending order
            const endArenas = arenas
              .filter((arena) => arena.endTime <= currentArena.startTime)
              .sort((a, b) => b.startTime.localeCompare(a.startTime));

            // Get the most recent past arena
            const previousArena = endArenas[0];

            if (!ignore && previousArena) {
              setPreviousArena(previousArena);
              try {
                const leaderboard = await getArenaLeaderboard({
                  arenaId: previousArena._id,
                  limit: 20,
                });
                setLeaderboard(leaderboard);
              } catch (error) {
                if (error instanceof APIError) {
                  console.log(error.message);
                }
              }
            }
          } catch (error) {
            if (error instanceof APIError) {
              console.log(error.message);
            }
          }
        };

        // Fetch arena data
        const fetchArenaData = async () => {
          try {
            const currentArena = await getCurrentArena(userProfile.gradeId);
            if (!ignore) setCurrentArena(currentArena);

            await Promise.allSettled([
              fetchParticipationData(currentArena),
              fetchPreviousArenaAndLeaderboard(currentArena),
            ]);
          } catch (error) {
            if (error instanceof APIError) {
              console.log(error.message);
            }
          }
        };

        // Fetch rank data
        const fetchRankData = async () => {
          try {
            const rank = await getRankById(userProfile.rankId);
            if (!ignore) setUserRank(rank);
          } catch (error) {
            if (error instanceof APIError) {
              console.log(error.message);
            }
          }
        };

        await Promise.allSettled([fetchArenaData(), fetchRankData()]);
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!currentArena) return;

    const calculateTimeLeft = () => {
      const difference =
        new Date(currentArena.endTime).getTime() - new Date().getTime();
      let left = { d: 0, h: 0, m: 0 };

      if (difference > 0) {
        left = {
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
        };
      }
      return left;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentArena]);

  if (isLoading) return <ScreenLoader />;

  return (
    <div className="w-full h-full flex flex-row gap-[15px] p-[15px]">
      {/** Rule panel */}
      <div className="h-full w-fit flex flex-col relative">
        <div className="w-[324px] flex-1 bg-[#965C5A] rounded-tl-[20px] rounded-tr-[20px] z-10"></div>
        <Image
          src={arena}
          alt=""
          className="rounded-br-[20px] rounded-bl-[20px] z-10"
          width={324}
        />
        <div className="absolute top-0 flex flex-col items-center text-white w-full z-10">
          <h1
            className={clsx(
              roboto.className,
              "text-[27px] font-bold mt-[20px]",
            )}
          >
            ĐẤU TRƯỜNG
          </h1>
          <p className="text-center text-wrap mt-[10px] leading-tight">
            Dùng kinh nghiệm và kiến thức <br /> tích lũy được để cạnh tranh với{" "}
            <br /> những thí sinh khác !
          </p>
          <div
            className={clsx(
              "h-[55px] w-[200px] rounded-full bg-[#1DA492] flex items-center gap-[15px]",
              "text-white font-medium cursor-pointer mt-[30px]",
              "hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] transition-shadow duration-700 ease-in-out",
            )}
            onClick={() => setRulesShow(true)}
          >
            <label
              className={clsx(
                roboto.className,
                "cursor-pointer text-[20px] ml-[40px]",
              )}
            >
              Xem thể lệ
            </label>
            <FontAwesomeIcon className="text-[35px]" icon={faCircleQuestion} />
          </div>
        </div>
        <div
          className={clsx(
            "h-full absolute bg-[#F5DEB3] rounded-[20px] z-0 pl-[374px]",
            "flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
            rulesShow
              ? "w-[98vw] opacity-100 overflow-x-hidden"
              : "w-0 opacity-0",
          )}
        >
          {/* Fade + Slide-in wrapper for all content */}
          <div
            className={clsx(
              "transition-all duration-500 ease-in-out",
              rulesShow
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-6",
            )}
          >
            {/* Header */}
            <div className="flex flex-row items-center justify-center gap-[200px]">
              {/* Left button */}
              <div
                className={clsx(
                  "flex flex-row items-center justify-center text-[18px] gap-[10px]",
                  patrick.className,
                  rulesPage > 0 ? "cursor-pointer" : "opacity-0 cursor-default",
                  "font-bold transition-all duration-150 group",
                )}
                onClick={() => {
                  if (rulesPage > 0) setRulesPage((prev) => prev - 1);
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  className="group-hover:-translate-x-2 transition-transform duration-150"
                />
                <label
                  className={clsx(
                    "group-hover:translate-x-2 transition-transform duration-150",
                    rulesPage > 0
                      ? "cursor-pointer"
                      : "opacity-0 cursor-default",
                  )}
                >
                  TRANG TRƯỚC
                </label>
              </div>

              {/* Center title */}
              <div
                className={clsx(
                  "h-[100px] w-[400px] bg-[#C13501] text-white font-bold text-[40px]",
                  "flex items-center justify-center rounded-bl-[20px] rounded-br-[20px]",
                  "shadow-[0_4px_10px_rgba(0,0,0,0.25)]",
                )}
              >
                <label className={patrick_sc.className}>
                  THỂ LỆ ĐẤU TRƯỜNG
                </label>
              </div>

              {/* Right button */}
              <div
                className={clsx(
                  "flex flex-row items-center justify-center text-[18px] gap-[10px]",
                  patrick.className,
                  rulesPage < 4 ? "cursor-pointer" : "opacity-0 cursor-default",
                  "font-bold transition-all duration-150 group",
                )}
                onClick={() => {
                  if (rulesPage < 4) setRulesPage((prev) => prev + 1);
                }}
              >
                <label
                  className={clsx(
                    "group-hover:-translate-x-2 transition-transform duration-150",
                    rulesPage < 4
                      ? "cursor-pointer"
                      : "opacity-0 cursor-default",
                  )}
                >
                  TRANG SAU
                </label>
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  className="group-hover:translate-x-2 transition-transform duration-150"
                />
              </div>
            </div>

            {/* Rules content */}
            <div
              className={clsx(
                "flex-1 flex-row items-center w-full mt-[30px] transition-all duration-300 overflow-hidden",
              )}
            >
              {/* PAGE 1 */}
              <div
                className={clsx(
                  "flex flex-row h-full flex-1",
                  rulesPage !== 0 && "hidden",
                )}
              >
                <div
                  className={clsx(
                    "flex flex-col gap-[20px]",
                    rulesShow ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-1000",
                  )}
                >
                  <label
                    className={clsx(
                      patrick_sc.className,
                      "text-[45px] text-[#C03601]",
                    )}
                  >
                    I. Mục đích
                  </label>
                  <ul className="list-disc pl-[30px] text-[30px] text-[#5E4630] flex flex-col gap-[20px]">
                    <li className={patrick.className}>
                      Đấu trường được tổ chức nhằm tạo sân chơi <br />
                      bổ ích, khuyến khích học sinh rèn luyện <br />
                      tư duy, củng cố kiến thức và phát huy <br />
                      khả năng sáng tạo trong môi trường trực tuyến.
                    </li>
                    <li className={patrick.className}>
                      Đây còn là nơi các thí sinh cạnh tranh <br />
                      với nhau trên bảng xếp hạng, từ đó tạo <br />
                      động lực phát triển bản thân.
                    </li>
                  </ul>
                </div>
                <Image
                  src={r1}
                  alt=""
                  width={450}
                  className="h-[450px] aspect-square contrast-100"
                />
              </div>

              {/* PAGE 2 */}
              <div
                className={clsx(
                  "flex flex-row gap-[100px] h-full w-full",
                  rulesPage !== 1 && "hidden",
                )}
              >
                <div className="relative">
                  <div
                    className={clsx(
                      "absolute top-1/2 left-1/2 -translate-x-[170px] translate-y-[120px]",
                      "h-[60px] w-[250px] bg-[rgba(0,0,0,0.1)] rounded-full blur-md",
                      "[clip-path:ellipse(50%_40%_at_50%_50%)]",
                      "z-[1]",
                    )}
                  ></div>
                  <Image
                    src={r2}
                    alt=""
                    width={333}
                    className="h-[500px] aspect-square contrast-100 ml-[20px] relative z-[2]"
                  />
                </div>
                <div className="flex flex-col gap-[20px]">
                  <label
                    className={clsx(
                      patrick_sc.className,
                      "text-[45px] text-[#C03601]",
                    )}
                  >
                    II. Hình thức thi
                  </label>
                  <ul className="list-disc pl-[30px] text-[30px] text-[#5E4630] flex flex-col gap-[20px]">
                    <li className={patrick.className}>
                      Bài thi dưới dạng trắc nghiệm trực tuyến <br />
                      hoặc câu hỏi tương tác đặc biệt được cung cấp <br />
                      trên nền tảng web của DinoMath.
                    </li>
                    <li className={patrick.className}>
                      Mỗi đề thi bao gồm 100 câu hỏi với mức độ từ dễ đến khó.
                    </li>
                    <li className={patrick.className}>
                      Thí sinh có thể làm bài trực tiếp trên thiết bị <br />
                      có kết nối Internet (máy tính, máy tính bảng <br />
                      hoặc điện thoại thông minh).
                    </li>
                  </ul>
                </div>
              </div>

              {/* PAGE 3 */}
              <div
                className={clsx(
                  "flex flex-row gap-[50px] h-full w-full",
                  rulesPage !== 2 && "hidden",
                )}
              >
                <div className="flex flex-col gap-[20px]">
                  <label
                    className={clsx(
                      patrick_sc.className,
                      "text-[45px] text-[#C03601]",
                    )}
                  >
                    III. Thời gian thi
                  </label>
                  <ul className="list-disc pl-[30px] text-[30px] text-[#5E4630] flex flex-col gap-[20px]">
                    <li className={patrick.className}>
                      Thời gian diễn ra: 01 tuần (tính từ 00:00 <br />
                      ngày Thứ Hai đến 23:59 ngày Chủ Nhật).
                    </li>
                    <li className={patrick.className}>
                      Trong khoảng thời gian này, thí sinh <br />
                      có thể tham gia làm bài bất kỳ lúc nào, <br />
                      nhưng chỉ được nộp bài một lần duy nhất.
                    </li>
                    <li className={patrick.className}>
                      Sau khi hết thời hạn, hệ thống sẽ tự động <br />
                      đóng quyền truy cập đề thi.
                    </li>
                  </ul>
                </div>
                <Image
                  src={r3}
                  alt=""
                  width={450}
                  className="h-[450px] aspect-square contrast-100"
                />
              </div>

              {/* PAGE 4 */}
              <div
                className={clsx(
                  "flex flex-row gap-[100px] h-full w-full",
                  rulesPage !== 3 && "hidden",
                )}
              >
                <div className="relative mt-[50px]">
                  <div
                    className={clsx(
                      "absolute top-1/2 left-1/2 -translate-x-[240px] translate-y-[100px]",
                      "h-[80px] w-[250px] bg-[rgba(0,0,0,0.1)] rounded-full blur-md",
                      "[clip-path:ellipse(50%_40%_at_50%_50%)] z-[1]",
                    )}
                  ></div>
                  <div
                    className={clsx(
                      "absolute top-1/2 left-1/2 translate-y-[100px]",
                      "h-[80px] w-[250px] bg-[rgba(0,0,0,0.1)] rounded-full blur-md",
                      "[clip-path:ellipse(50%_40%_at_50%_50%)] z-[1]",
                    )}
                  ></div>
                  <Image
                    src={r4}
                    alt=""
                    width={450}
                    className="h-[450px] aspect-square contrast-100 ml-[20px] relative z-[2]"
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label
                    className={clsx(
                      patrick_sc.className,
                      "text-[45px] text-[#C03601]",
                    )}
                  >
                    IV. Cách tính điểm và xếp hạng
                  </label>
                  <ul className="list-disc pl-[30px] text-[25px] text-[#5E4630] flex flex-col">
                    <li className={patrick.className}>
                      Mỗi câu trả lời đúng được tính 1 điểm.
                    </li>
                    <li className={patrick.className}>
                      Tổng điểm tối đa: 100 điểm.
                    </li>
                    <li className={patrick.className}>
                      Điểm số cuối cùng của thí sinh được hệ thống <br />
                      ghi nhận ngay sau khi nộp bài.
                    </li>
                    <li className={patrick.className}>
                      Xếp hạng:
                      <ul className="list-[circle] pl-6">
                        <li className={patrick.className}>
                          Thí sinh có điểm cao hơn sẽ được <br />
                          xếp hạng cao hơn.
                        </li>
                        <li className={patrick.className}>
                          Trường hợp nhiều thí sinh cùng điểm số, <br />
                          thứ hạng được quyết định dựa trên thời gian <br />
                          hoàn thành bài thi (người hoàn thành nhanh hơn <br />
                          xếp trên).
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              {/* PAGE 5 */}
              <div
                className={clsx(
                  "flex flex-row gap-[100px] h-full w-full",
                  rulesPage !== 4 && "hidden",
                )}
              >
                <div className="flex flex-col gap-[20px]">
                  <label
                    className={clsx(
                      patrick_sc.className,
                      "text-[45px] text-[#C03601]",
                    )}
                  >
                    V. Công bố kết quả
                  </label>
                  <ul className="list-disc pl-[30px] text-[30px] text-[#5E4630] flex flex-col gap-[20px]">
                    <li className={patrick.className}>
                      Kết quả được cập nhật theo thời gian thực trên <br />
                      bảng xếp hạng tuần.
                    </li>
                    <li className={patrick.className}>
                      Sau khi kết thúc cuộc thi, danh sách thí sinh <br />
                      đạt giải sẽ được công bố trên web app và các <br />
                      kênh thông báo chính thức.
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div
                    className={clsx(
                      "absolute top-1/2 left-1/2 -translate-x-[150px] translate-y-[100px]",
                      "h-[100px] w-[350px] bg-[rgba(0,0,0,0.1)] rounded-full blur-md",
                      "[clip-path:ellipse(50%_40%_at_50%_50%)] z-[1]",
                    )}
                  ></div>
                  <Image
                    src={r5}
                    alt=""
                    width={366}
                    className="h-[550px] aspect-square contrast-100 ml-[20px] -translate-y-16 relative z-[2]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collapse button */}
          <div
            className={clsx(
              "h-[70px] w-[50px] bg-[#C13501] absolute right-0 translate-y-[270px] group cursor-pointer",
              "rounded-tl-[20px] rounded-bl-[20px] flex items-center justify-center text-[white] text-[40px]",
              "shadow-[-4px_0_10px_rgba(0,0,0,0.25)]",
            )}
            onClick={() => {
              setRulesShow(false);
              setRulesPage(0);
            }}
          >
            <FontAwesomeIcon
              className="group-hover:scale-125 transition-all duration-150"
              icon={faCaretLeft}
            />
          </div>
        </div>
      </div>
      {/** Arena content */}
      <div
        className={clsx(
          "flex flex-1 h-full flex-col items-center justify-center gap-[15px] transition-all duration-200 overflow-hidden",
          { hidden: rulesShow },
        )}
      >
        {/** Top section */}
        <div className="flex w-full min-h-[214px] max-h-[36%] flex-row gap-[15px] flex-shrink-0 px-[15px] pt-[15px]">
          {/** Join border */}
          {!currentArena ? (
            <div className="h-full w-[calc(50%-7.5px)] bg-[#9e9e9e] rounded-[20px] flex-shrink-0">
              <div
                className={clsx(
                  "h-[98%] w-[99%] bg-[#f5f5f5] rounded-[20px] border-2",
                  "border-[#9e9e9e] flex flex-col items-center justify-center",
                  "gap-5 p-5 overflow-hidden",
                )}
              >
                <h2
                  className={clsx(
                    "text-[#757575] text-xl font-bold leading-tight text-center",
                    roboto.className,
                  )}
                >
                  Hiện chưa có đấu trường nào mở cửa. <br /> Hãy quay lại sau
                  nhé !
                </h2>
              </div>
            </div>
          ) : !arenaDone ? (
            <div className="h-full w-[calc(50%-7.5px)] bg-[#F9740B] rounded-[20px] flex-shrink-0">
              <div
                className={clsx(
                  "h-[98%] w-[99%] bg-[#FFF5ED] rounded-[20px] border-2",
                  "border-[#F9740B] flex flex-row items-center justify-center",
                  "gap-16 p-5 overflow-hidden",
                )}
              >
                <Image
                  src={helmet}
                  alt=""
                  className="h-auto w-[150px] max-h-[160px] flex-shrink-0"
                />
                <div className="flex flex-col gap-[20px] min-w-0">
                  <h2
                    className={clsx(
                      "text-[#F9740B] text-2xl font-bold leading-tight",
                      roboto.className,
                    )}
                  >
                    {currentArena?.title} <br /> ĐANG MỞ CỬA
                  </h2>
                  <div
                    className={clsx(
                      "h-[60px] w-full rounded-[20px] bg-[#E1690A] overflow-hidden cursor-pointer",
                      "hover:brightness-110 transition-all duration-200",
                    )}
                  >
                    <div
                      className={clsx(
                        "flex items-center justify-center",
                        "h-full w-full relative bg-[#F9740B] text-white text-lg font-medium",
                        "rounded-tl-[50px] rounded-br-[60px] relative",
                      )}
                      onClick={() =>
                        router.push(`/student/arena-exam/${currentArena._id}`)
                      }
                    >
                      Tham gia ngay
                      <span className="absolute top-0 right-0 mt-[7px] mr-[10px] h-[25px] aspect-square bg-[rgba(255,255,255,0.3)] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-[calc(50%-7.5px)] bg-[#3B84F2] rounded-[20px] flex-shrink-0">
              <div
                className={clsx(
                  "h-[98%] w-[99%] bg-[#F2F7FF] rounded-[20px] border-2",
                  "border-[#3B84F2] flex flex-col items-center justify-center",
                  "gap-5 p-5 overflow-hidden",
                )}
              >
                <h2
                  className={clsx(
                    "text-[#3B84F2] text-xl font-bold leading-tight text-center",
                    roboto.className,
                  )}
                >
                  {`Bạn đã hoàn thành ${currentArena?.title}.`} <br /> Hẹn gặp
                  lại ở kỳ tiếp theo !
                </h2>
                <h4 className="text-[rgba(0,0,0,0.5)] font-medium text-center leading-tight">
                  Kết quả sẽ được công bố khi đấu trường kết thúc. <br /> Vui
                  lòng vào mục Lịch sử để xem điểm và chi tiết bài làm nhé.
                </h4>
              </div>
            </div>
          )}
          {/** Count down border */}
          {currentArena ? (
            <div className="h-full w-[calc(50%-7.5px)] bg-[#1DA492] rounded-[20px] flex-shrink-0">
              <div
                className={clsx(
                  "h-[98%] w-[99%] bg-[#F3FFFD] rounded-[20px] border-2",
                  "border-[#23BEAA] flex flex-col",
                  "overflow-hidden",
                )}
              >
                <div className="h-[60px] w-full bg-[#23BEAA] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                  Đấu trường kết thúc trong:
                </div>
                <div className="flex flex-row gap-[40px] py-[15px] items-center justify-center flex-1">
                  <div className="flex flex-col items-center">
                    <label className="text-5xl font-bold text-[#1DA492]">
                      {timeLeft.d.toString().padStart(2, "0")}
                    </label>
                    <label className="text-xl font-bold text-[#1DA492]">
                      ngày
                    </label>
                  </div>
                  <div className="h-[80px] w-[2px] bg-[#d9d9d9]"></div>
                  <div className="flex flex-col items-center">
                    <label className="text-5xl font-bold text-[#1DA492]">
                      {timeLeft.h.toString().padStart(2, "0")}
                    </label>
                    <label className="text-xl font-bold text-[#1DA492]">
                      giờ
                    </label>
                  </div>
                  <div className="h-[80px] w-[2px] bg-[#d9d9d9]"></div>
                  <div className="flex flex-col items-center">
                    <label className="text-5xl font-bold text-[#1DA492]">
                      {timeLeft.m.toString().padStart(2, "0")}
                    </label>
                    <label className="text-xl font-bold text-[#1DA492]">
                      phút
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-[calc(50%-7.5px)] bg-[#9e9e9e] rounded-[20px] flex-shrink-0">
              <div
                className={clsx(
                  "h-[98%] w-[99%] bg-[#f5f5f5] rounded-[20px] border-2",
                  "border-[#9e9e9e] flex flex-col items-center justify-center",
                  "gap-5 p-5 overflow-hidden",
                )}
              >
                <h2
                  className={clsx(
                    "text-[#757575] text-xl font-bold leading-tight text-center",
                    roboto.className,
                  )}
                >
                  Đấu trường chưa bắt đầu.
                </h2>
              </div>
            </div>
          )}
        </div>
        {/** Body section - SCROLLABLE CONTAINER */}
        <div className="flex flex-1 flex-row gap-[15px] min-h-0 w-full px-[15px] pb-[15px] overflow-hidden">
          {/** Ranking border */}
          <div
            className={clsx("w-[350px] rounded-[20px] flex-shrink-0")}
            style={{ backgroundColor: userRank?.color }}
          >
            <div
              className={clsx(
                "h-[99%] w-[345px] bg-white border-3 rounded-[20px]",
                "flex flex-col items-center p-[20px]",
              )}
              style={{ borderColor: userRank?.color }}
            >
              <h1 className="text-xl font-bold text-[rgba(0,0,0,0.8)]">
                Xếp hạng của bạn
              </h1>
              {userRank && userRank.badge && (
                <Image
                  src={userRank?.badge || ""}
                  alt=""
                  className="mt-[15px] w-auto h-[50%] aspect-square"
                  width={200}
                  height={200}
                />
              )}
              {/** Ribbon */}
              <div className="relative flex justify-center items-center w-full">
                <svg
                  viewBox="-25 -5 50 10"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto max-w-[600px]"
                  style={{ fill: userRank?.color }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M -11 -2 
                                            L 11 -2 
                                            C 11 -1 10 -1 9 0 
                                            C 9.6667 0.6667 11 1 11 2 
                                            L -13 2 
                                            C -13 1 -11.6667 0.6667 -11 0 
                                            C -11.6667 -0.6667 -13 -1 -13 -2 
                                            L -11 -2"
                    transform="translate(2,0) scale(2,2)"
                  />
                </svg>

                <span
                  className={clsx(
                    baloo.className,
                    "absolute text-white text-base font-bold",
                  )}
                >
                  {userRank?.title}
                </span>
              </div>
              {/** Rank info */}
              <div className="flex flex-row mt-auto mb-0 justify-around w-full">
                <div className="flex flex-col font-medium text-base gap-[10px]">
                  <label className={clsx(roboto.className)}>
                    Battle Points:
                  </label>
                  <label className={clsx(roboto.className)}>
                    Vị trí hiện tại:
                  </label>
                </div>
                <div
                  className="flex flex-col font-bold text-base gap-[10px]"
                  style={{ color: userRank?.color }}
                >
                  <label
                    className={clsx(roboto.className)}
                  >{`${formatNumberAbbreviation(userProfile?.battlePoints || 0)}`}</label>
                  <label className={clsx(roboto.className)}>
                    {myRank?.arena.global.rank
                      ? formatNumberAbbreviation(myRank.arena.global.rank)
                      : "Chưa xếp hạng"}
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/** Leaderboard - SCROLLABLE */}
          <div className="flex h-full flex-1 flex-col gap-[10px] min-w-0 pr-2">
            {!previousArena ||
            !leaderboard ||
            leaderboard.leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[99%] w-full bg-[#f5f5f5] rounded-[20px] border-[#9e9e9e] border-2">
                <h2
                  className={clsx(
                    "text-[#757575] text-xl font-bold leading-tight text-center",
                    roboto.className,
                  )}
                >
                  Chưa có dữ liệu bảng xếp hạng.
                </h2>
              </div>
            ) : (
              <>
                <h1 className="font-bold text-lg text-[rgba(0,0,0,0.8)] flex-shrink-0">
                  {`Bảng xếp hạng ${previousArena?.title} (tuần trước)`}
                </h1>
                <div className="flex flex-col gap-[10px] flex-shrink-0">
                  {leaderboard?.leaderboard
                    .filter(
                      (_, idx) => idx >= pageIdx * 4 && idx < (pageIdx + 1) * 4,
                    )
                    .map((record, idx) => (
                      <div
                        key={idx}
                        className={clsx(
                          "h-[80px] min-h-[80px] w-full rounded-[20px] border-2",
                          "flex flex-row items-center flex-shrink-0",
                          { "border-[#F1A12E]": idx === 0 },
                          { "border-[#3B84F2]": idx === 1 },
                          { "border-[#FF1493]": idx === 2 },
                          { "border-[#23BEAA]": idx > 2 },
                        )}
                      >
                        <div
                          className={clsx(
                            "h-full w-[70px] rounded-tl-[15px] rounded-bl-[15px] flex-shrink-0",
                            "flex items-center justify-center text-white font-bold text-xl",
                            { "bg-[#F1A12E]": idx === 0 },
                            { "bg-[#3B84F2]": idx === 1 },
                            { "bg-[#FF1493]": idx === 2 },
                            { "bg-[#23BEAA]": idx > 2 },
                          )}
                        >
                          {idx + 1}
                        </div>
                        <div
                          className={clsx(
                            "flex flex-row gap-[20px] items-center justify-start px-[20px] text-lg font-bold flex-1 min-w-0",
                            { "text-[#F1A12E]": idx === 0 },
                            { "text-[#3B84F2]": idx === 1 },
                            { "text-[#FF1493]": idx === 2 },
                            { "text-[#23BEAA]": idx > 2 },
                          )}
                        >
                          <div className="h-[50px] aspect-square overflow-hidden rounded-full flex-shrink-0">
                            <Image
                              src={record?.user?.avatarUrl}
                              alt=""
                              height={50}
                              width={50}
                            />
                          </div>
                          <label className="flex-1 truncate">
                            {record?.user?.name}
                          </label>
                          <label className="w-20 text-right flex-shrink-0">
                            {record?.correctCount}
                          </label>
                          <label className="w-28 text-right flex-shrink-0">
                            {formatTimeTaken(record?.timeTaken)}
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex flex-row ml-auto mr-auto gap-[50px] py-[5px] flex-shrink-0">
                  {/* Previous */}
                  <div
                    className="flex flex-row gap-[10px] items-center text-lg font-medium cursor-pointer group"
                    onClick={() => {
                      if (pageIdx > 0) setPageIdx((prev) => prev - 1);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCaretLeft}
                      className="group-hover:scale-150 transition-all duration-150"
                    />
                    <label className="cursor-pointer">Trước</label>
                  </div>

                  {/* Next */}
                  <div
                    className="flex flex-row gap-[10px] items-center text-lg font-medium cursor-pointer group"
                    onClick={() => {
                      if (pageIdx < 4) setPageIdx((prev) => prev + 1);
                    }}
                  >
                    <label className="cursor-pointer">Sau</label>
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      className="group-hover:scale-150 transition-all duration-150"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
