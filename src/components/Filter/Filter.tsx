"use client";

import { UserProfileResponse } from "@/types";
import {
  faCalendar,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { roboto } from "@/app/fonts";
import { useEffect, useRef, useState } from "react";

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

function parseDateInput(value: string): Date | undefined {
  const trimmed = value.trim();

  if (!trimmed) return undefined;

  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/);
  if (!match) return undefined;

  const [, dayRaw, monthRaw, yearRaw] = match;
  const day = Number(dayRaw);
  const month = Number(monthRaw);
  const year = yearRaw.length === 2 ? Number(`20${yearRaw}`) : Number(yearRaw);

  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getDate() !== day ||
    parsed.getMonth() !== month - 1 ||
    parsed.getFullYear() !== year
  ) {
    return undefined;
  }

  return parsed;
}

function normalizeDateInput(value: string): string {
  const parsed = parseDateInput(value);

  if (!parsed) return value;

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = String(parsed.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

function formatDateForPicker(value?: Date): string {
  if (!value) return "";

  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();

  return `${year}-${month}-${day}`;
}

export default function Filter({
  hasStudentSelectBox = false,
  hasSearchBox = false,
  hasCategorySelectBox = false,
  studentList,
  filter,
}: FilterParams) {
  // Filter state
  const [category, setCategory] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateValue, setStartDateValue] = useState<string>("");
  const [endDateValue, setEndDateValue] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const startDatePickerRef = useRef<HTMLInputElement>(null);
  const endDatePickerRef = useRef<HTMLInputElement>(null);

  const validateDates = () => {
    const parsedStartDate = startDateValue
      ? parseDateInput(startDateValue)
      : undefined;
    const parsedEndDate = endDateValue
      ? parseDateInput(endDateValue)
      : undefined;

    if (startDateValue && !parsedStartDate) {
      return {
        error: "Ngày bắt đầu không hợp lệ. Dùng định dạng dd/mm/yy.",
      };
    }

    if (endDateValue && !parsedEndDate) {
      return {
        error: "Ngày kết thúc không hợp lệ. Dùng định dạng dd/mm/yy.",
      };
    }

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return {
        error: "Từ ngày không được lớn hơn đến ngày.",
      };
    }

    return {
      parsedStartDate,
      parsedEndDate,
      error: "",
    };
  };

  const applyFilter = async (
    nextStartDate?: Date,
    nextEndDate?: Date,
    nextCategory = category,
    nextKeyword = keyword,
  ) => {
    const { parsedStartDate, parsedEndDate, error } = validateDates();

    if (error) {
      setDateError(error);
      return;
    }

    setDateError("");
    setStartDate(parsedStartDate);
    setEndDate(parsedEndDate);

    await filter(
      studentId,
      nextStartDate ?? parsedStartDate,
      nextEndDate ?? parsedEndDate,
      nextCategory,
      nextKeyword,
    );
  };

  const openDatePicker = (
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const input = inputRef.current;

    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  useEffect(() => {
    if (
      studentList &&
      studentList.length > 0 &&
      hasStudentSelectBox &&
      !studentId
    ) {
      setStudentId(studentList[0]._id);
    }
  }, [studentList, hasStudentSelectBox, studentId]);

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
                  <option value="all">Tất cả</option>
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
            <div className="relative h-10 w-60 border border-[rgba(0,0,0,0.2)] rounded-xl pl-3 pr-2 flex items-center gap-2 focus-within:border-[#23BEAA]">
              <input
                value={startDateValue}
                onChange={(e) => {
                  setStartDateValue(e.target.value);
                  if (dateError) setDateError("");
                }}
                onBlur={() => {
                  if (!startDateValue) return;
                  setStartDateValue(normalizeDateInput(startDateValue));
                }}
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/yy"
                className="border-none outline-none h-full flex-1"
              />
              <button
                type="button"
                onClick={() => openDatePicker(startDatePickerRef)}
                className="h-8 w-8 rounded-lg text-[rgba(0,0,0,0.45)] hover:bg-gray-100"
                aria-label="Chọn từ ngày"
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
              <input
                ref={startDatePickerRef}
                value={formatDateForPicker(startDate)}
                onChange={(e) => {
                  const nextDate = e.target.value
                    ? new Date(`${e.target.value}T00:00:00`)
                    : undefined;
                  setStartDate(nextDate);
                  setStartDateValue(
                    nextDate
                      ? normalizeDateInput(
                          `${String(nextDate.getDate()).padStart(2, "0")}/${String(nextDate.getMonth() + 1).padStart(2, "0")}/${nextDate.getFullYear()}`,
                        )
                      : "",
                  );
                  if (dateError) setDateError("");
                }}
                type="date"
                tabIndex={-1}
                className="absolute opacity-0 pointer-events-none h-0 w-0"
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
            <div className="relative h-10 w-60 border border-[rgba(0,0,0,0.2)] rounded-xl pl-3 pr-2 flex items-center gap-2 focus-within:border-[#23BEAA]">
              <input
                value={endDateValue}
                onChange={(e) => {
                  setEndDateValue(e.target.value);
                  if (dateError) setDateError("");
                }}
                onBlur={() => {
                  if (!endDateValue) return;
                  setEndDateValue(normalizeDateInput(endDateValue));
                }}
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/yy"
                className="border-none outline-none h-full flex-1"
              />
              <button
                type="button"
                onClick={() => openDatePicker(endDatePickerRef)}
                className="h-8 w-8 rounded-lg text-[rgba(0,0,0,0.45)] hover:bg-gray-100"
                aria-label="Chọn đến ngày"
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
              <input
                ref={endDatePickerRef}
                value={formatDateForPicker(endDate)}
                onChange={(e) => {
                  const nextDate = e.target.value
                    ? new Date(`${e.target.value}T00:00:00`)
                    : undefined;
                  setEndDate(nextDate);
                  setEndDateValue(
                    nextDate
                      ? normalizeDateInput(
                          `${String(nextDate.getDate()).padStart(2, "0")}/${String(nextDate.getMonth() + 1).padStart(2, "0")}/${nextDate.getFullYear()}`,
                        )
                      : "",
                  );
                  if (dateError) setDateError("");
                }}
                type="date"
                tabIndex={-1}
                className="absolute opacity-0 pointer-events-none h-0 w-0"
              />
            </div>
          </div>
          {dateError && (
            <span className="text-sm text-[#FF5964]">{dateError}</span>
          )}
          {/** Clear button */}
          <div
            onClick={async () => {
              setStartDate(undefined);
              setEndDate(undefined);
              setStartDateValue("");
              setEndDateValue("");
              setDateError("");
              await filter(studentId, undefined, undefined, category, keyword);
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
          onClick={() => applyFilter(startDate, endDate, category, keyword)}
          className="h-12 w-full bg-[#8A2BE2] rounded-xl text-white font-medium cursor-pointer hover:opacity-90
                                flex items-center justify-center mt-auto mb-0"
        >
          Lọc kết quả
        </div>
      </div>
    </div>
  );
}
