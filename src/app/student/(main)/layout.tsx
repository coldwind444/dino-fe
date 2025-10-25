import Navbar from "@/components/Navbar/Navbar";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {" "}
      <div className="fixed top-0 left-0 right-0 z-40">
        {" "}
        <Navbar
          isAuthenticated={true}
          role={"student"}
          username={"Admin"}
        />{" "}
      </div>{" "}
      <div className="pt-[80px] h-[calc(100vh - 80px)] w-screen overflow-auto flex-1">
        {" "}
        {children}{" "}
      </div>{" "}
    </div>
  );
}
