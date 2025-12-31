'use client'

import { useLessonStore } from "@/stores/lessonStore";
import LessonView from "./LessonView";
import { useEffect, useState } from "react";
import { GradeProgressResponse, GradeResponse, TopicResponse } from "@/types";
import { getGradeByLevel, getGradeProgress, getTopicsByGradeId, getUserProfile, getRecentTopics, getTopicById, getCompletedTopics } from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

export default function LessonsPage() {
  const { gradeLevel } = useLessonStore()

  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [topics, setTopics] = useState<TopicResponse[]>([])
  const [userQuartz, setUserQuartz] = useState<number | undefined>();
  const [gradeProgress, setGradeProgress] = useState<GradeProgressResponse | null>();
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);
  const [noCompletedTopics, setNoCompletedTopics] = useState(0)
  const [noUnlockedTopics, setNoUnlockedTopics] = useState(0)

  // Init fetch grade and user data
  useEffect(() => {
    const fetchGradeData = async () => {
      try {
        const res = await getGradeByLevel(Number(gradeLevel));
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
        const rtopic = await getTopicById(res[0])
        setRecentTopic(rtopic)
      } catch (error) {
        console.error("Error fetching recent topics:", error);
      }
    }

    // Complete topics
    const fetchCompleteTopics = async () => {
      try {
        const res = await getCompletedTopics();
        const rtopic = await getTopicById(res[0])
        setRecentTopic(rtopic)
      } catch (error) {
        console.error("Error fetching recent topics:", error);
      }
    }

    fetchTopicsData();
    fetchGradeProgress();
    fetchRecentTopics()
  }, [grade])

  if (!grade || userQuartz === undefined || !topics || !gradeProgress) {
    return <ScreenLoader />;
  }

  return <LessonView
    topics={topics}
    grade={grade!}
    userQuartz={userQuartz}
    gradeProgress={gradeProgress!} 
    noComplete={noCompletedTopics}
    noUnlocked={noUnlockedTopics}
    />
}
