import LessonClient from "./LessonClient";

export interface Topic {
  name: string;
  brand: string;
}

export interface LessonsData {
  [grade: string]: Topic[];
}

export default async function LessonsPage() {
  const [lessonsRes] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@a5d69549adba4df45bc63545c188730c583ec18d/lessons_v2.json",
      { cache: "no-store" }
    ),
  ]);

  const lessonsData = (await lessonsRes.json()) as LessonsData;
  console.log("Fetched lessons data:", lessonsData);
  return <LessonClient lessons={lessonsData} />;
}
