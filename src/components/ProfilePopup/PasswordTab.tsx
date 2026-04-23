"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { UserProfileResponse } from "@/types";
import OTPInput from "@/components/OTPInput/OTPInput";
import { sendOtp, resetPassword } from "@/apis/auth";
import toast from "react-hot-toast";
import { APIError } from "@/apis/config";

export default function PasswordTab({
  profile,
}: {
  profile: UserProfileResponse;
}) {
  const isParent = profile?.role === "parent";
  const identifier = isParent ? profile?.email : profile?.username;

  const [passwordData, setPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!identifier || sendingOtp || countdown > 0) return;
    setSendingOtp(true);
    try {
      await sendOtp(identifier);
      toast.success(
        isParent
          ? "Đã gửi mã xác thực về email của bạn!"
          : "Đã gửi mã xác thực đến email của Phụ huynh!",
      );
      setCountdown(600); // 10 minutes = 600 seconds
    } catch (err) {
      if (err instanceof APIError) {
        toast.error(err.message);
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const isStrongPassword = () => {
    return (
      passwordData.newPassword.length >= 8 &&
      /[A-Z]/.test(passwordData.newPassword) &&
      /[0-9]/.test(passwordData.newPassword) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)
    );
  };

  const isValid =
    passwordData.otp.length === 6 &&
    isStrongPassword() &&
    passwordData.newPassword === passwordData.confirmPassword;

  const handleResetPassword = async () => {
    if (!isValid || resettingPassword) return;
    setResettingPassword(true);
    try {
      await resetPassword({
        identifier,
        otp: passwordData.otp,
        newPassword: passwordData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
      setCountdown(0);
    } catch (err) {
      if (err instanceof APIError) {
        toast.error(err.message);
      }
    } finally {
      setResettingPassword(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>

      <div className="space-y-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã xác thực (OTP)
          </label>
          <div className="flex flex-col gap-3">
            <OTPInput
              length={6}
              onChange={(val) => setPasswordData({ ...passwordData, otp: val })}
              onComplete={(val) =>
                setPasswordData({ ...passwordData, otp: val })
              }
            />
            <div className="flex items-center gap-10">
              <button
                onClick={handleSendOtp}
                disabled={sendingOtp || countdown > 0}
                className="w-fit px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#E8F8F5] disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sendingOtp && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                )}
                {countdown > 0
                  ? `Gửi lại mã sau ${formatTime(countdown)}`
                  : "Gửi mã xác thực"}
              </button>
              {countdown > 0 && (
                <span className="text-sm text-gray-500">
                  Mã xác thực sẽ hết hiệu lực sau{" "}
                  <span className="font-medium text-orange-500">
                    {formatTime(countdown)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gray-200" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Mật khẩu mới
          </span>
          <div className="flex-1 h-[1px] bg-gray-200" />
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

      <div className="mb-6 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
        <div className="space-y-2">
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
        </div>

        <div className="space-y-2">
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
      </div>

      <button
        onClick={handleResetPassword}
        disabled={!isValid || resettingPassword}
        className={`w-full py-3 rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2 ${
          isValid
            ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {resettingPassword && (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        )}
        {resettingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
      </button>
    </>
  );
}
