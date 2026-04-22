"use client";

import { useLessonStore } from "@/stores/lessonStore";
import LessonView from "./LessonView";
import { useEffect, useState } from "react";
import {
  GradeProgressResponse,
  GradeResponse,
  TermResponse,
  TopicResponse,
  UserProfileResponse,
} from "@/types";
import {
  getGrades,
  getGradeProgress,
  getTopics,
  getUserProfile,
  getRecentTopics,
  PaginationTopicResponse,
  getOngoingTerm,
  getNoCompletedTopics,
} from "@/apis";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

const TOPICS_PER_PAGE = 4;

export default function LessonsPage() {
  const { gradeLevel } = useLessonStore();

  // Data state
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [ongoingTerm, setOngoingTerm] = useState<TermResponse | null>(null);
  const [topicsPgRes, setTopicsPgRes] =
    useState<PaginationTopicResponse | null>(null);
  const [myProfile, setMyProfile] = useState<UserProfileResponse | null>();
  const [gradeProgress, setGradeProgress] =
    useState<GradeProgressResponse | null>();
  const [recentTopic, setRecentTopic] = useState<TopicResponse | null>(null);
  const [noCompletedTopics, setNoCompletedTopics] = useState(0);
  const [firstTopic, setFirstTopic] = useState<TopicResponse | null>(null);

  // Loading state
  const [profileLoading, setProfileLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Handle
  const handleChangePage = (isNext: boolean) => {
    if (isNext) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
    let ignore = false;

    const fetchInitialData = async () => {
      setProfileLoading(true);
      try {
        const [ongoingTerm, grades, profile] = await Promise.all([
          getOngoingTerm(),
          getGrades({ level: gradeLevel }),
          getUserProfile(),
        ]);
        if (!ignore) {
          setOngoingTerm(ongoingTerm);
          setGrade(grades[0]);
          setMyProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      ignore = true;
    };
  }, [gradeLevel]);

  // Fetch related data when grade is set
  useEffect(() => {
    if (!grade || !ongoingTerm) return;

    let ignore = false;

    const fetchLessonData = async () => {
      setDataLoading(true);
      try {
        const [topics, progress, recent, noCompletedTopics] = await Promise.all(
          [
            getTopics({
              gradeId: grade._id,
              termId: ongoingTerm._id,
              limit: TOPICS_PER_PAGE,
              page: currentPage,
            }),
            getGradeProgress(grade._id),
            getRecentTopics(1),
            getNoCompletedTopics(),
          ],
        );

        if (!ignore) {
          if (topics.pagination.page === 1) {
            setFirstTopic(topics.items[0]);
          }
          setTopicsPgRes(topics);
          setGradeProgress(progress);
          setNoCompletedTopics(noCompletedTopics);

          if (recent?.length > 0 && recent[0]) {
            const filteredTopics = recent.filter(
              (t) => t.gradeId === grade._id,
            );
            setRecentTopic(filteredTopics[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchLessonData();

    return () => {
      ignore = true;
    };
  }, [grade, currentPage, ongoingTerm]);

  if (
    profileLoading ||
    dataLoading ||
    !grade ||
    !topicsPgRes ||
    !gradeProgress ||
    !myProfile
  ) {
    return <ScreenLoader />;
  }

  return (
    <LessonView
      topics={topicsPgRes}
      grade={grade}
      userQuartz={myProfile.quartz}
      gradeProgress={gradeProgress}
      noComplete={noCompletedTopics}
      changePage={handleChangePage}
      recentTopic={recentTopic!}
      firstTopic={firstTopic!}
      isPremiumUser={myProfile.premium && myProfile.premium.isPremium}
    />
  );
}
