'use client'

import { useLessonStore } from "@/stores/lessonStore";
import LessonClient from "./LessonClient";
import { useEffect, useState } from "react";
import { GradeProgressResponse, GradeResponse, TopicResponse } from "@/types";
import { getGradeByLevel, getGradeProgress, getTopicsByGradeId, getUserProfile, getRecentTopics } from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

export default function LessonsPage() {
  const { gradeId } = useLessonStore()

  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [topics, setTopics] = useState<TopicResponse[]>([])
  const [userQuartz, setUserQuartz] = useState<number|undefined>();
  const [gradeProgress, setGradeProgress] = useState<GradeProgressResponse | null>();
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);

  // Init fetch grade and user data
  useEffect(() => {
    const fetchGradeData = async () => {
      try {
        const res = await getGradeByLevel(Number(gradeId));
        setGrade(res[0]);
      } catch (error) {
        console.error("Error fetching grade data:", error);
      }
    }

    const fetchUserData = async () => {
      try {
        const res = await getUserProfile()
        setUserQuartz(res.quartz);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
    fetchGradeData();
  }, [])

  // Fetch related data when grade is set
  useEffect(() => {
    if (!grade) return;

    // Topics list
    const fetchTopicsData = async () => {
      try {
        const res = await getTopicsByGradeId(grade._id);
        setTopics(res);
      } catch (error) {
        console.error("Error fetching lessons data:", error);
      }
    }

    // Grade progress
    const fetchGradeProgress = async () => {
      try {
        const res = await getGradeProgress(grade._id);
        setGradeProgress(res);
      } catch (error) {
        console.error("Error fetching grade progress:", error);
      }
    }

    // Recent topics
    const fetchRecentTopics = async () => {
      try {
        const res = await getRecentTopics(1);
        setRecentTopic(res[0]);
      } catch (error) {
        console.error("Error fetching recent topics:", error);
      }
    }

    fetchTopicsData();
    fetchGradeProgress();
  }, [grade])

  if (!grade || userQuartz === undefined || !topics || !gradeProgress) {
    return <ScreenLoader/>;
  }

  return <LessonClient topics={topics}
    grade={grade!}
    userQuartz={userQuartz}
    gradeProgress={gradeProgress!} />;
}
