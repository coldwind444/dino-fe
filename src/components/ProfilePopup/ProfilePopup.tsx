"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faCalendar,
  faChevronDown,
  faUser,
  faKey,
  faLink,
  faStar,
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
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "link">(
    "profile"
  );
  const [selectedAvatar, setSelectedAvatar] = useState("normal");
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    grade: "Khối 4",
    email: "",
    phone: "",
  });
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

  const dateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarOptions = {
    normal: "/avt_01.svg",
    special1: "/globe.svg",
    special2: "/avt_01.svg",
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAvatar(reader.result as string);
        setSelectedAvatar("uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentAvatar = () => {
    if (selectedAvatar === "uploaded" && uploadedAvatar) {
      return uploadedAvatar;
    }
    return avatarOptions[selectedAvatar as keyof typeof avatarOptions];
  };

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[30]">
      <div className="bg-white rounded-3xl max-w-4xl w-full mx-4 relative overflow-hidden shadow-2xl">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-96 p-6 space-y-4">
            {/* Profile Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#1ABC9C] rounded-2xl translate-x-[4px] translate-y-[4px]" />
              <div className="relative bg-[#E8F8F5] rounded-2xl p-6 border-2 border-[#1ABC9C]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#1ABC9C] rounded-full flex items-center justify-center">
                    <Image
                      src="/avt_01.svg"
                      alt="dino avatar"
                      width={48}
                      height={48}
                      className="w-16 h-16"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Nguyễn Minh Tân
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Loại tài khoản:
                      </span>
                    </div>
                    <div className="bg-[#1ABC9C] text-white px-3 py-1 rounded-full text-sm mt-1">
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
                className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left font-semibold ${
                  activeTab === "profile"
                    ? "bg-[#1ABC9C] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                Thông tin cá nhân
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left font-semibold ${
                  activeTab === "password"
                    ? "bg-[#1ABC9C] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                <FontAwesomeIcon icon={faKey} className="w-5 h-5" />
                Đổi mật khẩu
              </button>

              <button
                onClick={() => setActiveTab("link")}
                className={`w-full rounded-2xl p-4 flex items-center gap-3 text-left font-semibold ${
                  activeTab === "link"
                    ? "bg-[#1ABC9C] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                <FontAwesomeIcon icon={faLink} className="w-5 h-5" />
                Liên kết phụ huynh và học sinh
              </button>
            </div>

            <div className="mt-auto pt-40">
              <button
                onClick={onClose}
                className="text-red-600 p-4 flex items-center gap-3 text-left hover:bg-red-50 transition-colors rounded-xl"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                Đóng
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[600px]">
            {activeTab === "profile" && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thông tin cá nhân
                </h2>

                {/* Avatar Selection */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-4">Ảnh đại diện</h3>
                  <div className="flex items-start gap-6">
                    {/* Large Avatar Display */}
                    <div className="w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#C5EDE5]">
                      <Image
                        src={getCurrentAvatar()}
                        alt="dino avatar"
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover"
                      />
                    </div>

                    {/* Radio Buttons and Avatar Options */}
                    <div className="flex flex-col gap-4 flex-1">
                      {/* Ảnh hệ thống */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer min-w-[110px]">
                          <input
                            type="radio"
                            name="avatarType"
                            value="public"
                            className="w-4 h-4 accent-[#1ABC9C]"
                            checked={selectedAvatar !== "uploaded"}
                            onChange={() => {}}
                          />
                          <span className="text-sm text-gray-700">
                            Ảnh hệ thống
                          </span>
                        </label>

                        {/* Avatar Icons */}
                        <div className="flex gap-3 ml-2">
                          <div className="relative">
                            {selectedAvatar === "normal" && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1ABC9C]"></div>
                            )}
                            <button
                              onClick={() => setSelectedAvatar("normal")}
                              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                                selectedAvatar === "normal"
                                  ? "border-[#1ABC9C]"
                                  : "border-gray-300"
                              }`}
                            >
                              <Image
                                src={avatarOptions.normal}
                                alt="avatar 1"
                                width={48}
                                height={48}
                              />
                            </button>
                          </div>
                          <div className="relative">
                            {selectedAvatar === "special1" && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1ABC9C]"></div>
                            )}
                            <button
                              onClick={() => setSelectedAvatar("special1")}
                              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                                selectedAvatar === "special1"
                                  ? "border-[#1ABC9C]"
                                  : "border-gray-300"
                              }`}
                            >
                              <Image
                                src={avatarOptions.special1}
                                alt="avatar 2"
                                width={48}
                                height={48}
                              />
                            </button>
                          </div>
                          <div className="relative">
                            {selectedAvatar === "special2" && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1ABC9C]"></div>
                            )}
                            <button
                              onClick={() => setSelectedAvatar("special2")}
                              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                                selectedAvatar === "special2"
                                  ? "border-[#1ABC9C]"
                                  : "border-gray-300"
                              }`}
                            >
                              <Image
                                src={avatarOptions.special2}
                                alt="avatar 3"
                                width={48}
                                height={48}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Ảnh của tôi */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer min-w-[110px]">
                          <input
                            type="radio"
                            name="avatarType"
                            value="private"
                            className="w-4 h-4 accent-[#1ABC9C]"
                            checked={selectedAvatar === "uploaded"}
                            onChange={() => {}}
                          />
                          <span className="text-sm text-gray-700">
                            Ảnh của tôi
                          </span>
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
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors text-sm ml-2"
                        >
                          Tải ảnh lên
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 mb-6">
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
                        placeholder="Nguyễn Minh Tân"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                          placeholder="tan@gmail.com"
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                <button className="w-full bg-[#1ABC9C] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#16A085] transition-colors">
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
                </div>

                {/* Change Password Button */}
                <button className="w-full bg-[#1ABC9C] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#16A085] transition-colors">
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
                      placeholder="Nhập mã liên kết"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                    />
                    <button className="bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16A085] transition-colors whitespace-nowrap">
                      Gửi yêu cầu
                    </button>
                  </div>

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
                            <button className="text-[#1ABC9C] hover:text-[#16A085]">
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
        </div>
      </div>
    </div>
  );
}
