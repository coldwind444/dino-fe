import ArenaClient from "./ArenaClient";

export interface RankRecord {
    rank: number;
    avatarUrl: string;
    fullName: string;
    points: string;
    duration: string;
}

export default async function Arena() {
    const recordsRes = await fetch(
        "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@4045a55d8ec563bb74d84d370aa28fff34a8afa4/arena.json",
        { cache: "no-store" }
    )

    const recordsData = await recordsRes.json() as RankRecord[];

    return (
        <ArenaClient records={recordsData}/>
    )
}