import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Dino Math",
  description: "Powered by Nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
