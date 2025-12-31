'use client'

import { useState } from "react"
import HistoryOverview from "./HistoryOverview"
import HistoryDetail from "./HistoryDetail"

const MODES = {
    OVERALL: 0,
    DETAIL: 1
}

export default function History() {
    const [mode, setMode] = useState(MODES.OVERALL)

    return mode === MODES.OVERALL ? (
        <HistoryOverview onViewDetail={() => setMode(MODES.DETAIL)} />
    ) : (
        <HistoryDetail onBack={() => setMode(MODES.OVERALL)} />
    )
}