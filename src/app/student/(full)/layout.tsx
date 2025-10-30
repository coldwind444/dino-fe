import Navbar from "@/components/Navbar/Navbar";

export default function FullScreenLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen">
            {children}
        </div>
    )
}