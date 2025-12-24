"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import broken from "../../../public/assets/not-found/broken-link.png";
import {
  faPencil,
  faChevronDown,
  faUser,
  faKey,
  faLink,
  faXmark,
  faEye,
  faEyeSlash,
  faCheck,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  // UI states
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "link">("profile");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [lastSystemAvatar, setLastSystemAvatar] = useState(0);
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [systemAvatars, setSystemAvatars] = useState<string[]>([])

  // Mock-data
  const originalFormData = {
    lastName: "Nguyễn Minh Tân",
    firstName: "",
    birthDate: "",
    grade: "Khối 4",
    email: "tan@gmail.com",
    phone: "",
  };

  // Data states
  const [formData, setFormData] = useState(originalFormData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [linkCode, setLinkCode] = useState("");
  const [hasLinkedParent, setHasLinkedParent] = useState(true);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);

  // Functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAvatar(reader.result as string);
        setSelectedAvatar(-1);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentAvatar = () => {
    if (selectedAvatar === -1 && uploadedAvatar) {
      return uploadedAvatar;
    }
    return systemAvatars[selectedAvatar] || systemAvatars[0];
  };

  const hasFormChanges =
    JSON.stringify(formData) !== JSON.stringify(originalFormData);

  const handleUpdateProfile = () => {
    console.log("Profile updated:", formData);
    // Here you would typically make an API call to save the data
    // After successful save, you could update originalFormData
  };

  // Effects
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/sys_avatars.json"
        );
        const avatars = await res.json();
        setSystemAvatars(avatars);
      } catch (error) {
        console.error("Failed to fetch avatars:", error);
      }
    };
    fetchAvatars();
  }, []);

  useEffect(() => {
    if (selectedAvatar !== -1) {
      setLastSystemAvatar(selectedAvatar);
    }
  }, [selectedAvatar]);

  useEffect(() => {
    setFormData(originalFormData);
  }, [activeTab]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(originalFormData);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!avatarContainerRef.current || selectedAvatar === -1) return;

    const container = avatarContainerRef.current;
    const child = container.children[selectedAvatar];
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
  }, [selectedAvatar]);

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[30]">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      <div className="bg-white rounded-3xl max-w-6xl w-full mx-4 relative overflow-hidden shadow-2xl">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-96 p-6 space-y-4">
            {/* Profile Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#1ABC9C] rounded-2xl translate-x-[3px] translate-y-[3px]" />
              <div className="relative bg-white rounded-2xl p-4 border-2 border-[#1ABC9C]">
                <div className="flex items-center gap-5">
                  <div className="w-26 h-26 bg-[#D6F8EB] rounded-full flex items-center justify-center">
                    <Image
                      src={systemAvatars[0]}
                      alt="dino avatar"
                      width={104}
                      height={104}
                      className="w-26 h-26"
                    />
                  </div>
                  <div className="h-full">
                    <h3 className="font-bold text-xl text-gray-600">
                      Nguyễn Minh Tân
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-400 font-medium">
                        Loại tài khoản:
                      </span>
                    </div>
                    <div className="bg-[#C4F1EB] text-[#1DA492] font-medium px-3 py-1 rounded-full text-sm inline-block mt-2">
                      Học sinh
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

            <div className="mt-auto pt-40">
              <button
                onClick={onClose}
                className="text-red-600 p-4 flex items-center gap-3 text-left hover:bg-red-50 transition-colors rounded-xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                Đóng
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 border-l border-gray-200">
            {activeTab === "profile" && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thông tin cá nhân
                </h2>

                {/* Avatar Selection */}
                <div className="w-full mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pl-65">
                    Ảnh đại diện
                  </h3>

                  <div className="flex items-start gap-8 pl-20">
                    {/* Large Avatar Display */}
                    <div className="flex-shrink-0">
                      <div className="relative w-40 h-40 rounded-full bg-[#E0F5F1] flex items-center justify-center overflow-hidden">
                        <Image
                          src={getCurrentAvatar()}
                          alt="Current Avatar"
                          width={160}
                          height={160}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Radio Buttons and Avatar Options */}
                    <div className="flex-1 space-y-4">
                      {/* Ảnh hệ thống */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-[20px] w-[20px] border-2 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center ${selectedAvatar !== -1
                            ? "border-[#23BEAA]"
                            : "border-[#D9D9D9]"
                            }`}
                          onClick={() => setSelectedAvatar(0)}
                        >
                          <div
                            className={`h-[12px] w-[12px] bg-[#23BEAA] transition-all duration-150 rounded-full ${selectedAvatar !== -1
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          ></div>
                        </div>
                        <label
                          className={`text-sm font-medium cursor-pointer ${selectedAvatar !== -1
                            ? "text-[#23BEAA]"
                            : "text-[#D9D9D9]"
                            }`}
                          onClick={() => setSelectedAvatar(0)}
                        >
                          Ảnh hệ thống
                        </label>

                        {/* Avatar Icons */}
                        <div className="relative overflow-x-hidden overflow-y-visible w-[250px] h-[110px]">
                          <div
                            ref={avatarContainerRef}
                            className="flex gap-6 overflow-x-hidden scroll-smooth snap-x snap-mandatory px-6 py-6"
                            style={{ scrollSnapType: "x mandatory" }}
                          >
                            {systemAvatars.map((avatar, idx) => (
                              <div
                                key={idx}
                                className="relative flex-shrink-0 snap-center"
                              >
                                {(selectedAvatar === idx ||
                                  (selectedAvatar === -1 &&
                                    lastSystemAvatar === idx)) && (
                                    <div
                                      className={`absolute -top-7 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] z-10 ${selectedAvatar === -1
                                        ? "border-t-[#D9D9D9]"
                                        : "border-t-[#1DA492]"
                                        }`}
                                    ></div>
                                  )}
                                <button
                                  onClick={() => {
                                    if (selectedAvatar !== -1) {
                                      setSelectedAvatar(idx);
                                      setLastSystemAvatar(idx);
                                    }
                                  }}
                                  disabled={selectedAvatar === -1}
                                  className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${selectedAvatar === -1
                                    ? lastSystemAvatar === idx
                                      ? "opacity-50 cursor-not-allowed ring-4 ring-[#D9D9D9] scale-125"
                                      : "opacity-50 cursor-not-allowed"
                                    : selectedAvatar === idx
                                      ? "ring-4 ring-[#1DA492] scale-125"
                                      : "opacity-80 hover:opacity-100"
                                    }`}
                                >
                                  <Image
                                    src={avatar}
                                    alt={`avatar ${idx + 1}`}
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover"
                                    unoptimized
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Ảnh của tôi */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-[20px] w-[20px] border-2 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center ${selectedAvatar === -1
                            ? "border-[#23BEAA]"
                            : "border-[#D9D9D9]"
                            }`}
                          onClick={() => setSelectedAvatar(-1)}
                        >
                          <div
                            className={`h-[12px] w-[12px] bg-[#23BEAA] transition-all duration-150 rounded-full ${selectedAvatar === -1
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          ></div>
                        </div>
                        <label
                          className={`text-sm font-medium cursor-pointer ${selectedAvatar === -1
                            ? "text-[#23BEAA]"
                            : "text-[#D9D9D9]"
                            }`}
                          onClick={() => setSelectedAvatar(-1)}
                        >
                          Ảnh của tôi
                        </label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={selectedAvatar !== -1}
                          className={`px-6 py-2 rounded-full transition-colors text-sm ml-8 text-white ${selectedAvatar !== -1
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#23BEAA] hover:bg-[#1DA492]"
                            }`}
                        >
                          Tải ảnh lên
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 mb-6 max-w-lg ml-20">
                  {/* Họ và tên - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-[#1ABC9C]"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                        <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Email and Khối lớp - Same row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-[#1ABC9C]"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khối lớp
                      </label>
                      <div className="relative">
                        <select
                          value={formData.grade}
                          onChange={(e) =>
                            setFormData({ ...formData, grade: e.target.value })
                          }
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none appearance-none text-[#1ABC9C]"
                        >
                          <option value="Khối 1">Khối 1</option>
                          <option value="Khối 2">Khối 2</option>
                          <option value="Khối 3">Khối 3</option>
                          <option value="Khối 4">Khối 4</option>
                          <option value="Khối 5">Khối 5</option>
                        </select>
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="w-3 h-3"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdateProfile}
                  disabled={!hasFormChanges}
                  className={`max-w-lg ml-20 py-3 rounded-xl font-semibold text-base transition-colors w-full ${hasFormChanges
                    ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Cập nhật thông tin
                </button>
              </>
            )}

            {activeTab === "password" && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Đổi mật khẩu
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Mật khẩu hiện tại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                      />
                      <button
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <FontAwesomeIcon
                          icon={showPasswords.current ? faEyeSlash : faEye}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập mật khẩu mới"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                      />
                      <button
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <FontAwesomeIcon
                          icon={showPasswords.new ? faEyeSlash : faEye}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                      />
                      <button
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <FontAwesomeIcon
                          icon={showPasswords.confirm ? faEyeSlash : faEye}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="mb-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {passwordData.newPassword.length >= 8 && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-3 h-3 text-[#1ABC9C]"
                      />
                    )}
                    <span
                      className={
                        passwordData.newPassword.length >= 8
                          ? "text-[#1ABC9C] italic"
                          : "text-gray-600"
                      }
                    >
                      *Độ dài tối thiểu 8 ký tự
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[A-Z]/.test(passwordData.newPassword) && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-3 h-3 text-[#1ABC9C]"
                      />
                    )}
                    <span
                      className={
                        /[A-Z]/.test(passwordData.newPassword)
                          ? "text-[#1ABC9C] italic"
                          : "text-gray-600"
                      }
                    >
                      *Có chứa chữ in hoa
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[0-9]/.test(passwordData.newPassword) && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-3 h-3 text-[#1ABC9C]"
                      />
                    )}
                    <span
                      className={
                        /[0-9]/.test(passwordData.newPassword)
                          ? "text-[#1ABC9C] italic"
                          : "text-gray-600"
                      }
                    >
                      *Có chứa số
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[!@#$%^&*(),.?":{}|<>]/.test(
                      passwordData.newPassword
                    ) && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="w-3 h-3 text-[#1ABC9C]"
                        />
                      )}
                    <span
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)
                          ? "text-[#1ABC9C] italic"
                          : "text-gray-600"
                      }
                    >
                      *Có chứa ký tự đặc biệt
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordData.newPassword &&
                      passwordData.confirmPassword &&
                      passwordData.newPassword ===
                      passwordData.confirmPassword && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="w-3 h-3 text-[#1ABC9C]"
                        />
                      )}
                    <span
                      className={
                        passwordData.newPassword &&
                          passwordData.confirmPassword &&
                          passwordData.newPassword ===
                          passwordData.confirmPassword
                          ? "text-[#1ABC9C] italic"
                          : "text-gray-600"
                      }
                    >
                      *Xác nhận mật khẩu trùng khớp
                    </span>
                  </div>
                </div>

                {/* Change Password Button */}
                <button
                  disabled={
                    !passwordData.currentPassword ||
                    passwordData.newPassword.length < 8 ||
                    !/[A-Z]/.test(passwordData.newPassword) ||
                    !/[0-9]/.test(passwordData.newPassword) ||
                    !/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className={`w-full py-3 rounded-xl font-semibold text-base transition-colors ${passwordData.currentPassword &&
                    passwordData.newPassword.length >= 8 &&
                    /[A-Z]/.test(passwordData.newPassword) &&
                    /[0-9]/.test(passwordData.newPassword) &&
                    /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) &&
                    passwordData.newPassword === passwordData.confirmPassword
                    ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Đổi mật khẩu
                </button>
              </>
            )}

            {activeTab === "link" && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Liên kết tài khoản
                </h2>

                {/* Liên kết với tài khoản phụ huynh */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-500 mb-4">
                    Liên kết với tài khoản phụ huynh
                  </h3>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={linkCode}
                      onChange={(e) =>
                        setLinkCode(e.target.value.toUpperCase())
                      }
                      maxLength={6}
                      placeholder="Nhập mã liên kết"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                      disabled={linkCode.length < 6}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${linkCode.length >= 6
                        ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Gửi yêu cầu
                    </button>
                  </div>

                  {!hasLinkedParent && (
                    <div className="p-8 flex flex-col items-center justify-center mb-4">
                      <Image
                        src={broken}
                        alt="broken link"
                        width={240}
                        height={240}
                        className="mb-4 opacity-50"
                      />
                      <p className="text-gray-400 font-medium text-center">
                        Tài khoản của bạn chưa được liên kết
                      </p>
                    </div>
                  )}

                  {hasLinkedParent && (
                    <>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Tài khoản phụ huynh được liên kết
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#C5EDE5] flex items-center justify-center flex-shrink-0">
                              <Image
                                src="/avt_01.svg"
                                alt="parent avatar"
                                width={48}
                                height={48}
                                className="w-12 h-12"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold text-lg text-gray-800">
                                Nguyễn Văn H
                              </h5>
                              <p className="text-sm text-gray-500">
                                vanh@gmail.com
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">
                                Mã liên kết tài khoản
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm">
                                  7HS90F
                                </div>
                                <button className="text-[#1ABC9C] hover:text-[#16A085] cursor-pointer">
                                  <FontAwesomeIcon
                                    icon={faCopy}
                                    className="w-4 h-4"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Các thành viên khác trong gia đình */}
                      <div>
                        <h3 className="text-base font-medium text-gray-500 mb-4">
                          Các thành viên khác trong gia đình
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-[#C5EDE5] flex items-center justify-center flex-shrink-0">
                                <Image
                                  src="/avt_01.svg"
                                  alt="member avatar"
                                  width={48}
                                  height={48}
                                  className="w-12 h-12"
                                />
                              </div>
                              <div>
                                <h5 className="font-bold text-base text-gray-800">
                                  Nguyễn Văn A
                                </h5>
                                <p className="text-sm text-gray-500">
                                  vana@gmail.com
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-[#C5EDE5] flex items-center justify-center flex-shrink-0">
                                <Image
                                  src="/avt_01.svg"
                                  alt="member avatar"
                                  width={48}
                                  height={48}
                                  className="w-12 h-12"
                                />
                              </div>
                              <div>
                                <h5 className="font-bold text-base text-gray-800">
                                  Nguyễn Văn B
                                </h5>
                                <p className="text-sm text-gray-500">
                                  vanb@gmail.com
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}