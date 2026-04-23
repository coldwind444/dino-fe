import React from "react";
import clsx from "clsx";

// ----------------------
// Raw answer data shapes
// ----------------------
export type RawAnswerData =
  | { type: "choice"; data: { selectedIndex: number } | null }
  | { type: "multiple_choice"; data: { selectedIndex: number } | null }
  | { type: "true_false"; data: { selectedAnswer: boolean | null } }
  | { type: "drag"; data: { answer: string } | null }
  | {
      type: "fill_in";
      data: { answer1: string; answer2: string; answer3: string };
    }
  | {
      type: "fill";
      data: { answer1: string; answer2: string; answer3: string };
    }
  | { type: "matching"; data: { answer: string; placedCorrectly: boolean }[] }
  | { type: "match"; data: { answer: string; placedCorrectly: boolean }[] }
  | { type: "tree"; data: { tapCount: number } }
  | { type: "cage"; data: { selectedIndex: number } | null }
  | { type: "scale"; data: { weights: number[]; total: number } }
  | { type: "manualScale"; data: { placedValue: number | null } }
  | { type: "manual_scale"; data: { placedValue: number | null } }
  | { type: "releasebird"; data: { releasedCount: number } }
  | { type: "release_bird"; data: { releasedCount: number } }
  | { type: "transport"; data: { totalValue: number } }
  | { type: "bus"; data: { totalValue: number } }
  | { type: "coin"; data: { coins: number[]; total: number } }
  | { type: "machine"; data: { coins: number[]; total: number } }
  | { type: "gumball"; data: { answer: string } }
  | {
      type: "fraction";
      data: {
        type0Count: number;
        type1Count: number;
        type2Count: number;
        type3Count: number;
      };
    }
  | {
      type: "pizza";
      data: {
        type0Count: number;
        type1Count: number;
        type2Count: number;
        type3Count: number;
      };
    }
  | {
      type: "geoboard";
      data: {
        triangle: number;
        square: number;
        rectangle: number;
        rhombus: number;
        parallelogram: number;
      };
    }
  | {
      type: "draw";
      data: {
        triangle: number;
        square: number;
        rectangle: number;
        rhombus: number;
        parallelogram: number;
      };
    }
  | { type: "clock"; data: { hour: number; minute: number } }
  | {
      type: "even";
      data: { number: number; classification: "even" | "odd" | "none" }[];
    }
  | { type: "burger"; data: string[][] };

// ----------------------
// Normalized exercise types (for routing render)
// ----------------------
export type NormalizedType =
  | "multiple-choice"
  | "true-false"
  | "matching"
  | "fill-in-blank"
  | "interactive";

// ----------------------
// Core AnswerDetailData
// ----------------------
export type AnswerDetailData = {
  questionNumber: number;
  status: "correct" | "wrong" | "partial";
  question: string;
  displayTypeName: string; // tên tiếng Việt hiển thị (từ raw type)
  rawType: string; // raw type từ backend
  studentAnswer: RawAnswerData["data"] | unknown;
  correctAnswer: unknown; // tuỳ loại
};

export interface AnswerDetailProps {
  data: AnswerDetailData;
}

// ----------------------
// Display name map
// ----------------------
export const RAW_TYPE_DISPLAY: Record<string, string> = {
  matching: "Ghép nối",
  choice: "Trắc nghiệm",
  interactive: "Tương tác",
  tutorial: "Hướng dẫn",
  true_false: "Đúng/Sai",
  fill_in: "Điền khuyết",
  releasebird: "Thả chim",
  scale: "Cân bằng",
  tree: "Đếm trên cây",
  cage: "Chọn lồng",
  transport: "Phương tiện",
  set_time: "Đặt giờ",
  coin: "Đồng xu",
  gumball: "Kẹo gumball",
  burger: "Xếp burger",
  fraction: "Phân số",
  manualScale: "Cân thủ công",
  draw: "Vẽ",
};

const BURGER_INGREDIENT_NAMES: Record<number, string> = {
  0: "Bánh mì",
  1: "Rau xà lách",
  2: "Cà chua",
  3: "Phô mai",
  4: "Thịt bò",
};

const DRAW_SHAPE_KEYS = [
  "triangle",
  "square",
  "rectangle",
  "rhombus",
  "parallelogram",
] as const;

const DRAW_SHAPE_LABELS: Record<(typeof DRAW_SHAPE_KEYS)[number], string> = {
  triangle: "Tam giác",
  square: "Hình vuông",
  rectangle: "Hình chữ nhật",
  rhombus: "Hình thoi",
  parallelogram: "Hình bình hành",
};

function burgerIngredientName(val: string | number): string {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  return BURGER_INGREDIENT_NAMES[num] ?? `Nguyên liệu ${val}`;
}

function normalizeDrawAnswer(
  value: unknown,
): Partial<Record<(typeof DRAW_SHAPE_KEYS)[number], number>> | null {
  if (Array.isArray(value)) {
    return DRAW_SHAPE_KEYS.reduce<
      Partial<Record<(typeof DRAW_SHAPE_KEYS)[number], number>>
    >((acc, key, index) => {
      const rawValue = value[index];
      const parsed = Number(rawValue);
      acc[key] = Number.isFinite(parsed) ? parsed : 0;
      return acc;
    }, {});
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return null;

    try {
      return normalizeDrawAnswer(JSON.parse(trimmed));
    } catch {
      if (trimmed.includes(",")) {
        return normalizeDrawAnswer(
          trimmed.split(",").map((item) => item.trim()),
        );
      }
    }

    return null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return DRAW_SHAPE_KEYS.reduce<
      Partial<Record<(typeof DRAW_SHAPE_KEYS)[number], number>>
    >((acc, key) => {
      const parsed = Number(record[key]);
      acc[key] = Number.isFinite(parsed) ? parsed : 0;
      return acc;
    }, {});
  }

  return null;
}

function hasDrawAnswerValue(
  value: Partial<Record<(typeof DRAW_SHAPE_KEYS)[number], number>> | null,
) {
  return Boolean(value && DRAW_SHAPE_KEYS.some((key) => (value[key] ?? 0) > 0));
}

function normalizeMatchPairs(
  value: unknown,
): { left: string; right: string }[] {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is { left: unknown; right: unknown } =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
      .map((item) => ({
        left: String(item.left ?? ""),
        right: String(item.right ?? ""),
      }));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      return normalizeMatchPairs(JSON.parse(trimmed));
    } catch {
      return [];
    }
  }

  return [];
}

// ----------------------
// Main component
// ----------------------
export default function AnswerDetail({ data }: AnswerDetailProps) {
  const {
    questionNumber,
    status,
    question,
    displayTypeName,
    rawType,
    studentAnswer,
    correctAnswer,
  } = data;

  return (
    <div
      className={clsx(
        "w-full rounded-2xl p-5 border mb-6",
        status === "correct" && "border-green-400 bg-green-50",
        status === "wrong" && "border-red-400 bg-red-50",
        status === "partial" && "border-orange-400 bg-orange-50",
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-sm font-semibold",
              status === "correct" && "bg-green-500 text-white",
              status === "wrong" && "bg-red-500 text-white",
              status === "partial" && "bg-orange-500 text-white",
            )}
          >
            {status === "correct"
              ? "Đúng"
              : status === "wrong"
                ? "Sai"
                : "Đúng một phần"}
          </span>
          <span className="font-medium">Câu số {questionNumber}:</span>
        </div>
        <span className="px-3 py-1 rounded-lg bg-gray-200 text-sm font-medium">
          {displayTypeName}
        </span>
      </div>

      {/* Question */}
      <p className="font-medium mb-4">{question}</p>

      {/* Render answer detail by rawType */}
      <AnswerBody
        rawType={rawType}
        studentAnswer={studentAnswer}
        correctAnswer={correctAnswer}
        status={status}
      />
    </div>
  );
}

// ----------------------
// AnswerBody dispatcher
// ----------------------
function AnswerBody({
  rawType,
  studentAnswer,
  correctAnswer,
  status,
}: {
  rawType: string;
  studentAnswer: unknown;
  correctAnswer: unknown;
  status: "correct" | "wrong" | "partial";
}) {
  const isCorrect = status === "correct";

  const correctStr =
    correctAnswer != null ? String(correctAnswer as string) : "—";
  if (
    [
      "choice",
      "multiple_choice",
      "multipleChoice",
      "cage",
      "releasebird",
      "release_bird",
    ].includes(rawType)
  ) {
    const sa = studentAnswer as {
      selectedIndex?: number;
      releasedCount?: number;
    } | null;
    const ca = correctAnswer as string | number | null;
    const displayStudent =
      sa == null
        ? "Học sinh chưa nhập đáp án"
        : sa.selectedIndex !== undefined
          ? `Đáp án ${sa.selectedIndex + 1}`
          : sa.releasedCount !== undefined
            ? `${sa.releasedCount} con`
            : JSON.stringify(sa);
    return (
      <TwoRow
        studentLabel={displayStudent}
        correctLabel={ca !== null && ca !== undefined ? String(ca) : "—"}
        isCorrect={isCorrect}
      />
    );
  }

  // --- true / false ---
  if (["true_false", "trueFalse"].includes(rawType)) {
    const sa = studentAnswer as { selectedAnswer: boolean | null } | null;
    const ca = correctAnswer as boolean | "Đúng" | "Sai" | null;
    const displayStudent =
      sa == null || sa?.selectedAnswer == null
        ? "Học sinh chưa nhập đáp án"
        : sa.selectedAnswer
          ? "Đúng"
          : "Sai";
    const displayCorrect = ca === true || ca === "Đúng" ? "Đúng" : "Sai";
    return (
      <TwoRow
        studentLabel={displayStudent}
        correctLabel={displayCorrect}
        isCorrect={isCorrect}
      />
    );
  }

  // --- drag ---
  if (rawType === "drag") {
    const sa = studentAnswer as { answer: string } | null;
    const ca = correctAnswer as string | null;
    return (
      <TwoRow
        studentLabel={sa?.answer ?? "Học sinh chưa nhập đáp án"}
        correctLabel={ca ?? "—"}
        isCorrect={isCorrect}
      />
    );
  }

  if (
    [
      "fill_in",
      "fill",
      "fillIn",
      "fillInBlank",
      "interactive",
      "tutorial",
    ].includes(rawType)
  ) {
    const sa = studentAnswer as Record<string, string> | string[] | null;
    let studentArr: string[] = [];
    if (Array.isArray(sa)) {
      studentArr = sa;
    } else if (sa && typeof sa === "object") {
      studentArr = Object.values(sa).filter(Boolean);
    }
    let correctArr: string[] = [];
    try {
      const parsed = JSON.parse(correctAnswer as string);
      correctArr = Array.isArray(parsed) ? parsed : [String(correctAnswer)];
    } catch {
      correctArr = correctAnswer ? [String(correctAnswer)] : [];
    }
    return <FillDetail studentArr={studentArr} correctArr={correctArr} />;
  }

  // --- match ---
  if (["match", "matching"].includes(rawType)) {
    const sa = studentAnswer as
      | { answer: string; placedCorrectly: boolean }[]
      | null;
    const ca = normalizeMatchPairs(correctAnswer);
    return <MatchDetail studentPairs={sa ?? []} correctPairs={ca} />;
  }

  // --- scale ---
  if (rawType === "scale") {
    const sa = studentAnswer as { weights: number[]; total: number } | null;
    const ca = correctAnswer as number | null;
    return (
      <div className="flex flex-col gap-2 text-sm">
        <Row
          label="Tổng học sinh đặt"
          value={sa ? `${sa.total}` : "Học sinh chưa nhập đáp án"}
          isCorrect={isCorrect}
        />
        <Row label="Các quả cân" value={sa ? sa.weights.join(", ") : "—"} />
        <Row
          label="Đáp án đúng"
          value={ca !== null ? String(ca) : "—"}
          isAnswer
        />
      </div>
    );
  }

  // --- manual_scale ---
  if (["manual_scale", "manualScale"].includes(rawType)) {
    const sa = studentAnswer as { placedValue: number | null } | null;
    const ca = correctAnswer as number | null;
    return (
      <TwoRow
        studentLabel={
          sa?.placedValue !== null && sa?.placedValue !== undefined
            ? String(sa.placedValue)
            : "Học sinh chưa nhập đáp án"
        }
        correctLabel={ca !== null ? String(ca) : "—"}
        isCorrect={isCorrect}
      />
    );
  }

  // --- tree ---
  if (rawType === "tree") {
    const sa = studentAnswer as { tapCount: number } | null;
    const ca = correctAnswer as number | null;
    return (
      <TwoRow
        studentLabel={sa ? `${sa.tapCount} lần` : "Học sinh chưa nhập đáp án"}
        correctLabel={ca !== null ? `${ca} lần` : "—"}
        isCorrect={isCorrect}
      />
    );
  }

  if (["bus", "transport"].includes(rawType)) {
    const sa = studentAnswer as { totalValue: number } | null;
    const ca = correctAnswer as number | null;
    return (
      <TwoRow
        studentLabel={
          sa != null ? String(sa.totalValue) : "Học sinh chưa nhập đáp án"
        }
        correctLabel={ca !== null ? String(ca) : "—"}
        isCorrect={isCorrect}
      />
    );
  }

  // --- machine / coin ---
  if (["machine", "coin"].includes(rawType)) {
    const sa = studentAnswer as { coins: number[]; total: number } | null;
    const ca = correctAnswer as number | null;
    return (
      <div className="flex flex-col gap-2 text-sm">
        <Row
          label="Học sinh điền"
          value={sa != null ? String(sa.total) : "Học sinh chưa nhập đáp án"}
          isCorrect={isCorrect}
        />
        <Row
          label="Đáp án đúng"
          value={ca !== null ? String(ca) : "—"}
          isAnswer
        />
      </div>
    );
  }

  if (rawType === "gumball") {
    const sa = studentAnswer as { answer: string } | null;
    const ca = correctAnswer as string | null;
    return (
      <TwoRow
        studentLabel={sa?.answer ?? "Học sinh chưa nhập đáp án"}
        correctLabel={ca ?? "—"}
        isCorrect={isCorrect}
      />
    );
  }

  // --- pizza ---
  if (rawType === "fraction" || rawType === "pizza") {
    const sa = studentAnswer as Record<string, number> | null;
    const pizzaLabels: Record<string, string> = {
      type0Count: "Rau củ",
      type1Count: "Xúc xích",
      type2Count: "Tôm",
      type3Count: "Dứa",
    };

    const pizzaKeys = ["type0Count", "type1Count", "type2Count", "type3Count"];
    let caObj: Record<string, number> | null = null;
    if (
      correctAnswer &&
      typeof correctAnswer === "object" &&
      !Array.isArray(correctAnswer)
    ) {
      caObj = correctAnswer as Record<string, number>;
    } else if (
      typeof correctAnswer === "string" &&
      correctAnswer.includes(",")
    ) {
      caObj = Object.fromEntries(
        correctAnswer
          .split(",")
          .map((v, i) => [pizzaKeys[i] ?? `type${i}Count`, Number(v.trim())]),
      );
    }

    const isEmpty = !sa || Object.values(sa).every((v) => v === 0 || v == null);
    return (
      <div className="flex flex-col gap-2 text-sm">
        <div className="font-medium">Câu trả lời của học sinh:</div>
        <div className="flex flex-wrap gap-2">
          {!isEmpty ? (
            Object.entries(sa!).map(([key, val]) => (
              <span
                key={key}
                className="px-3 py-1 rounded-lg border bg-gray-100 border-gray-300"
              >
                {pizzaLabels[key] ?? key}: <strong>{val}</strong>
              </span>
            ))
          ) : (
            <span className="text-gray-400">Học sinh chưa nhập đáp án</span>
          )}
        </div>
        <div className="font-medium mt-1">Đáp án:</div>
        <div className="flex flex-wrap gap-2">
          {caObj ? (
            Object.entries(caObj).map(([key, val]) => (
              <span
                key={key}
                className="px-3 py-1 rounded-lg border bg-gray-100 border-gray-300"
              >
                {pizzaLabels[key] ?? key}: <strong>{val}</strong>
              </span>
            ))
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </div>
    );
  }

  if (rawType === "draw" || rawType === "geoboard") {
    const sa = normalizeDrawAnswer(studentAnswer);
    const ca = normalizeDrawAnswer(correctAnswer);
    return (
      <div className="flex flex-col gap-2 text-sm">
        <div className="font-medium">Câu trả lời của học sinh:</div>
        <div className="flex flex-wrap gap-2">
          {hasDrawAnswerValue(sa) ? (
            DRAW_SHAPE_KEYS.map((key) => (
              <span
                key={key}
                className="px-3 py-1 rounded-lg border bg-gray-100 border-gray-300"
              >
                {DRAW_SHAPE_LABELS[key]}: <strong>{sa?.[key] ?? 0}</strong>
              </span>
            ))
          ) : (
            <span className="text-gray-400">Học sinh chưa nhập đáp án</span>
          )}
        </div>
        <div className="font-medium mt-1">Đáp án:</div>
        <div className="flex flex-wrap gap-2">
          {hasDrawAnswerValue(ca) ? (
            DRAW_SHAPE_KEYS.map((key) => (
              <span
                key={key}
                className="px-3 py-1 rounded-lg border bg-gray-100 border-gray-300"
              >
                {DRAW_SHAPE_LABELS[key]}: <strong>{ca?.[key] ?? 0}</strong>
              </span>
            ))
          ) : (
            <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit">
              {correctStr}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (["clock", "set_time"].includes(rawType)) {
    const sa = studentAnswer as { hour: number; minute: number } | null;
    const ca = correctAnswer as
      | { hour: number; minute: number }
      | string
      | null;
    const formatTime = (h: number, m: number) =>
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const displayStudent = sa
      ? formatTime(sa.hour, sa.minute)
      : "Học sinh chưa nhập đáp án";
    const displayCorrect =
      ca && typeof ca === "object" && "hour" in ca
        ? formatTime(ca.hour, ca.minute)
        : ca
          ? String(ca)
          : "—";
    return (
      <TwoRow
        studentLabel={displayStudent}
        correctLabel={displayCorrect}
        isCorrect={isCorrect}
      />
    );
  }

  if (rawType === "even") {
    const sa = studentAnswer as
      | { number: number; classification: "even" | "odd" | "none" }[]
      | null;
    const classLabel: Record<string, string> = {
      even: "Chẵn",
      odd: "Lẻ",
      none: "Chưa chọn",
    };
    const isEmpty = !sa || sa.length === 0;
    return (
      <div className="flex flex-col gap-2">
        <div className="font-medium text-sm">Câu trả lời của học sinh:</div>
        {isEmpty ? (
          <span className="text-gray-400 text-sm">
            Học sinh chưa nhập đáp án
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sa!.map((item, i) => (
              <span
                key={i}
                className={clsx(
                  "px-3 py-1 rounded-lg text-sm border",
                  item.classification === "even" &&
                    "bg-blue-100 border-blue-400",
                  item.classification === "odd" &&
                    "bg-yellow-100 border-yellow-400",
                  item.classification === "none" &&
                    "bg-gray-100 border-gray-300",
                )}
              >
                {item.number} ({classLabel[item.classification]})
              </span>
            ))}
          </div>
        )}
        {correctStr !== "—" && (
          <>
            <div className="font-medium text-sm mt-2">Đáp án:</div>
            <div className="text-sm text-gray-600">{correctStr}</div>
          </>
        )}
      </div>
    );
  }

  // --- burger ---
  if (rawType === "burger") {
    const sa = studentAnswer as string[][] | null;
    const isEmpty =
      !sa || sa.length === 0 || sa.every((stack) => stack.length === 0);
    return (
      <div className="flex flex-col gap-2">
        <div className="font-medium text-sm">Câu trả lời của học sinh:</div>
        {isEmpty ? (
          <span className="text-gray-400 text-sm">
            Học sinh chưa nhập đáp án
          </span>
        ) : (
          sa!.map((stack, i) => (
            <div key={i} className="flex flex-wrap gap-1 mb-1">
              <span className="text-xs text-gray-400 mr-1">
                Burger {i + 1}:
              </span>
              {stack.length === 0 ? (
                <span className="text-gray-400 text-xs">Trống</span>
              ) : (
                stack.map((layer, j) => (
                  <span
                    key={j}
                    className="px-2 py-0.5 rounded bg-orange-100 border border-orange-300 text-xs"
                  >
                    {burgerIngredientName(layer)}
                  </span>
                ))
              )}
            </div>
          ))
        )}
        {correctStr !== "—" && (
          <>
            <div className="font-medium text-sm mt-2">Đáp án:</div>
            <div className="text-sm text-gray-600">{correctStr}</div>
          </>
        )}
      </div>
    );
  }

  // --- fallback ---
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-500">
      <div>
        <span className="font-medium">Trả lời:</span>{" "}
        {studentAnswer == null
          ? "Học sinh chưa nhập đáp án"
          : JSON.stringify(studentAnswer)}
      </div>
      <div>
        <span className="font-medium">Đáp án:</span>{" "}
        {JSON.stringify(correctAnswer)}
      </div>
    </div>
  );
}

// ----------------------
// Shared UI helpers
// ----------------------
function TwoRow({
  studentLabel,
  correctLabel,
  isCorrect,
}: {
  studentLabel: string;
  correctLabel: string;
  isCorrect: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-medium text-sm">Câu trả lời của học sinh:</div>
      <div
        className={clsx(
          "p-3 rounded-xl border w-fit",
          isCorrect
            ? "bg-green-100 border-green-400"
            : "bg-red-100 border-red-400",
        )}
      >
        {studentLabel}
      </div>
      <div className="font-medium text-sm">Đáp án:</div>
      <div className="p-3 rounded-xl border w-fit bg-gray-100 border-gray-300">
        {correctLabel}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  isCorrect,
  isAnswer,
}: {
  label: string;
  value: string;
  isCorrect?: boolean;
  isAnswer?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500 w-36 shrink-0">{label}:</span>
      <span
        className={clsx(
          "px-3 py-1 rounded-lg border text-sm",
          isAnswer && "bg-gray-100 border-gray-300",
          isCorrect === true && "bg-green-100 border-green-400",
          isCorrect === false && "bg-red-100 border-red-400",
          isCorrect === undefined && !isAnswer && "bg-white border-gray-200",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function FillDetail({
  studentArr,
  correctArr,
}: {
  studentArr: string[];
  correctArr: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-medium text-sm">Câu trả lời của học sinh:</div>
      {studentArr.length === 0 && (
        <span className="text-gray-400 text-sm">Học sinh chưa nhập đáp án</span>
      )}
      {studentArr.map((ans, i) => {
        const isCorrect =
          correctArr[i] !== undefined && ans.trim() === correctArr[i].trim();
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Ô {i + 1}:</span>
            <div
              className={clsx(
                "p-2 px-4 rounded-xl border w-fit text-sm",
                isCorrect
                  ? "bg-green-100 border-green-400"
                  : "bg-red-100 border-red-400",
              )}
            >
              {ans}
            </div>
          </div>
        );
      })}
      <div className="font-medium text-sm mt-1">Đáp án:</div>
      {correctArr.map((ans, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Ô {i + 1}:</span>
          <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit text-sm">
            {ans}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchDetail({
  studentPairs,
  correctPairs,
}: {
  studentPairs: { answer: string; placedCorrectly: boolean }[];
  correctPairs: { left: string; right: string }[];
}) {
  const normalizedCorrectPairs = Array.isArray(correctPairs)
    ? correctPairs
    : [];

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="font-medium text-sm mb-2">
          Câu trả lời của học sinh:
        </div>
        {studentPairs.length === 0 ? (
          <span className="text-gray-400 text-sm">
            Học sinh chưa nhập đáp án
          </span>
        ) : (
          studentPairs.map((pair, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <div
                className={clsx(
                  "p-2 px-4 rounded-xl border w-fit text-sm",
                  pair.placedCorrectly
                    ? "bg-green-100 border-green-400"
                    : "bg-red-100 border-red-400",
                )}
              >
                {pair.answer}
              </div>
              {pair.placedCorrectly ? (
                <span className="text-green-500 text-xs">✓</span>
              ) : (
                <span className="text-red-400 text-xs">✗</span>
              )}
            </div>
          ))
        )}
      </div>
      <div>
        <div className="font-medium text-sm mb-2">Đáp án:</div>
        {normalizedCorrectPairs.length === 0 ? (
          <span className="text-gray-400 text-sm">Không có dữ liệu đáp án</span>
        ) : (
          normalizedCorrectPairs.map((pair, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 opacity-80">
              <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit text-sm">
                {pair.left}
              </div>
              <span className="text-gray-400">➜</span>
              <div className="p-2 px-4 rounded-xl border bg-gray-100 border-gray-300 w-fit text-sm">
                {pair.right}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
