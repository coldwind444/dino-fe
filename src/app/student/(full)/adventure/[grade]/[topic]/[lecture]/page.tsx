'use client'

import { useEffect, useState } from "react"
import { FC } from "react"

interface LectureProps {
    params: Promise<{ grade: string, topic: string, lecture: string }>
}

const Lecture: FC<LectureProps> = ({ params }) => {
    const [currIdx, setCurrIdx] = useState(0)
    const [exercises, setExercises] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const exercisesData = await fetch(
                    "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/de_bai_toan.json",
                    { cache: "no-store" }
                )
                const exercises = await exercisesData.json()
                setExercises(exercises)

            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchExercises()
    }, [])

    return (
        <div></div>
    )
}