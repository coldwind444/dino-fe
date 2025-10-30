import ArenaClient from "./ArenaClient";

export interface RankRecord {
    rank: number;
    avatarUrl: string;
    fullName: string;
    points: string;
    duration: string;
}

export interface Rank {
    rank: number;
    title: string;
    badge: string;
    color: string;
}

export default async function Arena() {
    const [recordsRes, ranksRes] = await Promise.all([
        fetch(
            "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@785652a4ff88c2881ecf3fc809109359069631b2/arena.json",
            { cache: "no-store" }
        ),
        fetch(
            "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@4df6201e1a60edc3e3c23157680debaba01b87a7/ranks.json",
            { cache: "no-store" }
        )
    ])

    const recordsData = await recordsRes.json() as RankRecord[];
    const ranksData = await ranksRes.json() as Rank[]

    return (
        <ArenaClient records={recordsData} userRank={ranksData[8]}/>
    )
}