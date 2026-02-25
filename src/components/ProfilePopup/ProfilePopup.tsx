"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";
import AccountLinkTab from "./AccountLinkTab";
import { UserProfileResponse } from "@/types";
import { getUserProfile } from "@/apis";
import Image from "next/image";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Skeleton Loading Component
function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Profile Card Skeleton */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gray-200 rounded-2xl translate-x-[3px] translate-y-[3px]" />
        <div className="relative bg-white rounded-2xl p-4 border-2 border-gray-200">
          <div className="flex items-center gap-5">
            <div className="w-26 h-26 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-14 bg-gray-200 rounded-2xl" />
        <div className="h-14 bg-gray-200 rounded-2xl" />
        <div className="h-14 bg-gray-200 rounded-2xl" />
      </div>

      {/* Close Button Skeleton */}
      <div className="pt-40">
        <div className="h-14 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

// Content Area Skeleton
function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3" />

      {/* Content Blocks */}
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-24 bg-gray-200 rounded-lg" />
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>

      {/* Button Skeleton */}
      <div className="h-12 bg-gray-200 rounded-xl w-full max-w-lg" />
    </div>
  );
}

export default function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "link">("profile");

  // Data states
  const [profile, setProfile] = useState<UserProfileResponse>();
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await getUserProfile();
        setProfile(res);
      } catch (err) {
        console.log("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };

  // Effects
  useEffect(() => {
    if (!isOpen) return;
    fetchUserProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[30]">
      <div className="bg-white rounded-3xl max-w-6xl w-full mx-4 relative overflow-hidden shadow-2xl">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-96 p-6 space-y-4">
            {loading ? (
              <ProfileSkeleton />
            ) : (
              <>
                {/* Profile Card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-[#1ABC9C] rounded-2xl translate-x-[3px] translate-y-[3px]" />
                  <div className="relative bg-white rounded-2xl p-4 border-2 border-[#1ABC9C]">
                    <div className="flex items-center gap-5">
                      <div className="w-26 h-26 bg-[#D6F8EB] rounded-full flex items-center justify-center overflow-hidden">
                        {profile?.avatarUrl ? (
                          <Image
                            src={profile.avatarUrl}
                            alt="Avatar"
                            height={150}
                            width={150}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-5xl">👤</span>
                        )}
                      </div>
                      <div className="h-full">
                        <h3 className="font-bold text-xl text-gray-600">
                          {profile?.name || "Người dùng"}
                        </h3>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-sm text-gray-400 font-medium">
                            Loại tài khoản:
                          </span>
                        </div>
                        <div className="bg-[#C4F1EB] text-[#1DA492] font-medium px-3 py-1 rounded-full text-sm inline-block mt-2">
                          {profile?.role === "student" ? "Học sinh" : "Phụ huynh"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left font-semibold cursor-pointer ${activeTab === "profile"
                        ? "bg-[#1ABC9C] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                    Thông tin cá nhân
                  </button>

                  <button
                    onClick={() => setActiveTab("password")}
                    className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left font-semibold cursor-pointer ${activeTab === "password"
                        ? "bg-[#1ABC9C] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faKey} className="w-5 h-5" />
                    Đổi mật khẩu
                  </button>

                  <button
                    onClick={() => setActiveTab("link")}
                    className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left font-semibold cursor-pointer ${activeTab === "link"
                        ? "bg-[#1ABC9C] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faLink} className="w-5 h-5" />
                    Liên kết phụ huynh và học sinh
                  </button>
                </div>

                {/* Close Button */}
                <div className="mt-auto pt-40">
                  <button
                    onClick={onClose}
                    className="text-red-600 p-4 flex items-center gap-3 text-left hover:bg-red-50 transition-colors rounded-xl cursor-pointer w-full"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                    Đóng
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 border-l border-gray-200">
            {loading || !profile ? (
              <ContentSkeleton />
            ) : (
              <>
                {activeTab === "profile" && <ProfileTab profileData={profile} onUpdateSuccess={fetchUserProfile}/>}
                {activeTab === "password" && <PasswordTab />}
                {activeTab === "link" && <AccountLinkTab />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}