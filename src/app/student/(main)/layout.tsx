'use client'

import Navbar from "@/components/Navbar/Navbar";
import TopicRecommendPopup from "@/components/TopicRecommendPopup/TopicRecommendPopup";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="fixed top-0 h-fit w-fit z-50">
        <Navbar isAuthenticated={true} role={"student"}/>
      </div>
      <div className="w-screen overflow-hidden flex-1 mt-[80px]">
        {children}
      </div>
    </div>
  );
}
