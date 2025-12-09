'use client';

import { useEffect, useState } from "react";
import LessonView from "./views/LessonView";
import { getGradeByLevel, getLandsByWorldId, getLecturesByTopicId, getTopicById, getWorldById } from "@/apis";
import { GradeResponse, LandResponse, TopicResponse, WorldResponse, LectureResponse, ExerciseResponse } from "@/types";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

interface LessonsPageProps {
    params: {
        grade: string; // gradeLevel: 1 => 5
        topic: string; // topicId: string
    };
}

export default function LessonsPage({ params }: LessonsPageProps) {
    // UI states
    const [loading, setLoading] = useState(false)

    // Data states
    const [currGrade, setCurrGrade] = useState<GradeResponse | null>(null);
    const [currWorld, setCurrWorld] = useState<WorldResponse | null>(null);
    const [currTopic, setCurrTopic] = useState<TopicResponse | null>(null);
    const [lectures, setLectures] = useState<LectureResponse[]>([]);
    const [lands, setLands] = useState<LandResponse[]>([]);

    useEffect(() => {
        // Get grade level from params
        const { grade, topic } = params;
        if (!grade || !topic) return;

        // Fetch data
        const fetchData = async () => {
            setLoading(true);
            try {
                const grades = await getGradeByLevel(Number(grade));
                const world = await getWorldById(grades[0].worldId);
                const lands = await getLandsByWorldId(world._id);
                const topic = await getTopicById(params.topic);
                const lectures = await getLecturesByTopicId(topic._id);
                setCurrGrade(grades[0]);
                setCurrWorld(world);
                setLands(lands);
                setCurrTopic(topic);
                setLectures(lectures);
            } catch (error){
                console.error("Error fetching world data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    // Return loading state if data is not ready
    if (loading || !currGrade || !currWorld || !currTopic || !lands || !lectures ) return <ScreenLoader/>

    // Pass data to client-side component
    return (
        <LessonView grade={currGrade} world={currWorld} lands={lands} topic={currTopic} lectures={lectures}/>
    );
}