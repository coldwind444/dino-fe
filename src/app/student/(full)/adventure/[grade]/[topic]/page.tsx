// client component
import LectureClient from "./LectureClient";

interface MilestonesPageProps {
    params: {
        grade: string;
        topic: string;
    };
}

export interface World {
    world: string;
    milestone: string;
    lands: Land[];
}

export interface Land {
    name: string;
    illustration: string;
}

export interface Topic {
    name: string;
    brand: string;
}

export interface Lecture {
    title: string;
    difficultyNo: number;
    difficultyName: string;
}

export default async function MilestonesPage({ params }: MilestonesPageProps) {
    const { grade, topic } = await params;

    // Server-side data fetching (no useEffect)
    const [worldRes, topicRes, lectureRes] = await Promise.all([
        fetch(
            "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/worlds_v2.json",
            { cache: "no-store" }
        ),
        fetch(
            "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/lessons_v2.json",
            { cache: "no-store" }
        ),
        fetch(
            "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/lectures.json",
            { cache: "no-store" }
        )
    ]);

    const worldData = await worldRes.json() as Record<string, World>;
    const topicData = await topicRes.json() as Record<string, Topic[]>;
    const lectureData = await lectureRes.json() as Lecture[];

    const currWorld = worldData[grade];
    const currTopic = topicData[grade]?.[Number(topic) - 1];

    // Pass data to client-side component
    return (
        <LectureClient
            grade={grade}
            topicOrder={topic}
            topic={currTopic}
            world={currWorld}
            lectures={lectureData}
        />
    );
}
