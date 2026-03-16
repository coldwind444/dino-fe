import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/AuthProvider";

export const metadata: Metadata = {
  title: "Dino Math",
  description: "Powered by Nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
