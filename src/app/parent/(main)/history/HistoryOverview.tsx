"use client";

import Filter from "@/components/Filter/Filter";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { faClock, faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faCheckCircle,
  faNewspaper,
  faStar,
  faVialCircleCheck,
  faWarning,
  faXmarkSquare,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import {
  AssessmentResultDetailedResponse,
  HistoryRecord,
  LectureResponse,
  LectureResultDetailedResponse,
  ParticipationDetailedResponse,
  StudentStatsResponse,
  UserProfileResponse,
} from "@/types";
import { getUserProfile, getUsers, getStudentStats } from "@/apis";
import { getLectureResults, getAssessmentResultsList } from "@/apis/study";
import { getParticipationsPaginated } from "@/apis/arena";
import { APIError } from "@/apis/config";

interface HistoryOverviewProps {
  onViewDetail: (record: HistoryRecord) => void;
}

const PAGE_LIMIT = 5;

function formatDuration(timeValue: number | undefined | null): string {
  if (timeValue == null || isNaN(timeValue)) return "—";
  let totalSeconds = timeValue;
  if (timeValue > 10000) {
    totalSeconds = Math.floor(timeValue / 1000);
  } else {
    totalSeconds = Math.floor(timeValue);
  }

  if (totalSeconds < 0) totalSeconds = 0;
  if (totalSeconds === 0) return "0 giây";
  if (totalSeconds < 60) return `${totalSeconds} giây`;

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins} phút ${secs} giây` : `${mins} phút`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSafeDuration(item: any): number {
  const apiTime = item.timeTaken ?? item.duration;
  if (typeof apiTime === "number" && !isNaN(apiTime) && apiTime > 0) {
    return apiTime;
  }
  const start = item.createdAt ? new Date(item.createdAt).getTime() : NaN;
  const endStr = item.finishedAt ?? item.updatedAt ?? item.createdAt;
  const end = endStr ? new Date(endStr).getTime() : NaN;
  if (!isNaN(start) && !isNaN(end)) {
    return Math.max(0, end - start);
  }
  return 0;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const days = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${days[d.getDay()]}, ${h}:${m} ${dd}-${mm}-${d.getFullYear()}`;
}

function mapLectureResults(
  items: LectureResultDetailedResponse[],
): HistoryRecord[] {
  return items.map((item) => {
    const lecture = item.lectureId as LectureResponse;
    const name = lecture?.title ?? "Bài học";
    const accuracy =
      item.totalQuestions > 0
        ? Math.min(
            Math.round((item.correctCount / item.totalQuestions) * 100),
            100,
          )
        : 0;
    return {
      _id: item._id,
      name,
      title: lecture?.title ?? name,
      accuracy,
      date: formatDate(item.createdAt),
      rawDate: new Date(item.createdAt),
      duration: formatDuration(getSafeDuration(item)),
      category: "exercise" as const,
      correctCount: item.correctCount,
      totalQuestions: item.totalQuestions,
    };
  });
}

function mapParticipations(
  items: ParticipationDetailedResponse[],
): HistoryRecord[] {
  return items.map((item) => {
    const arena = item.arenaId as { title: string };
    const name = arena?.title ?? "Đấu trường";
    const accuracy = Math.min(item.score ?? 0, 100);
    return {
      _id: item._id,
      name,
      title: arena?.title ?? name,
      accuracy,
      date: formatDate(item.finishedAt ?? item.createdAt),
      rawDate: new Date(item.finishedAt ?? item.createdAt),
      duration: formatDuration(getSafeDuration(item)),
      category: "arena" as const,
      correctCount: item.correctCount,
    };
  });
}

function mapAssessmentResults(
  items: AssessmentResultDetailedResponse[],
): HistoryRecord[] {
  return items.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assessment = item.assessmentId as any;
    const name = assessment?.title ?? "Kiểm tra đầu vào";
    const accuracy = Math.min(item.totalScore ?? 0, 100);
    return {
      _id: item._id,
      name,
      title: assessment?.title ?? name,
      accuracy,
      date: formatDate(item.createdAt),
      rawDate: new Date(item.createdAt),
      duration: formatDuration(getSafeDuration(item)),
      category: "assessment" as const,
    };
  });
}

export default function HistoryOverview({
  onViewDetail,
}: HistoryOverviewProps) {
  const [studentList, setStudentList] = useState<UserProfileResponse[]>([]);
  const [, setStats] = useState<StudentStatsResponse | null>(null);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [filteredAccuracy, setFilteredAccuracy] = useState<number | null>(null);
  const [lastFilter, setLastFilter] = useState<{
    studentId: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    category: string;
    keyword: string;
  } | null>(null);

  const defaultStartDate = undefined;
  const defaultEndDate = undefined;
  const defaultCategory = "all";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsPageLoading(true);
        const parentProfile = await getUserProfile();
        const users = await getUsers({
          familyId: parentProfile?.familyId,
          page: 1,
          limit: 100,
        });
        const students = users.filter((u) => u.role === "student");
        setStudentList(students);

        if (students.length > 0) {
          const sd = defaultStartDate;
          const ed = defaultEndDate;
          const cat = defaultCategory;
          const firstStudentId = students[0]._id;

          setLastFilter({
            studentId: firstStudentId,
            startDate: sd,
            endDate: ed,
            category: cat,
            keyword: "",
          });

          const params = {
            userId: firstStudentId ?? "",
            startDate: sd ? new Date(sd).toISOString() : "",
            endDate: ed ? new Date(ed).toISOString() : "",
          };
          const statsData = await getStudentStats(params);
          setStats(statsData);
          await fetchRecords(firstStudentId, sd, ed, cat, "", 1);
        }
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRecords = useCallback(
    async (
      studentId: string,
      startDate: Date | undefined,
      endDate: Date | undefined,
      category: string,
      keyword: string,
      page: number,
    ) => {
      const baseParams = {
        userId: studentId,
        limit: 10000,
      };

      let allItems: HistoryRecord[] = [];

      try {
        if (category === "arena") {
          const res = await getParticipationsPaginated({
            ...baseParams,
            status: "finished",
          });
          allItems = mapParticipations(res.items ?? []);
        } else if (category === "assessment") {
          const res = await getAssessmentResultsList(baseParams);
          allItems = mapAssessmentResults(
            res.items.filter((item) => item.status === "graded") ?? [],
          );
        } else if (category === "exercise") {
          const res = await getLectureResults(baseParams);
          allItems = mapLectureResults(res.items ?? []);
        } else {
          // 'all'
          const [res1, res2, res3] = await Promise.all([
            getParticipationsPaginated({ ...baseParams, status: "finished" }),
            getAssessmentResultsList(baseParams),
            getLectureResults(baseParams),
          ]);
          allItems = [
            ...mapParticipations(res1.items ?? []),
            ...mapAssessmentResults(
              res2.items?.filter((item) => item.status === "graded") ?? [],
            ),
            ...mapLectureResults(res3.items ?? []),
          ];
        }

        // Filter locally
        const startObj = startDate ? startDate.getTime() : 0;
        const endObj = endDate ? endDate.getTime() : Infinity;

        const filteredItems = allItems.filter((item) => {
          if (!item.rawDate) return true;
          const time = item.rawDate.getTime();
          return time >= startObj && time <= endObj;
        });

        const normalizedKeyword = keyword.trim().toLowerCase();

        const finalFiltered = filteredItems.filter((item) => {
          if (!normalizedKeyword) return true;

          return (item.title ?? item.name)
            .toLowerCase()
            .includes(normalizedKeyword);
        });

        // Sort newest first
        finalFiltered.sort((a, b) => {
          const timeA = a.rawDate?.getTime() ?? 0;
          const timeB = b.rawDate?.getTime() ?? 0;
          return timeB - timeA;
        });

        const totalRecordsVal = finalFiltered.length;
        const totalPagesVal = Math.ceil(totalRecordsVal / PAGE_LIMIT) || 1;

        if (totalRecordsVal > 0) {
          const accSum = finalFiltered.reduce(
            (sum, item) => sum + item.accuracy,
            0,
          );
          setFilteredAccuracy(Math.round(accSum / totalRecordsVal));
        } else {
          setFilteredAccuracy(0);
        }

        const startIndex = (page - 1) * PAGE_LIMIT;
        const pagedItems = finalFiltered.slice(
          startIndex,
          startIndex + PAGE_LIMIT,
        );

        console.log("finalFiltered: ", finalFiltered);

        setRecords(pagedItems);
        setTotalPages(totalPagesVal);
        setTotalRecords(totalRecordsVal);
      } catch (err) {
        if (err instanceof APIError) {
          console.log(err.message);
        }
      }
    },
    [],
  );

  const handleFilter = async (
    studentId?: string,
    startDate?: Date,
    endDate?: Date,
    category?: string,
    keyword?: string,
  ): Promise<void> => {
    if (!studentId) return;
    const sd = startDate;
    let ed = endDate;
    if (ed) {
      ed = new Date(
        ed.getFullYear(),
        ed.getMonth(),
        ed.getDate(),
        23,
        59,
        59,
        999,
      );
    }
    const cat = category || "all";
    const kw = keyword ?? "";
    try {
      setIsFilterLoading(true);
      setCurrentPage(1);
      setRecords([]);
      setTotalRecords(0);
      setLastFilter({
        studentId,
        startDate: sd,
        endDate: ed,
        category: cat,
        keyword: kw,
      });
      const params = {
        userId: studentId ?? "",
        startDate: sd ? new Date(sd).toISOString() : "",
        endDate: ed ? new Date(ed).toISOString() : "",
      };
      const statsData = await getStudentStats(params);
      setStats(statsData);
      await fetchRecords(studentId, sd, ed, cat, kw, 1);
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message);
      }
    } finally {
      setIsFilterLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!lastFilter || newPage < 1 || newPage > totalPages) return;
    try {
      setIsFilterLoading(true);
      setCurrentPage(newPage);
      await fetchRecords(
        lastFilter.studentId,
        lastFilter.startDate,
        lastFilter.endDate,
        lastFilter.category,
        lastFilter.keyword,
        newPage,
      );
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message);
      }
    } finally {
      setIsFilterLoading(false);
    }
  };

  if (isPageLoading) return <ScreenLoader />;

  const displayFrom =
    totalRecords === 0 ? 0 : (currentPage - 1) * PAGE_LIMIT + 1;
  const displayTo = Math.min(currentPage * PAGE_LIMIT, totalRecords);

  return (
    <div className="h-full w-full p-5 flex flex-row gap-5">
      <Filter
        hasStudentSelectBox
        hasCategorySelectBox
        hasSearchBox
        studentList={studentList}
        filter={handleFilter}
      />
      {/** Statistic */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        {/** Overall */}
        <div className="flex flex-col gap-4">
          <label className="font-medium text-xl">Thống kê tổng quát</label>
          <div className="flex flex-row gap-5">
            <div
              className="flex flex-col h-40 w-80 bg-gradient-to-r from-0% from-[#60A0FF] to-100% to-[#4D01FE] 
                                text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg"
            >
              <label className="font-medium">Số bài tập đã làm</label>
              <label
                data-testid="total-exercises"
                className="ml-auto mr-auto text-5xl font-medium"
              >
                {isFilterLoading ? "…" : totalRecords}
              </label>
              <FontAwesomeIcon
                icon={faNewspaper}
                className="absolute top-0 right-0 text-4xl mt-3 mr-3"
              />
            </div>
            <div
              className="flex flex-col h-40 w-80 bg-gradient-to-r from-0% from-[#3BC16A] to-100% to-[#01A139] 
                                text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg"
            >
              <label className="font-medium">Độ chính xác</label>
              <label
                data-testid="accuracy"
                className="ml-auto mr-auto text-5xl font-medium"
              >
                {isFilterLoading
                  ? "…"
                  : filteredAccuracy !== null
                    ? `${filteredAccuracy}%`
                    : "—"}
              </label>
              <FontAwesomeIcon
                icon={faVialCircleCheck}
                className="absolute top-0 right-0 text-4xl mt-3 mr-3"
              />
            </div>
          </div>
        </div>
        {/** History */}
        <div className="flex flex-1 flex-col gap-4 pr-5">
          <label className="font-medium text-xl">Lịch sử làm bài</label>
          {isFilterLoading ? (
            <div className="flex flex-col gap-2 w-full flex-1">
              {[...Array(PAGE_LIMIT)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-full rounded-xl border-2 border-gray-100 bg-gray-50 animate-pulse"
                />
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="flex flex-col gap-2 w-full flex-1">
              {records.map((val, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "h-24 w-full rounded-xl border-2 flex flex-row px-5 py-2 items-center",
                    val.accuracy >= 80
                      ? "border-[#23BEAA] "
                      : val.accuracy >= 50
                        ? "border-[#F9740B]"
                        : "border-[#FF5964]",
                  )}
                >
                  {/** Icon */}
                  <FontAwesomeIcon
                    icon={
                      val.accuracy >= 80
                        ? faCheckCircle
                        : val.accuracy >= 50
                          ? faWarning
                          : faXmarkSquare
                    }
                    className={clsx(
                      "text-5xl",
                      val.accuracy >= 80
                        ? "text-[#23BEAA]"
                        : val.accuracy >= 50
                          ? "text-[#F9740B]"
                          : "text-[#FF5964]",
                    )}
                  />
                  {/** Info */}
                  <div className="flex flex-col ml-5 gap-1">
                    <label
                      className={clsx(
                        "text-xl font-bold",
                        val.accuracy >= 80
                          ? "text-[#23BEAA]"
                          : val.accuracy >= 50
                            ? "text-[#F9740B]"
                            : "text-[#FF5964]",
                      )}
                    >
                      {val.name}
                    </label>
                    <div className="flex flex-row gap-5 font-medium">
                      {val.category !== "exercise" && (
                        <div className="flex flex-row gap-1 text-[rgba(0,0,0,0.5)] items-center">
                          <FontAwesomeIcon icon={faClock} />
                          <label>{val.duration}</label>
                        </div>
                      )}
                      <div className="flex flex-row gap-1 text-[rgba(0,0,0,0.5)] items-center">
                        <FontAwesomeIcon icon={faCalendar} />
                        <label>{val.date}</label>
                      </div>
                    </div>
                  </div>
                  {/** Accuracy + View button (right-aligned group) */}
                  <div className="flex flex-row items-center gap-8 ml-auto mr-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row gap-3 items-center">
                        <label
                          className={clsx(
                            "text-2xl font-medium",
                            val.accuracy >= 80
                              ? "text-[#23BEAA]"
                              : val.accuracy >= 50
                                ? "text-[#F9740B]"
                                : "text-[#FF5964]",
                          )}
                        >
                          {`${val.accuracy}%`}
                        </label>
                        <div className="flex flex-row gap-1 text-amber-400">
                          {[
                            ...Array(
                              val.accuracy >= 80
                                ? 3
                                : val.accuracy >= 50
                                  ? 2
                                  : 1,
                            ),
                          ].map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} />
                          ))}
                        </div>
                      </div>
                      <label className="font-medium text-[rgba(0,0,0,0.5)]">{`${val.accuracy}/100`}</label>
                    </div>
                    {/** View button */}
                    <div
                      className={clsx(
                        "h-fit w-fit px-8 py-2 font-medium text-white flex items-center justify-center rounded-full",
                        "cursor-pointer hover:brightness-110 transition-all duration-200",
                        val.accuracy >= 80
                          ? "bg-[#23BEAA]"
                          : val.accuracy >= 50
                            ? "bg-[#F9740B]"
                            : "bg-[#FF5964]",
                      )}
                      onClick={() => {
                        const studentName =
                          studentList.find(
                            (s) => s._id === lastFilter?.studentId,
                          )?.name ?? "";
                        onViewDetail({ ...val, studentName });
                      }}
                      data-testid={`view-detail-btn-${idx}`}
                    >
                      Xem
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <FontAwesomeIcon
                icon={faFolderOpen}
                className="text-7xl text-gray-300"
              />
              <div className="flex flex-col items-center gap-1">
                <label className="text-xl font-bold text-gray-500">
                  Chưa có kết quả nào
                </label>
                <label className="text-gray-400">
                  Hãy thử thay đổi bộ lọc để tìm kiếm kết quả khác
                </label>
              </div>
            </div>
          )}
          {/** Pagination */}
          {totalRecords > 0 && (
            <div className="flex flex-row items-center mb-5">
              <label className="font-medium text-[rgba(0,0,0,0.5)]">
                {`Hiển thị ${displayFrom}-${displayTo} trên ${totalRecords} kết quả`}
              </label>
              <div className="ml-auto mr-0 flex flex-row gap-2">
                <div
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={clsx(
                    "h-fit w-30 px-5 py-2 border-2 border-black flex items-center justify-center rounded-2xl font-medium",
                    currentPage <= 1
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-100",
                  )}
                >
                  Trước
                </div>
                <div
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={clsx(
                    "h-fit w-30 px-5 py-2 border-2 border-black flex items-center justify-center rounded-2xl font-medium",
                    currentPage >= totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-100",
                  )}
                >
                  Sau
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
