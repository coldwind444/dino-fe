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
} from "@fortawesome/free-solid-svg-icons";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const [selectedAvatar, setSelectedAvatar] = useState("normal");
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    lastName: "Nguyễn Minh",
    firstName: "Tân",
    birthDate: "18/09/2004",
    grade: "Khối 4",
    email: "tan@gmail.com",
    phone: "0913881921",
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
              <button className="w-full bg-[#1ABC9C] text-white rounded-2xl p-4 flex items-center gap-3 text-left">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                Thông tin cá nhân
              </button>

              <button className="w-full bg-gray-200 text-gray-700 rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-gray-300 transition-colors">
                <FontAwesomeIcon icon={faKey} className="w-5 h-5" />
                Đổi mật khẩu
              </button>

              <button className="w-full bg-gray-200 text-gray-700 rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-gray-300 transition-colors">
                <FontAwesomeIcon icon={faLink} className="w-5 h-5" />
                Liên kết phụ huynh và học sinh
              </button>

              <button className="w-full bg-gray-200 text-gray-700 rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-gray-300 transition-colors">
                <FontAwesomeIcon icon={faStar} className="w-5 h-5" />
                Nâng cấp
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-red-100 text-red-600 rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-red-200 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              Đóng
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[600px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Thông tin cá nhân
            </h2>

            {/* Avatar Selection */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-4">Ảnh đại diện</h3>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#E8F8F5]">
                  <Image
                    src={getCurrentAvatar()}
                    alt="dino avatar"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 flex-1 justify-center">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="avatarType"
                        value="public"
                        className="w-4 h-4"
                        checked={selectedAvatar !== "uploaded"}
                        onChange={() => {}}
                      />
                      <span className="text-sm text-gray-700">
                        Ảnh hệ thống
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="avatarType"
                        value="private"
                        className="w-4 h-4"
                        checked={selectedAvatar === "uploaded"}
                        onChange={() => {}}
                      />
                      <span className="text-sm text-gray-700">Ảnh của tôi</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="relative">
                      {selectedAvatar === "normal" && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1ABC9C]"></div>
                      )}
                      <button
                        onClick={() => setSelectedAvatar("normal")}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          selectedAvatar === "normal"
                            ? "border-[#1ABC9C]"
                            : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={avatarOptions.normal}
                          alt="avatar 1"
                          width={40}
                          height={40}
                        />
                      </button>
                    </div>
                    <div className="relative">
                      {selectedAvatar === "special1" && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1ABC9C]"></div>
                      )}
                      <button
                        onClick={() => setSelectedAvatar("special1")}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          selectedAvatar === "special1"
                            ? "border-[#1ABC9C]"
                            : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={avatarOptions.special1}
                          alt="avatar 2"
                          width={40}
                          height={40}
                        />
                      </button>
                    </div>
                    <div className="relative">
                      {selectedAvatar === "special2" && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#1ABC9C]"></div>
                      )}
                      <button
                        onClick={() => setSelectedAvatar("special2")}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          selectedAvatar === "special2"
                            ? "border-[#1ABC9C]"
                            : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={avatarOptions.special2}
                          alt="avatar 3"
                          width={40}
                          height={40}
                        />
                      </button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors text-sm"
                  >
                    Tải ảnh lên
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên đệm
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
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-[#1ABC9C]"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <div className="relative">
                  <div
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] cursor-pointer"
                  >
                    <span
                      className={
                        formData.birthDate ? "text-[#1ABC9C]" : "text-[#1ABC9C]"
                      }
                    >
                      {formData.birthDate || "dd-MM-yyyy"}
                    </span>
                  </div>
                  <input
                    ref={dateInputRef}
                    type="date"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate = `${String(date.getDate()).padStart(
                        2,
                        "0"
                      )}-${String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      )}-${date.getFullYear()}`;
                      setFormData({ ...formData, birthDate: formattedDate });
                    }}
                    className="sr-only"
                  />
                  <div
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                  </div>
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
                    <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                  </button>
                </div>
              </div>

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
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-[#1ABC9C]"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <button className="w-full bg-[#1ABC9C] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#16A085] transition-colors">
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
