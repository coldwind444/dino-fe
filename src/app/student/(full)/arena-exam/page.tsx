import ExamClient from "./ExamClient";

export default async function ArenaExam() {
    const questionsRes = await fetch(
        "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/de_toan_tieu_hoc.json",
        { cache: "no-store" }
    )
    
    const questionsData = await questionsRes.json() as string[]

    return (
        <ExamClient questions={questionsData}/>
    )
}