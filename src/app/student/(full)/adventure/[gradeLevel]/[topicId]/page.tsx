"use client";

import { useEffect, useState } from "react";
import LessonView from "./views/LessonView";
import {
  getGrades,
  getLandsByWorldId,
  getLecturesByTopicId,
  getTopicById,
  getUserProfile,
  getWorldById,
} from "@/apis";
import {
  GradeResponse,
  LandResponse,
  TopicResponse,
  WorldResponse,
  LectureResponse,
  ExerciseResponse,
  UserProfileResponse,
} from "@/types";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

interface LessonsPageProps {
  params: {
    gradeLevel: string; // gradeLevel: 1 => 5
    topicId: string; // topicId: string
  };
}

export default function LessonsPage({ params }: LessonsPageProps) {
  // UI states
  const [loading, setLoading] = useState(false);

  // Data states
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [currGrade, setCurrGrade] = useState<GradeResponse | null>(null);
  const [currWorld, setCurrWorld] = useState<WorldResponse | null>(null);
  const [currTopic, setCurrTopic] = useState<TopicResponse | null>(null);
  const [lectures, setLectures] = useState<LectureResponse[]>([]);
  const [lands, setLands] = useState<LandResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { gradeLevel, topicId } = await params;
      if (!gradeLevel || !topicId) return;

      setLoading(true);

      try {
        const grades = await getGrades({ level: gradeLevel });
        const world = await getWorldById(grades[0].worldId);
        const lands = await getLandsByWorldId(world._id);
        const topic = await getTopicById(topicId);
        const lectures = await getLecturesByTopicId(topic._id);
        const user = await getUserProfile();

        setCurrGrade(grades[0]);
        setCurrWorld(world);
        setLands(lands);
        setCurrTopic(topic);
        setLectures(lectures);
        setUser(user);
      } catch (error) {
        console.error("Error fetching world data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  // Return loading state if data is not ready
  if (
    loading ||
    !currGrade ||
    !currWorld ||
    !currTopic ||
    !lectures ||
    !lands ||
    !user
  )
    return <ScreenLoader />;

  // Pass data to client-side component
  return (
    <LessonView
      grade={currGrade}
      world={currWorld}
      lands={lands}
      topic={currTopic}
      lectures={lectures}
      user={user}
    />
  );
}
