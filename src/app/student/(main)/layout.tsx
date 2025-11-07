import { getUserProfile } from "@/apis/userApis";
import Navbar from "@/components/Navbar/Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await getUserProfile()
  const usernname = res.name
  const avatarUrl = res.avatarUrl

  return (
    <div className="flex flex-col w-full h-full">
      <div className="fixed top-0 h-fit w-fit z-50">
        <Navbar isAuthenticated={true} role={"student"} username={usernname} avatarUrl={avatarUrl}/>
      </div>
      <div className="w-screen overflow-hidden flex-1 mt-[80px]">
        {children}
      </div>
    </div>
  );
}
