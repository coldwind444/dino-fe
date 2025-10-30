import LessonClient from "./LessonClient";

export interface Topic {
  name: string;
  brand: string;
}

export interface LessonsData {
  [grade: string]: Topic[];
}

export default async function LessonsPage() {
  const [lessonsRes, gradeRes] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@a5d69549adba4df45bc63545c188730c583ec18d/lessons_v2.json",
      { cache: "no-store" }
    ),
    fetch(
      "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/grades_assets.json",
      { cache: "no-store" }
    ),
  ]);

  const lessonsData = (await lessonsRes.json()) as LessonsData;
  const gradeData = (await gradeRes.json()) as Record<string, { image: string }>;

  return <LessonClient lessons={lessonsData} grades={gradeData}/>;
}
