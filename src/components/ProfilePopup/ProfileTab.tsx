"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { UserProfileResponse } from "@/types";
import Image from "next/image";
import clsx from "clsx";
import { getGrades, updateUserProfile, uploadAvatar } from "@/apis";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader/Loader";
// 1. Import useRouter
import { useRouter } from "next/navigation";

interface ProfileFormData {
  name?: string;
  gradeId?: string;
  avatarUrl?: string;
  email?: string;
}

export default function ProfileTab({
  profileData,
  onUpdateSuccess,
}: {
  profileData: UserProfileResponse;
  onUpdateSuccess: () => void;
}) {
  // 2. Initialize router
  const router = useRouter();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);

  // UI state
  const [loading, setLoading] = useState(false);

  // Data states
  const [gradeLevels, setGradeLevels] = useState<number[]>([]);
  const [gradeIds, setGradeIds] = useState<string[]>([]);

  // states for avatar management
  const [avatarType, setAvatarType] = useState<"system" | "user">("system");
  const [systemAvatars, setSystemAvatars] = useState<string[]>([]);
  const [currSysAvatarIndex, setCurrSysAvatarIndex] = useState(0);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string>(
    profileData.avatarUrl || "",
  );

  // Form Data
  const originalFormData: ProfileFormData = {
    name: profileData.name,
    gradeId: profileData.gradeId,
    avatarUrl: profileData.avatarUrl,
    email: profileData.email,
  };

  const [formData, setFormData] = useState<ProfileFormData>(originalFormData);

  // Computed values
  const hasAvatarChanged = (() => {
    if (avatarType === "user") {
      return !!avatarFile;
    }
    if (avatarType === "system" && systemAvatars.length > 0) {
      return systemAvatars[currSysAvatarIndex] !== originalFormData.avatarUrl;
    }
    return false;
  })();

  const isFormDirty =
    JSON.stringify(formData) !== JSON.stringify(originalFormData) ||
    hasAvatarChanged;

  // Helpers
  const getGradeIdByLevel = (level: number) => {
    const idx = gradeLevels.indexOf(level);
    if (idx !== -1) return gradeIds[idx];
    return "";
  };

  const getGradeLevelById = (id: string) => {
    const idx = gradeIds.indexOf(id);
    if (idx !== -1) return gradeLevels[idx];
    return "";
  };

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, etc.)");
      e.target.value = "";
      return;
    }
    e.target.value = "";
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const req: ProfileFormData = { ...formData };
      delete req.email;
      if (profileData.role === "parent") {
        delete req.gradeId;
      }

      let finalAvatarUrl = originalFormData.avatarUrl;
      if (avatarType === "user" && avatarFile) {
        const base64Image = await fileToBase64(avatarFile);
        const res = await uploadAvatar(base64Image);
        finalAvatarUrl = res.avatarUrl;
      } else if (avatarType === "system") {
        finalAvatarUrl = systemAvatars[currSysAvatarIndex];
      }
      req.avatarUrl = finalAvatarUrl;

      await updateUserProfile(req);

      toast.success("Cập nhật thông tin thành công!");
      onUpdateSuccess();

      // 3. Refresh the router to fetch new data from server
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi không xác định xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Effects

  // 4. NEW EFFECT: Sync state when profileData changes (after router.refresh)
  useEffect(() => {
    // Reset Form Data to new props
    setFormData({
      name: profileData.name,
      gradeId: profileData.gradeId,
      avatarUrl: profileData.avatarUrl,
      email: profileData.email,
    });

    // Reset Avatar Preview to new props
    setPreviewUrl(profileData.avatarUrl || "");
    setAvatarFile(undefined); // Clear uploaded file

    // Determine correct avatar type based on new URL
    if (
      profileData.avatarUrl &&
      systemAvatars.includes(profileData.avatarUrl)
    ) {
      setAvatarType("system");
      setCurrSysAvatarIndex(systemAvatars.indexOf(profileData.avatarUrl));
    } else {
      setAvatarType("user");
    }
  }, [profileData, systemAvatars]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/sys_avatars.json",
        );
        const avatars = await res.json();
        setSystemAvatars(avatars);

        // Initial load logic
        const idx = avatars.indexOf(profileData.avatarUrl);
        if (idx != -1) {
          setCurrSysAvatarIndex(idx);
          setAvatarType("system");
        } else {
          setAvatarType("user");
        }
      } catch (error) {
        console.error("Failed to fetch avatars:", error);
      }
    };

    const fetchAllGrades = async () => {
      try {
        const res = await getGrades();
        const levels = res.map((g) => g.level);
        const ids = res.map((g) => g._id);
        setGradeIds(ids);
        setGradeLevels(levels);
      } catch (err) {
        console.log("Failed to fetch grades.", err);
      }
    };

    fetchAllGrades();
    fetchAvatars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preview Logic
  useEffect(() => {
    if (avatarType === "system") {
      if (systemAvatars.length > 0 && systemAvatars[currSysAvatarIndex]) {
        setPreviewUrl(systemAvatars[currSysAvatarIndex]);
      }
    } else if (avatarType === "user") {
      if (avatarFile) {
        const url = URL.createObjectURL(avatarFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        // If switched to user but no file, revert to current profile url
        setPreviewUrl(profileData.avatarUrl || "");
      }
    }
  }, [
    avatarType,
    currSysAvatarIndex,
    avatarFile,
    systemAvatars,
    profileData.avatarUrl,
  ]);

  // Scroll Logic
  useEffect(() => {
    if (!avatarContainerRef.current || currSysAvatarIndex === -1) return;
    const container = avatarContainerRef.current;
    const child = container.children[currSysAvatarIndex];
    if (!child) return;

    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    const childCenter =
      childRect.left - containerRect.left + childRect.width / 2;
    const scrollAmount = childCenter - containerCenter;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, [currSysAvatarIndex]);

  return (
    <>
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Thông tin cá nhân
      </h2>
      {/** Avatar section */}
      <div className="w-full mb-6">
        <h3 className="text-md font-semibold text-gray-800 pl-65">
          Ảnh đại diện
        </h3>
        <div className="flex items-start gap-8 pl-20">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 rounded-full bg-[#E0F5F1] flex items-center justify-center overflow-hidden">
              {previewUrl === "" && (
                <label className="text-center text-gray-500 font-medium">
                  Chưa có ảnh nào <br /> được tải lên.
                </label>
              )}
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Avatar preview"
                  fill
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {/* System avatars */}
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "h-[20px] w-[20px] border-2 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center",
                  avatarType === "system"
                    ? "border-[#23BEAA]"
                    : "border-gray-400",
                )}
                onClick={() => setAvatarType("system")}
              >
                <div
                  className={clsx(
                    "h-[12px] w-[12px] bg-[#23BEAA] transition-all duration-150 rounded-full",
                    avatarType === "system" ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
              <label
                className={clsx(
                  "text-sm font-medium cursor-pointer",
                  avatarType === "system" ? "text-[#23BEAA]" : "text-gray-400",
                )}
                onClick={() => setAvatarType("system")}
              >
                Ảnh hệ thống
              </label>
              <div className="relative overflow-x-hidden overflow-y-visible w-[250px] h-[110px]">
                <div
                  ref={avatarContainerRef}
                  className="flex gap-6 overflow-x-hidden scroll-smooth snap-x snap-mandatory px-6 py-6"
                >
                  {systemAvatars.map((avatar, idx) => (
                    <div
                      key={idx}
                      className="relative flex-shrink-0 snap-center"
                    >
                      {currSysAvatarIndex === idx && (
                        <div
                          className={clsx(
                            "absolute -top-7 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] z-10",
                            avatarType === "user"
                              ? "border-t-[#D9D9D9]"
                              : "border-t-[#1DA492]",
                          )}
                        />
                      )}
                      <button
                        onClick={() => {
                          if (avatarType === "system") {
                            setCurrSysAvatarIndex(idx);
                          }
                        }}
                        disabled={avatarType === "user"}
                        className={clsx(
                          "w-14 h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300",
                          avatarType === "user"
                            ? "opacity-50 cursor-not-allowed ring-[#D9D9D9]"
                            : "opacity-80 hover:opacity-100 ring-[#1DA492] ",
                          currSysAvatarIndex === idx ? "ring-4 scale-125" : "",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatar}
                          alt={`avatar ${idx + 1}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload custom avatar */}
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "h-[20px] w-[20px] border-2 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center",
                  avatarType === "user"
                    ? "border-[#23BEAA]"
                    : "border-gray-400",
                )}
                onClick={() => setAvatarType("user")}
              >
                <div
                  className={clsx(
                    "h-[12px] w-[12px] bg-[#23BEAA] transition-all duration-150 rounded-full",
                    avatarType === "user" ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
              <label
                className={clsx(
                  "text-sm font-medium cursor-pointer",
                  avatarType === "user" ? "text-[#23BEAA]" : "text-gray-400",
                )}
                onClick={() => setAvatarType("user")}
              >
                Ảnh của tôi
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarType !== "user"}
                className={clsx(
                  "px-6 py-2 rounded-full transition-colors text-sm ml-8 text-white font-medium cursor-pointer",
                  avatarType !== "user"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#23BEAA] hover:bg-[#1DA492]",
                )}
              >
                Tải ảnh lên
              </button>
            </div>
          </div>
        </div>
      </div>

      {/** Form data section */}
      <div className="space-y-4 mb-6 max-w-lg ml-20">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 pl-5 pr-10 border font-medium border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-[#1ABC9C]"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
              <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          className={clsx(
            "gap-6",
            profileData.role === "parent"
              ? "grid grid-cols-1"
              : "grid grid-cols-2",
          )}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                value={formData.email}
                className="w-full p-3 pl-5 pr-10 border border-gray-300 bg-gray-100 
                                            cursor-not-allowed rounded-lg font-medium text-gray-500"
              />
            </div>
          </div>

          {profileData.role !== "parent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khối lớp
              </label>
              <div className="relative">
                <select
                  value={getGradeLevelById(formData.gradeId!)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gradeId: getGradeIdByLevel(Number(e.target.value)),
                    })
                  }
                  className="w-full p-3 pl-5 font-medium pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none appearance-none text-[#1ABC9C]"
                >
                  <option value={1}>Khối 1</option>
                  <option value={2}>Khối 2</option>
                  <option value={3}>Khối 3</option>
                  <option value={4}>Khối 4</option>
                  <option value={5}>Khối 5</option>
                </select>
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/** Update button */}
      <button
        onClick={handleUpdateProfile}
        disabled={!isFormDirty || loading}
        className={clsx(
          "max-w-lg ml-20 py-3 rounded-xl font-semibold text-base transition-colors w-full relative",
          isFormDirty
            ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed",
        )}
      >
        {/* Text Label */}
        <span>Cập nhật thông tin</span>

        {/* Loader Container */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
          <Loader isLoading={loading} />
        </div>
      </button>
    </>
  );
}
