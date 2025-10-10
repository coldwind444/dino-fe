import Navbar from "@/components/Navbar/Navbar";

export default function MainLayout({children} : { children: React.ReactNode}){
    return (
        <div className="flex flex-col">
            <div className="fixed top-0 h-fit w-fit"><Navbar isAuthenticated = {true} role={'student'} username={"Admin"}/></div>
            <div className="h-[calc(100vh - 80px)] w-screen overflow-hidden">
                {children}
            </div>
        </div>
    )
}