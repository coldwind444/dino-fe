"use client";

import MascotWriting from "@/components/MascotWriting/MascotWriting";
import Image from "next/image";
import Link from "next/link";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import brand from "../../../../public/assets/brand.svg";
import RoundedTextBox from "@/components/RoundedTextBox/RoundedTextBox";
import RoundedPasswordBox from "@/components/RoundedPasswordBox/RoundedPasswordBox";
import OTPInput from "@/components/OTPInput/OTPInput";
import { sendOtp, resetPassword } from "@/apis/auth";
import { APIError } from "@/apis/config";
import ScreenLoader from "@/components/ScreenLoader/ScreenLoader";

const STEPS = ["Gửi OTP về Email", "Xác thực & Đặt lại mật khẩu"];

const MESSAGES = {
  INPUT_IDENTIFIER:
    "Vui lòng nhập email (nếu bạn là Phụ huynh) hoặc tên đăng nhập (nếu bạn là Học sinh) để xác thực tài khoản nhé !",
  INPUT_OTP_STUDENT: "Nhập mã OTP từ email và đặt mật khẩu mới của bạn nhé !",
  INPUT_OTP_PARENT:
    "Vui lòng liên hệ với Phụ huynh của bạn để lấy mã OTP và đặt lại mật khẩu nhé !",
  SUCCESS: "Tuyệt vời ! Mật khẩu mới, khởi đầu mới đúng không nè !",
  ACCOUNT_NOT_EXIST: "Tài khoản không tồn tại!",
  RATE_LIMIT:
    "Hệ thống đang bận! Bạn vui lòng đợi một chút rồi thử lại sau nhé!",
};

export default function ResetPassword() {
  const router = useRouter();

  // UI states
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currStep, setCurrStep] = useState(0);
  const [pose, setPose] = useState<"IDLE" | "TALKING" | "WRITING">("IDLE");
  const [msg, setMsg] = useState(MESSAGES.INPUT_IDENTIFIER);

  // Loading states
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Data states
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Validation helpers
  const isParent = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(identifier);
  };

  const isValidIdentifier = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return usernameRegex.test(identifier) || emailRegex.test(identifier);
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

  // Handlers
  const handleSendOtp = async () => {
    if (!isValidIdentifier() || sendingOtp) return;
    setSendingOtp(true);
    try {
      await sendOtp(identifier);
      setCurrStep(1);
      if (isParent()) {
        showMessage(MESSAGES.INPUT_OTP_PARENT);
      } else {
        showMessage(MESSAGES.INPUT_OTP_STUDENT);
      }
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 429) {
          showMessage(MESSAGES.RATE_LIMIT);
        } else {
          showMessage(err.message);
        }
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isValidPassword() || otp.length < 5 || resettingPassword) return;
    setResettingPassword(true);
    try {
      await resetPassword({ identifier, otp, newPassword: password });
      showMessage(MESSAGES.SUCCESS);
      setCurrStep(0);
      setIdentifier("");
      setOtp("");
      setPassword("");
      setConfirm("");
      showMessage(MESSAGES.SUCCESS);
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 200) {
          showMessage(MESSAGES.ACCOUNT_NOT_EXIST);
        }
        if (err.status === 429) {
          showMessage(MESSAGES.RATE_LIMIT);
        } else {
          showMessage(err.message);
        }
      }
    } finally {
      setResettingPassword(false);
    }
  };

  useEffect(() => {
    const images = [brand];
    let loadedCount = 0;
    images.forEach((img) => {
      const image = new window.Image();
      image.src = img.src;
      image.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) setImagesLoaded(true);
      };
      image.onerror = () => {
        loadedCount++;
        if (loadedCount === images.length) setImagesLoaded(true);
      };
    });
  }, []);

  if (!imagesLoaded) return <ScreenLoader />;

  return (
    <div className="h-screen w-screen flex flex-row p-[20px]">
      {/** Process bar */}
      <div className="w-1/4 h-full border-2 border-[rgba(0,0,0,0.1)] rounded-[20px] flex flex-col justify-between">
        {STEPS.map((val, idx) => (
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
            {idx < STEPS.length - 1 && (
              <div
                className={clsx(
                  "absolute w-[5px] h-[450px] translate-y-[30%] translate-x-[52px] rounded-full",
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
            <label className="font-medium text-[30px]">
              Xác thực tài khoản
            </label>
            <RoundedTextBox
              value={identifier}
              placeholder="Email hoặc tên đăng nhập"
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <button
              disabled={!isValidIdentifier() || sendingOtp}
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
            <label className="font-medium text-[30px]">
              Xác thực & Đặt lại mật khẩu
            </label>

            {/** OTP section */}
            <div className="flex flex-col gap-[8px] items-center w-full">
              <span className="text-[14px] text-[rgba(0,0,0,0.5)] self-start pl-[20px] font-medium">
                Mã OTP từ Email
              </span>
              <OTPInput
                length={6}
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
              disabled={
                !isValidPassword() || otp.length < 5 || resettingPassword
              }
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
