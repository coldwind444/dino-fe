import OnboardingClient from "./OnboardingClient";

export default async function Onboarding() {
    const avtRes = await fetch(
        "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/sys_avatars.json",
        { cache: "no-store" }
    )

    const avatars = await avtRes.json() as string[]

    return <OnboardingClient systemAvatars={avatars}/>
}