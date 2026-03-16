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

const TOPICS_PER_PAGE = 4;

export default function LessonsPage() {
  const { gradeLevel } = useLessonStore();

  // Data state
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [topicsPgRes, setTopicsPgRes] =
    useState<PaginationTopicResponse | null>(null);

  const [userQuartz, setUserQuartz] = useState<number | undefined>();

  const [gradeProgress, setGradeProgress] =
    useState<GradeProgressResponse | null>();
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);
  const [noCompletedTopics, setNoCompletedTopics] = useState(0);
  const [noUnlockedTopics, setNoUnlockedTopics] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Handle
  const handleChangePage = (isNext: boolean) => {
    if (isNext) {
      if (currentPage < topicsPgRes?.pagination.totalPages!) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Init fetch grade and user data
  useEffect(() => {
    getGrades({ level: gradeLevel })
      .then((res) => setGrade(res[0]))
      .catch(console.error);

    getUserProfile()
      .then((res) => setUserQuartz(res.quartz))
      .catch(console.error);
  }, [gradeLevel]);

  // Fetch related data when grade is set
  useEffect(() => {
    if (!grade) return;

    getTopics({ gradeId: grade._id, limit: TOPICS_PER_PAGE, page: currentPage })
      .then((res) => setTopicsPgRes(res))
      .catch(console.error);

    getGradeProgress(grade._id)
      .then((res) => setGradeProgress(res))
      .catch(console.error);

    getRecentTopics(1)
      .then(async (res) => {
        if (res?.length > 0 && res[0]) {
          const rtopic = await getTopicById(res[0]);
          setRecentTopic(rtopic);
        }
      })
      .catch(console.error);
  }, [grade, currentPage]);

  if (
    !grade ||
    userQuartz === undefined ||
    !topicsPgRes ||
    !gradeProgress ||
    !recentTopic
  ) {
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
      changePage={handleChangePage}
      recentTopic={recentTopic!}
    />
  );
}
