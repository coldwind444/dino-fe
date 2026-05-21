"use client";

import {
  faCalendar as faCalendarSolid,
  faClipboardQuestion,
  faClock as faClockSolid,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AnswerDetailData,
  RAW_TYPE_DISPLAY,
} from "@/components/AnswerDetail/AnswerDetail";
import AnswerDetail from "@/components/AnswerDetail/AnswerDetail";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HistoryRecord, AnswerResponse, ExerciseResponse } from "@/types";
import { getAnswers } from "@/apis/study";
import { APIError } from "@/apis/config";

interface HistoryDetailProps {
  onBack: () => void;
  record?: HistoryRecord;
}

function mapAnswerToDetail(
  answer: AnswerResponse,
  idx: number,
): AnswerDetailData | null {
  const ex = (answer.exercise ??
    (typeof answer.exerciseId === "object" ? answer.exerciseId : undefined)) as
    | ExerciseResponse
    | undefined;
  if (!ex) return null;

  const rawType = ex.type ?? "unknown";
  const displayTypeName = RAW_TYPE_DISPLAY[rawType] ?? rawType;
  const questionNumber = idx + 1;
  const status = answer.isCorrect ? "correct" : "wrong";
  const question = ex.question || ex.content || "";

  return {
    questionNumber,
    status,
    question,
    displayTypeName,
    rawType,
    studentAnswer: answer.answerData,
    correctAnswer:
      rawType === "matching"
        ? (ex.pairs ?? null)
        : rawType === "draw" || rawType === "geoboard"
          ? ex.options?.length
            ? ex.options
            : (ex.correctAnswer ?? ex.pairs ?? null)
          : (ex.correctAnswer ?? ex.pairs ?? null),
  };
}

export default function HistoryDetail({ onBack, record }: HistoryDetailProps) {
  const [answerDetails, setAnswerDetails] = useState<AnswerDetailData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveCorrect, setLiveCorrect] = useState<number | null>(null);
  const [liveTotal, setLiveTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!record?._id || !record?.category) return;
    const { _id: id, category } = record;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        let answerQueryParam: Record<string, string> = {};

        if (category === "exercise") {
          answerQueryParam = { lectureResultId: id };
        } else if (category === "arena") {
          answerQueryParam = { arenaParticipationId: id };
        } else if (category === "assessment") {
          answerQueryParam = { assessmentResultId: id };
        }

        const answers = await getAnswers({
          ...answerQueryParam,
          populate: "exerciseId",
          limit: 1000,
        });

        console.log("[HistoryDetail] Raw answers from backend:", answers);

        const mapped = answers
          .map((a, i) => mapAnswerToDetail(a, i))
          .filter((x): x is AnswerDetailData => x !== null);
        setAnswerDetails(mapped);
        setLiveTotal(answers.length);
        setLiveCorrect(answers.filter((a) => a.isCorrect).length);
      } catch (err) {
        if (err instanceof APIError) {
          console.log(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [record]);

  const totalQ = record?.totalQuestions ?? liveTotal ?? 0;
  const correctQ = record?.correctCount ?? liveCorrect ?? 0;
  const wrongQ = totalQ - correctQ;
  const title = record?.name ?? "Chi tiết bài làm";
  const dateStr = record?.date ?? "—";
  const duration = record?.duration ?? "—";

  return (
    <div className="flex flex-col gap-5 p-5 h-screen w-full">
      {/** Main */}
      <div className="flex-1 w-full flex flex-row gap-5 h-full">
        {/** Statistic */}
        <div className="flex flex-col gap-3 h-full w-1/3">
          {/** Links */}
          <span className="flex h-fit flex-row gap-2 font-medium ml-3">
            <Link
              onClick={onBack}
              className="text-[rgba(0,0,0,0.5)] cursor-pointer hover:underline"
              href=""
              data-testid="back-link"
            >
              Lịch sử
            </Link>
            <label className="text-[rgba(0,0,0,0.5)]">{">"}</label>
            <Link className="text-teal-500 cursor-pointer hover:underline" href="">
              Chi tiết bài làm - {title}
            </Link>
          </span>
          {/** Name */}
          <div
            className="h-30 w-full bg-gradient-to-r from-0% to-100% 
                            from-[#23BEAA] to-[#1DA492] rounded-xl shadow-lg px-10
                            flex flex-col gap-3 text-white justify-center"
          >
            <h1 className="font-bold text-2xl truncate">{title}</h1>
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon className="text-xl" icon={faCalendarSolid} />
              <label>{dateStr}</label>
            </div>
          </div>
          {/** Data */}
          <div className="flex flex-row gap-x-2 gap-y-3 flex-wrap w-full">
            <div
              className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#FE6EBC] to-100% to-[#FC098D] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg"
            >
              <label className="font-medium">Tổng số câu hỏi</label>
              <label className="ml-auto mr-auto mt-4 text-5xl font-medium">
                {isLoading ? "…" : totalQ}
              </label>
              <FontAwesomeIcon
                icon={faClipboardQuestion}
                className="absolute top-0 right-0 text-2xl mt-3 mr-3"
              />
            </div>
            <div
              className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#5A9CFF] to-100% to-[#0066FF] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg"
            >
              <label className="font-medium">Thời gian</label>
              <label className="ml-auto mr-auto mt-5 text-3xl font-medium">
                {duration}
              </label>
              <FontAwesomeIcon
                icon={faClockSolid}
                className="absolute top-0 right-0 text-2xl mt-3 mr-3"
              />
            </div>
            <div
              className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#3BC16A] to-100% to-[#01A139] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg"
            >
              <label className="font-medium">Số câu đúng</label>
              <label className="ml-auto mr-auto mt-4 text-5xl font-medium">
                {isLoading ? "…" : correctQ}
              </label>
              <FontAwesomeIcon
                icon={faCheck}
                className="absolute top-0 right-0 text-2xl mt-3 mr-3"
              />
            </div>
            <div
              className="flex flex-col h-50 w-[49%] bg-gradient-to-r from-0% from-[#FF5661] to-100% to-[#D02833] 
                            text-white rounded-xl px-5 py-2.5 gap-8 relative shadow-lg"
            >
              <label className="font-medium">Số câu sai</label>
              <label className="ml-auto mr-auto mt-4 text-5xl font-medium">
                {isLoading ? "…" : wrongQ}
              </label>
              <FontAwesomeIcon
                icon={faXmark}
                className="absolute top-0 right-0 text-2xl mt-3 mr-3"
              />
            </div>
          </div>
        </div>
        {/** Details */}
        <div className="flex flex-col gap-3 flex-1 h-full">
          <label className="font-medium text-[17px] text-[rgba(0,0,0,0.5)]">
            Chi tiết bài làm
          </label>
          <div className="flex flex-col w-full pr-10 overflow-y-auto h-[80%]">
            {isLoading ? (
              <p className="text-[rgba(0,0,0,0.5)]">Đang tải...</p>
            ) : answerDetails.length === 0 ? (
              <p className="text-[rgba(0,0,0,0.5)]">
                Không có dữ liệu chi tiết.
              </p>
            ) : (
              answerDetails.map((item, index) => (
                <AnswerDetail key={index} data={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
