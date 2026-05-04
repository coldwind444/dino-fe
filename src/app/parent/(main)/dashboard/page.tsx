"use client";

import Filter from "@/components/Filter/Filter";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  RankResponse,
  StudentStatsResponse,
  UserProfileResponse,
} from "@/types";
import { getUserProfile, getStudentStats, getUsers, getRankById } from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";
import { formatNumberAbbreviation, toCloudinaryWebP } from "@/helpers/utils";
import { APIError } from "@/apis/config";

export default function Dashboard() {
  // Data state
  const [studentStats, setStudentStats] = useState<StudentStatsResponse | null>(
    null,
  );
  const [selectedStudentRank, setSelectedStudentRank] =
    useState<RankResponse | null>(null);
  const [studentList, setStudentList] = useState<UserProfileResponse[]>([]);

  // Loading state
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Functions
  const handleFilter = async (
    studentId?: string,
    startDate?: Date,
    endDate?: Date,
    _category?: string,
    _keyword?: string,
  ): Promise<void> => {
    const params = {
      userId: studentId ?? "",
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
    };
    try {
      setIsFilterLoading(true);
      const stats = await getStudentStats(params);
      const currStudent = studentList.find(
        (student) => student._id === studentId,
      );
      const rank = await getRankById(currStudent?.rankId || "");
      setStudentStats(stats);
      setSelectedStudentRank(rank);
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message);
      }
    } finally {
      setIsFilterLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        const parentProfile = await getUserProfile();
        const studentList = await getUsers({
          familyId: parentProfile?.familyId,
          page: 1,
          limit: 100,
        });
        if (!ignore) {
          const filtered = studentList.filter(
            (user) => user.role === "student",
          );
          setStudentList(filtered);
        }
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    if (studentList.length > 0 && studentStats === null && !ignore) {
      handleFilter(studentList[0]?._id);
    }
    return () => {
      ignore = true;
    };
  }, [studentList]);

  if (isPageLoading) {
    return <ScreenLoader />;
  }

  // ── Skeleton card ──────────────────────────────────────────────────────────
  const SkeletonCard = ({ extraClass = "" }: { extraClass?: string }) => (
    <div className={`animate-pulse rounded-2xl bg-gray-200 ${extraClass}`}>
      <div className="flex h-[97%] w-[98%] flex-col items-center justify-center gap-5 rounded-2xl py-2">
        <div className="h-3.5 w-3/5 rounded-lg bg-gray-300" />
        <div className="h-10 w-2/5 rounded-lg bg-gray-300" />
      </div>
    </div>
  );

  // ── Empty state ────────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-[fadeIn_0.4s_ease-in-out]">
      <span className="animate-bounce text-6xl">📊</span>
      <p className="text-xl font-bold text-gray-500">
        Chưa có dữ liệu thống kê
      </p>
      <p className="max-w-xs text-center text-sm leading-relaxed text-gray-400">
        Vui lòng chọn <strong>học sinh</strong> và{" "}
        <strong>khoảng thời gian</strong> ở bộ lọc bên trái để xem thống kê.
      </p>
    </div>
  );

  return (
    <div className="h-full w-full p-5 flex flex-row gap-5">
      {/** Aside filter */}
      <Filter
        hasStudentSelectBox
        filter={handleFilter}
        studentList={studentList}
      />
      {/** Main */}
      <div className="flex flex-col gap-12 flex-1 h-full overflow-y-auto">
        {/** Learning Statistic */}
        <div className="flex flex-col gap-4">
          <label className="text-xl font-medium">Thống kê học tập</label>

          {isFilterLoading ? (
            <div className="flex flex-row gap-4 w-full">
              <SkeletonCard extraClass="h-40 w-1/3" />
              <SkeletonCard extraClass="h-40 w-1/3" />
              <SkeletonCard extraClass="h-40 w-1/3" />
            </div>
          ) : !studentStats ? (
            <EmptyState />
          ) : (
            <div className="flex flex-row gap-4 w-full">
              {/** Topics Number */}
              <div className="h-40 w-1/3 rounded-2xl bg-[#3B84F2]">
                <div className="flex flex-col bg-white border-2 border-[#3B84F2] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                  <label className="cursor-pointer text-[16px] font-bold text-[#3B84F2] w-full text-center">
                    Số chủ đề đã học
                  </label>
                  <span className="text-5xl font-bold mt-2 text-[#3B84F2] mr-auto ml-auto select-none">
                    {studentStats.study.topicsLearned}
                  </span>
                </div>
              </div>
              {/** Accuracy */}
              <div className="h-40 w-1/3 rounded-2xl bg-[#3BB766]">
                <div className="flex flex-col bg-white border-2 border-[#3BB766] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                  <label className="cursor-pointer text-[16px] font-bold text-[#3BB766] w-full text-center">
                    Tỉ lệ làm đúng
                  </label>
                  <span className="text-5xl font-bold mt-2 text-[#3BB766] mr-auto ml-auto select-none">
                    {studentStats.study.correctRate}%
                  </span>
                </div>
              </div>
              {/** Active Hours */}
              <div className="h-40 w-1/3 rounded-2xl bg-[#FF1493]">
                <div className="flex flex-col bg-white border-2 border-[#FF1493] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                  <label className="cursor-pointer text-[16px] font-bold text-[#FF1493] w-full text-center">
                    Số giờ hoạt động
                  </label>
                  <span className="text-5xl font-bold mt-2 text-[#FF1493] mr-auto ml-auto select-none">
                    {studentStats.study.activeHours}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/** Arena Statistic */}
        <div className="flex flex-col gap-4">
          <label className="text-xl font-medium">Thống kê đấu trường</label>

          {isFilterLoading ? (
            <div className="flex flex-1 flex-row gap-5 w-full">
              {/** Rank skeleton */}
              <div className="animate-pulse aspect-square h-80 w-[35%] rounded-2xl bg-gray-200 flex flex-col items-center justify-center gap-4 p-4">
                <div className="h-4 w-2/3 rounded-lg bg-gray-300" />
                <div className="h-24 w-24 rounded-full bg-gray-300" />
                <div className="h-10 w-full rounded-xl bg-gray-300" />
              </div>
              {/** Arena data skeletons */}
              <div className="flex flex-1 flex-row flex-wrap gap-x-4 gap-y-2">
                <SkeletonCard extraClass="h-38 w-[48%]" />
                <SkeletonCard extraClass="h-38 w-[48%]" />
                <SkeletonCard extraClass="h-38 w-[48%]" />
                <SkeletonCard extraClass="h-38 w-[48%]" />
              </div>
            </div>
          ) : !studentStats ? null : (
            <div className="flex flex-1 flex-row gap-5 w-full">
              {/** Rank */}
              <div
                className="flex flex-col aspect-square h-80 border-2 rounded-2xl w-[35%] items-center justify-center gap-3 px-5 shadow-lg"
                style={{
                  borderColor: selectedStudentRank?.color,
                  boxShadow: `0 0 10px ${selectedStudentRank?.color}`,
                }}
              >
                <label className="text-xl font-bold text-[rgba(0,0,0,0.5)]">
                  Bậc xếp hạng hiện tại
                </label>
                <Image
                  src={toCloudinaryWebP(selectedStudentRank?.badge || "")}
                  alt="rank"
                  height={200}
                  width={200}
                  className="flex aspect-square h-[60%] w-auto"
                />
                <span
                  className="h-12 w-full px-3 flex items-center justify-center rounded-xl text-white font-bold shadow-lg"
                  style={{
                    backgroundColor: selectedStudentRank?.color,
                  }}
                >
                  {selectedStudentRank?.title}
                </span>
              </div>
              {/** Arena Data */}
              <div className="flex flex-1 flex-row flex-wrap gap-x-4 gap-y-2">
                {/** Battle Points */}
                <div className="h-38 w-[48%] rounded-2xl bg-[#C03603]">
                  <div className="flex flex-col bg-white border-2 border-[#C03603] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                    <label className="cursor-pointer text-[16px] font-bold text-[#C03603] w-full text-center">
                      Battle Points
                    </label>
                    <span className="text-5xl font-bold mt-2 text-[#C03603] mr-auto ml-auto select-none">
                      {formatNumberAbbreviation(
                        studentStats.arena.battlePoints,
                      )}
                    </span>
                  </div>
                </div>

                <div className="h-38 w-[48%] rounded-2xl bg-[#F9740B]">
                  <div className="flex flex-col bg-white border-2 border-[#F9740B] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                    <label className="cursor-pointer text-[16px] font-bold text-[#F9740B] w-full text-center">
                      Xếp hạng tuần
                    </label>
                    <span className="text-5xl font-bold mt-2 text-[#F9740B] mr-auto ml-auto select-none">
                      {studentStats.arena.weeklyRank}
                    </span>
                  </div>
                </div>

                <div className="h-38 w-[48%] rounded-2xl bg-[#FF5964]">
                  <div className="flex flex-col bg-white border-2 border-[#FF5964] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                    <label className="cursor-pointer text-[16px] font-bold text-[#FF5964] w-full text-center">
                      Xếp hạng tổng
                    </label>
                    <span className="text-5xl font-bold mt-2 text-[#FF5964] mr-auto ml-auto select-none">
                      {studentStats.arena.overallRank}
                    </span>
                  </div>
                </div>

                <div className="h-38 w-[48%] rounded-2xl bg-[#F1A12E]">
                  <div className="flex flex-col bg-white border-2 border-[#F1A12E] rounded-2xl h-[97%] w-[98%] gap-5 py-2">
                    <label className="cursor-pointer text-[16px] font-bold text-[#F1A12E] w-full text-center">
                      Tỉ lệ làm đúng
                    </label>
                    <span className="text-5xl font-bold mt-2 text-[#F1A12E] mr-auto ml-auto select-none">
                      {studentStats.arena.correctRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
