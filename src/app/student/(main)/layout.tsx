import Navbar from "@/components/Navbar/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-col w-full h-full">
            <div className="fixed top-0 h-fit w-fit">
                <Navbar isAuthenticated={true} role={'student'} username={"Admin"} />
            </div>
            <div className="w-screen overflow-hidden flex-1 mt-[80px]">
                {children}
            </div>
        </div>
    )
}