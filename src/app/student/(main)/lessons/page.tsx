"use client";

import { useLessonStore } from "@/stores/lessonStore";
import LessonView from "./LessonView";
import { useEffect, useState } from "react";
import { GradeProgressResponse, GradeResponse, TopicResponse } from "@/types";
import {
  getGrades,
  getGradeProgress,
  getTopics,
  getUserProfile,
  getRecentTopics,
  getTopicById,
  getCompletedTopics,
  PaginationTopicResponse,
} from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

const TOPICS_PER_PAGE = 5;

export default function LessonsPage() {
  const { gradeLevel } = useLessonStore();

  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [topicsPgRes, setTopicsPgRes] =
    useState<PaginationTopicResponse | null>(null);
  const [userQuartz, setUserQuartz] = useState<number | undefined>();
  const [gradeProgress, setGradeProgress] =
    useState<GradeProgressResponse | null>();
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);
  const [noCompletedTopics, setNoCompletedTopics] = useState(0);
  const [noUnlockedTopics, setNoUnlockedTopics] = useState(0);

  // Init fetch grade and user data
  useEffect(() => {
    const fetchGradeData = async () => {
      try {
        const res = await getGrades({ level: gradeLevel });
        setGrade(res[0]);
      } catch (error) {
        console.error("Error fetching grade data:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await getUserProfile();
        setUserQuartz(res.quartz);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    fetchGradeData();
  }, []);

  // Fetch related data when grade is set
  useEffect(() => {
    if (!grade) return;

    // Topics list
    const fetchTopicsData = async () => {
      try {
        const res = await getTopics({
          gradeId: grade._id,
          limit: TOPICS_PER_PAGE,
        });
        setTopicsPgRes(res);
      } catch (error) {
        console.error("Error fetching lessons data:", error);
      }
    };

    // Grade progress
    const fetchGradeProgress = async () => {
      try {
        const res = await getGradeProgress(grade._id);
        setGradeProgress(res);
      } catch (error) {
        console.error("Error fetching grade progress:", error);
      }
    };

    // Recent topics
    const fetchRecentTopics = async () => {
      try {
        const res = await getRecentTopics(1);
        const rtopic = await getTopicById(res[0]);
        setRecentTopic(rtopic);
      } catch (error) {
        console.error("Error fetching recent topics:", error);
      }
    };

    // Complete topics
    const fetchCompleteTopics = async () => {
      try {
        const res = await getCompletedTopics();
        const rtopic = await getTopicById(res[0]);
        setRecentTopic(rtopic);
      } catch (error) {
        console.error("Error fetching recent topics:", error);
      }
    };

    fetchTopicsData();
    fetchGradeProgress();
    fetchRecentTopics();
  }, [grade]);

  if (!grade || userQuartz === undefined || !topicsPgRes || !gradeProgress) {
    return <ScreenLoader />;
  }

  return (
    <LessonView
      topics={topicsPgRes}
      grade={grade!}
      userQuartz={userQuartz}
      gradeProgress={gradeProgress!}
      noComplete={noCompletedTopics}
      noUnlocked={noUnlockedTopics}
    />
  );
}
