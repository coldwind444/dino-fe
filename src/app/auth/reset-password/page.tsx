"use client";

import MascotWriting from "@/components/MascotWriting/MascotWriting";
import Image from "next/image";
import Link from "next/link";
import { faCheck, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

import brand from "../../../../public/assets/brand.svg";
import verify from "../../../../public/assets/auth/step_1.png";
import otpImg from "../../../../public/assets/auth/step_2.png";
import RoundedTextBox from "@/components/RoundedTextBox/RoundedTextBox";
import RoundedPasswordBox from "@/components/RoundedPasswordBox/RoundedPasswordBox";
import OTPInput from "@/components/OTPInput/OTPInput";
import { sendOtp, resetPassword } from "@/apis/auth";

// Steps: 0 = Send OTP, 1 = Verify OTP + Set New Password
const steps = ["Gửi OTP về Email", "Xác thực & Đặt lại mật khẩu"];
const messages = [
  "Vui lòng nhập email mà bạn đã dùng để đăng ký tài khoản của mình nhé !",
  "Nhập mã OTP từ email và đặt mật khẩu mới của bạn nhé !",
  "Tuyệt vời ! Mật khẩu mới, khởi đầu mới đúng không nè !",
];

export default function ResetPassword() {
  const isFirstRender = useRef(true);

  // UI states
  const [currStep, setCurrStep] = useState(0);
  const [pose, setPose] = useState<"IDLE" | "TALKING" | "WRITING">("IDLE");
  const [msg, setMsg] = useState(messages[0]);

  // Loading states
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Data states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Validation helpers
  const isValidEmail = () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validEmail.test(email);
  };

  const isStrongPassword = () => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
    return strongPassword.test(password);
  };

  const isConfirmMatch = () => password.length > 0 && password === confirm;

  const isValidPassword = () => isStrongPassword() && isConfirmMatch();

  // Show mascot message
  const showMessage = (message: string) => {
    setMsg(message);
    setPose("WRITING");
    const talkingTimer = setTimeout(() => setPose("TALKING"), 1300);
    const idleTimer = setTimeout(() => setPose("IDLE"), 4300);
    return () => {
      clearTimeout(talkingTimer);
      clearTimeout(idleTimer);
    };
  };

  // Effects
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    showMessage(messages[Math.min(currStep, messages.length - 1)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currStep]);

  // Handlers
  const handleSendOtp = async () => {
    if (!isValidEmail() || sendingOtp) return;
    setSendingOtp(true);
    try {
      await sendOtp(email);
      setCurrStep(1);
    } catch (err: any) {
      showMessage(err?.message ?? "Đã xảy ra lỗi, vui lòng thử lại !");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isValidPassword() || otp.length < 5 || resettingPassword) return;
    setResettingPassword(true);
    try {
      await resetPassword({ email, otp, newPassword: password });
      showMessage(messages[2]);
      setCurrStep(0);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      showMessage(err?.message ?? "Đã xảy ra lỗi, vui lòng thử lại !");
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-row p-[20px]">
      {/** Process bar */}
      <div className="w-1/4 h-full border-2 border-[rgba(0,0,0,0.1)] rounded-[20px] flex flex-col justify-between">
        {steps.map((val, idx) => (
          // Steps
          <div className="flex flex-col" key={idx}>
            <div
              className="flex flex-row gap-[15px] p-[30px] items-center relative"
              key={idx}
            >
              {/** Step Circle */}
              <div
                className={clsx(
                  "h-[50px] aspect-square rounded-full font-bold flex items-center justify-center text-[22px]",
                  {
                    "bg-[#3B84F2] text-white": currStep === idx,
                    "bg-[#3BB766] text-white": currStep > idx,
                    "bg-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.4)]":
                      currStep < idx,
                  },
                )}
              >
                <div
                  className={clsx(
                    "h-[45px] aspect-square bg-transparent border-2 rounded-full",
                    "flex items-center justify-center",
                    currStep !== idx ? "border-transparent" : "border-white",
                  )}
                >
                  {currStep === idx ? (
                    idx + 1
                  ) : currStep < idx ? (
                    "O"
                  ) : (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                </div>
              </div>
              {/** Process status */}
              <div className="flex flex-col justify-center">
                <label
                  className={clsx("text-[20px] font-medium", {
                    "text-[#3B84F2]": currStep === idx,
                    "text-[#3BB766]": currStep > idx,
                    "text-[rgba(0,0,0,0.4)]": currStep < idx,
                  })}
                >{`Bước ${idx + 1}`}</label>
                <label className={clsx("text-[25px] font-medium")}>{val}</label>
                <div
                  className={clsx(
                    "py-[5px] px-[15px] h-fit w-fit text-[16px] font-medium rounded-full mt-[7px]",
                    {
                      "bg-[#C9DEFE] text-[#2F6CC9]": currStep === idx,
                      "bg-[#CCF0D9] text-[#3BB766]": currStep > idx,
                      "bg-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.4)]":
                        currStep < idx,
                    },
                  )}
                >
                  {currStep === idx
                    ? "Đang thực hiện"
                    : currStep < idx
                      ? "Chưa thực hiện"
                      : "Đã hoàn thành"}
                </div>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={clsx(
                  "absolute w-[5px] h-[280px] translate-y-[52%] translate-x-[52px] rounded-full",
                  "bg-[rgba(0,0,0,0.1)]",
                )}
              >
                <div
                  className={clsx(
                    "w-full transition-all duration-500 rounded-full bg-[#3BB766]",
                    currStep > idx ? "h-full" : "h-0",
                  )}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/** Main area */}
      <div className="flex flex-col flex-1 h-full">
        {/** Header */}
        <div className="flex flex-row gap-[50px] h-fit">
          {/** Mascot */}
          <div className="flex flex-row justify-between h-[250px] overflow-hidden">
            <MascotWriting pose={pose} />
            <div className="w-fit px-[20px] py-[8px] h-fit border-2 border-amber-600 rounded-[20px] -ml-[100px]">
              <p className="max-w-[250px] text-wrap text-amber-600 font-medium">
                {msg}
              </p>
            </div>
          </div>
        </div>

        {/** Body */}
        <div className="flex flex-1 w-full justify-center">
          {/** Step 1 — Send OTP */}
          <div
            className={clsx(
              "flex flex-col gap-[20px] items-center",
              currStep !== 0 ? "hidden" : "",
            )}
          >
            <Image src={verify} alt="" className="h-[80px]" width={80} />
            <label className="font-medium text-[30px]">
              Xác thực tài khoản
            </label>
            <RoundedTextBox
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              disabled={!isValidEmail() || sendingOtp}
              className={clsx(
                "h-[50px] w-[400px] rounded-full cursor-pointer bg-[#23BEAA]",
                "text-white font-medium text-[18px] hover:opacity-90",
                "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:opacity-100",
                "flex items-center justify-center gap-[10px] transition-all",
              )}
              onClick={handleSendOtp}
            >
              {sendingOtp && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              {sendingOtp ? "Đang gửi..." : "Gửi mã xác thực"}
            </button>
          </div>

          {/** Step 2 — OTP + New Password (combined) */}
          <div
            className={clsx(
              "flex flex-col gap-[20px] items-center",
              currStep !== 1 ? "hidden" : "",
            )}
          >
            <Image src={otpImg} alt="" className="h-[80px]" width={80} />
            <label className="font-medium text-[30px]">
              Xác thực & Đặt lại mật khẩu
            </label>

            {/** OTP section */}
            <div className="flex flex-col gap-[8px] items-center w-full">
              <span className="text-[14px] text-[rgba(0,0,0,0.5)] self-start pl-[20px] font-medium">
                Mã OTP từ Email
              </span>
              <OTPInput
                length={5}
                onChange={(val) => setOtp(val)}
                onComplete={(val) => setOtp(val)}
                autoFocus
              />
            </div>

            {/** Divider */}
            <div className="flex items-center w-[400px] gap-[10px]">
              <div className="flex-1 h-[1px] bg-[rgba(0,0,0,0.1)]" />
              <span className="text-[13px] text-[rgba(0,0,0,0.4)]">
                Mật khẩu mới
              </span>
              <div className="flex-1 h-[1px] bg-[rgba(0,0,0,0.1)]" />
            </div>

            {/** Password fields */}
            <RoundedPasswordBox
              value={password}
              placeholder="Mật khẩu mới"
              onChange={(e) => setPassword(e.target.value)}
              showTooltip={true}
              requirement="Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
              isValid={password.length > 0 ? isStrongPassword() : undefined}
            />
            <RoundedPasswordBox
              value={confirm}
              placeholder="Xác nhận mật khẩu"
              onChange={(e) => setConfirm(e.target.value)}
              showTooltip={true}
              requirement="Mật khẩu xác nhận phải trùng với mật khẩu mới"
              isValid={confirm.length > 0 ? isConfirmMatch() : undefined}
            />

            <button
              disabled={!isValidPassword() || otp.length < 5 || resettingPassword}
              className={clsx(
                "h-[50px] w-[400px] rounded-full cursor-pointer bg-[#23BEAA]",
                "text-white font-medium text-[18px] hover:opacity-90",
                "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:opacity-100",
                "flex items-center justify-center gap-[10px] transition-all",
              )}
              onClick={handleResetPassword}
            >
              {resettingPassword && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              {resettingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </button>
          </div>
        </div>
      </div>

      <Link href="/">
        <Image
          src={brand}
          alt=""
          className="absolute top-0 right-0 mt-[20px] mr-[20px] h-[40px]"
          width={150}
        />
      </Link>
    </div>
  );
}
