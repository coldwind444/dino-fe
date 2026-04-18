"use client";

import { UserProfileResponse } from "@/types";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Roboto } from "next/font/google";
import { useState } from "react";

type FilterParams = {
  hasStudentSelectBox?: boolean;
  hasSearchBox?: boolean;
  hasCategorySelectBox?: boolean;
  studentList: UserProfileResponse[];
  filter: (
    studentId?: string,
    startDate?: Date,
    endDate?: Date,
    category?: string,
    keyword?: string,
  ) => Promise<void>;
};

const roboto = Roboto();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Filter({
  hasStudentSelectBox = false,
  hasSearchBox = false,
  hasCategorySelectBox = false,
  studentList,
  filter,
}: FilterParams) {
  // Filter state
  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [studentId, setStudentId] = useState<string>("");

  return (
    <div className="bg-white rounded-2xl h-full min-w-[420px] shadow-[0_0_10px_rgba(0,0,0,0.25)] flex flex-col gap-4 p-5">
      {/** Header */}
      <div className="flex flex-row gap-2 items-center">
        <FontAwesomeIcon icon={faFilter} />
        <label className="text-xl font-medium">Bộ lọc</label>
      </div>
      {/** Fields Container */}
      <div className="flex flex-col gap-10 mt-5 p-4 flex-1">
        {/** Student and Category */}
        <div className="flex flex-col gap-3">
          {/** Student Select */}
          {hasStudentSelectBox && (
            <div className="flex flex-row items-center justify-between">
              <label
                className={clsx(
                  "font-medium text-[rgba(0,0,0,0.5)]",
                  roboto.className,
                )}
              >
                Học sinh:
              </label>
              <div className="h-10 w-60 border border-[rgba(0,0,0,0.2)] rounded-xl pl-3 flex items-center focus-within:border-[#23BEAA]">
                <select
                  className="h-full w-[95%] outline-none border-none cursor-pointer font-medium"
                  name="student-select"
                  id="std-sl"
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {studentList.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {hasCategorySelectBox && (
            <div className="flex flex-row items-center justify-between">
              <label
                className={clsx(
                  "font-medium text-[rgba(0,0,0,0.5)]",
                  roboto.className,
                )}
              >
                Phân loại:
              </label>
              <div className="h-10 w-60 border border-[rgba(0,0,0,0.2)] rounded-xl pl-3 flex items-center focus-within:border-[#23BEAA]">
                <select
                  className="h-full w-[95%] outline-none border-none cursor-pointer font-medium"
                  name="category-select"
                  id="ctg-sl"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="arena">Đấu trường</option>
                  <option value="exercise">Bài tập</option>
                  <option value="assessment">Kiểm tra đầu vào</option>
                </select>
              </div>
            </div>
          )}
        </div>
        {/** Date Pickers */}
        <div className="flex flex-col gap-3">
          {/** Start */}
          <div className="flex flex-row justify-between items-center">
            <label
              className={clsx(
                "font-medium text-[rgba(0,0,0,0.5)]",
                roboto.className,
              )}
            >
              Từ ngày:
            </label>
            <div className="h-10 w-60 border border-[rgba(0,0,0,0.2)] rounded-xl pl-3 flex items-center focus-within:border-[#23BEAA]">
              <input
                onChange={(e) => setStartDate(new Date(e.target.value))}
                type="date"
                placeholder="dd-MM-yyyy"
                className="border-none outline-none h-full w-[90%]"
              />
            </div>
          </div>
          {/** End */}
          <div className="flex flex-row justify-between items-center">
            <label
              className={clsx(
                "font-medium text-[rgba(0,0,0,0.5)]",
                roboto.className,
              )}
            >
              Đến ngày:
            </label>
            <div className="h-10 w-60 border border-[rgba(0,0,0,0.2)] rounded-xl pl-3 flex items-center focus-within:border-[#23BEAA]">
              <input
                onChange={(e) => setEndDate(new Date(e.target.value))}
                type="date"
                placeholder="dd-MM-yyyy"
                className="border-none outline-none h-full w-[90%]"
              />
            </div>
          </div>
          {/** Clear button */}
          <div
            onClick={() => {
              setStartDate(new Date());
              setEndDate(new Date());
            }}
            className="h-fit w-fit px-5 py-2 text-white bg-[#FF5964] rounded-xl ml-auto mr-0 cursor-pointer hover:opacity-90"
          >
            Đặt lại ngày
          </div>
        </div>
        {/** Search box */}
        {hasSearchBox && (
          <div className="flex flex-col gap-1">
            <label
              className={clsx(
                "font-medium text-[rgba(0,0,0,0.5)]",
                roboto.className,
              )}
            >
              Nhập từ khóa tìm kiếm
            </label>
            <div
              className="h-12 w-full border border-[rgba(0,0,0,0.2)] rounded-xl px-3 
                                    flex items-center focus-within:border-[#23BEAA] gap-2"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="text-[rgba(0,0,0,0.25)]"
              />
              <input
                onChange={(e) => setKeyword(e.target.value)}
                type="search"
                placeholder="Tìm kiếm..."
                className="border-none outline-none h-full flex-1"
              />
            </div>
          </div>
        )}
        {/** Filter button */}
        <div
          onClick={() =>
            filter(studentId, startDate, endDate, category, keyword)
          }
          className="h-12 w-full bg-[#8A2BE2] rounded-xl text-white font-medium cursor-pointer hover:opacity-90
                                flex items-center justify-center mt-auto mb-0"
        >
          Lọc kết quả
        </div>
      </div>
    </div>
  );
}
