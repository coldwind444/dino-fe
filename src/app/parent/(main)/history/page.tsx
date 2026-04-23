"use client";

import { useState } from "react";
import HistoryOverview from "./HistoryOverview";
import HistoryDetail from "./HistoryDetail";
import { HistoryRecord } from "@/types";

const MODES = {
  OVERALL: 0,
  DETAIL: 1,
};

export default function History() {
  const [mode, setMode] = useState(MODES.OVERALL);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(
    null,
  );

  const handleViewDetail = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setMode(MODES.DETAIL);
  };

  return mode === MODES.OVERALL ? (
    <HistoryOverview onViewDetail={handleViewDetail} />
  ) : (
    <HistoryDetail
      onBack={() => setMode(MODES.OVERALL)}
      record={selectedRecord ?? undefined}
    />
  );
}
