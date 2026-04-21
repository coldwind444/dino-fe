"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function PasswordTab() {
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

  const isValid =
    passwordData.currentPassword &&
    passwordData.newPassword.length >= 8 &&
    /[A-Z]/.test(passwordData.newPassword) &&
    /[0-9]/.test(passwordData.newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) &&
    passwordData.newPassword === passwordData.confirmPassword;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>

      <div className="space-y-4 mb-6">
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
                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
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
          {/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) && (
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
            passwordData.newPassword === passwordData.confirmPassword && (
              <FontAwesomeIcon
                icon={faCheck}
                className="w-3 h-3 text-[#1ABC9C]"
              />
            )}
          <span
            className={
              passwordData.newPassword &&
              passwordData.confirmPassword &&
              passwordData.newPassword === passwordData.confirmPassword
                ? "text-[#1ABC9C] italic"
                : "text-gray-600"
            }
          >
            *Xác nhận mật khẩu trùng khớp
          </span>
        </div>
      </div>

      <button
        disabled={!isValid}
        className={`w-full py-3 rounded-xl font-semibold text-base transition-colors ${
          isValid
            ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Đổi mật khẩu
      </button>
    </>
  );
}
