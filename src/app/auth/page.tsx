"use client";

import {
  faArrowLeft,
  faNewspaper,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Roboto, Fredoka } from "next/font/google";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";

import mascot from "../../../public/assets/auth/dino_3d.svg";
import student from "../../../public/assets/auth/student.png";
import parents from "../../../public/assets/auth/parents.png";
import leftHand from "../../../public/assets/auth/left.svg";
import rightHand from "../../../public/assets/auth/right.svg";
import logo from "../../../public/assets/logo.svg";

import RoundedTextBox from "@/components/RoundedTextBox/RoundedTextBox";
import RoundedPasswordBox from "@/components/RoundedPasswordBox/RoundedPasswordBox";
import Link from "next/link";
import { googleLogin, login, register } from "@/apis";
import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

const roboto = Roboto();
const fredoka = Fredoka();

const ROLES = {
  STUDENT: "student",
  PARENT: "parent",
};

const TABS = {
  LOG_IN: 0,
  SIGN_UP: 1,
};

const AUTHSTEPS = {
  SELECT_ROLE: 0,
  LOG_IN: 1,
  PERSONAL_INFO: 2,
  SIGN_UP: 3,
};

export default function Auth() {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
  const hasGoogleClientId = clientId.length > 0;

  // UI states
  const [tabIndex, setTabIndex] = useState(TABS.LOG_IN);
  const [registerStep, setRegisterStep] = useState(AUTHSTEPS.SELECT_ROLE);
  const [role, setRole] = useState<string>(ROLES.STUDENT);
  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // Login request states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);

  // Register request states
  const [identifier2, setIdentifier2] = useState("");
  const [password2, setPassword2] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [fullName, setFullName] = useState(""); // only for parent

  // Show/hide password handlers
  const onStateChange = (state: boolean) => {
    setPasswordShow(state);
  };

  // Check if data is valid for login
  const canLogin = () => {
    return identifier.length > 0 && password.length > 0;
  };

  // Check if data is valid for register
  const canRegister = () => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (role === ROLES.STUDENT)
      return (
        strongPassword.test(password2) &&
        identifier2.length >= 8 &&
        confPassword === password2
      );
    else
      return (
        strongPassword.test(password2) &&
        validEmail.test(identifier2) &&
        confPassword === password2 &&
        fullName.length > 0
      );
  };

  // Login handler
  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      const res = await login({ identifier, password });
      if (res.user.role === ROLES.PARENT) {
        router.push("/parent/dashboard");
      } else if (res.user.role === ROLES.STUDENT) {
        if (res.user.name && res.user.name.length > 0) {
          router.push("/student/home");
        } else {
          router.push("/onboarding");
        }
      } else if (res.user.role === "admin") {
        toast.error("Quản trị viên không có quyền truy cập vào trang này");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      resetLogin();
      setLoginLoading(false);
    }
  };

  // Register handler
  const handleRegister = async () => {
    try {
      setRegLoading(true);
      await register({
        email: role === ROLES.PARENT ? identifier2 : "",
        username: role === ROLES.STUDENT ? identifier2 : "",
        password: password2,
        role,
        name: role === ROLES.PARENT ? fullName : "",
        avatarUrl:
          role === ROLES.PARENT
            ? "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761540872/avt_05_hq86rj.svg"
            : "",
        familyId: "",
      });
      toast.success("Đăng ký thành công !");
      resetRegister();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  // Clear all login fields
  const resetLogin = () => {
    setIdentifier("");
    setPassword("");
  };

  // Clear all register fields
  const resetRegister = () => {
    setIdentifier2("");
    setPassword2("");
    setFullName("");
    setConfPassword("");
  };

  // Reset register and login fields when switching tabs
  useEffect(() => {
    setRegisterStep(AUTHSTEPS.SELECT_ROLE);
    resetLogin();
    resetRegister();
  }, [tabIndex]);

  // handle google login
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin({
        token: credentialResponse.credential,
        role: "parent",
        familyId: "",
      });
      router.push("/parent/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      resetLogin();
    }
  };

  const handleError = () => {
    toast.error("Thất bại khi xác minh tài khoản Google.");
  };

  return (
    <div className="w-screen h-screen bg-[#F6F6F6] flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      {/** Container card */}
      <div
        className={clsx(
          "flex flex-row h-[90%] w-[95%] bg-white rounded-[70px]",
          "shadow-[0_0_20px_rgba(0,0,0,0.2)]",
        )}
      >
        {/** Sidebar */}
        <div
          className={clsx(
            "h-[100%] w-1/6 bg-[#23BEAA] rounded-tl-[70px] rounded-bl-[70px]",
            "flex flex-col pt-[20px] relative",
          )}
        >
          {/** Back link */}
          <Link
            href="/"
            className={clsx(
              "flex flex-row items-center justify-center gap-[20px] text-white",
              "cursor-pointer hover:gap-[40px] transition-all duration-200",
            )}
          >
            <FontAwesomeIcon className="h-[15px] w-[15px]" icon={faArrowLeft} />
            <label
              className={clsx(
                "select-none font-medium text-[16px] cursor-pointer",
                roboto.className,
              )}
            >
              Về trang chủ
            </label>
          </Link>
          {/** Tabs container*/}
          <div className={clsx("flex flex-col mt-[100%] mb-auto")}>
            {/** Log in tab button*/}
            <div
              className={clsx(
                "flex flex-row gap-[30px] items-center text-white h-[50px] cursor-pointer",
                "transition-all duration-200",
                { "bg-[#1DA492]": tabIndex === TABS.LOG_IN },
              )}
              onClick={() => setTabIndex(0)}
            >
              <div
                className={clsx(
                  "bg-white h-full w-[8px] transition-all duration-200",
                  tabIndex === TABS.LOG_IN ? "opacity-100" : "opacity-0",
                )}
              />
              <FontAwesomeIcon icon={faUnlock} className="h-[20px] w-[20px]" />
              <label
                className={clsx(
                  roboto.className,
                  "text-[18px] font-medium cursor-pointer",
                )}
              >
                Đăng nhập
              </label>
            </div>
            {/** Sign up tab button*/}
            <div
              className={clsx(
                "flex flex-row gap-[30px] items-center text-white h-[50px] cursor-pointer",
                "transition-all duration-200",
                { "bg-[#1DA492]": tabIndex === TABS.SIGN_UP },
              )}
              onClick={() => setTabIndex(1)}
            >
              <div
                className={clsx(
                  "bg-white h-full w-[8px] transition-all duration-200",
                  tabIndex === TABS.SIGN_UP ? "opacity-100" : "opacity-0",
                )}
              />
              <FontAwesomeIcon
                icon={faNewspaper}
                className="h-[20px] w-[20px]"
              />
              <label
                className={clsx(
                  roboto.className,
                  "text-[18px] font-medium cursor-pointer",
                )}
              >
                Đăng ký
              </label>
            </div>
          </div>
          {/** Dinosaur spots */}
          <div className="absolute bottom-0 right-0 -translate-y-[50px] mr-[30px] rotate-180">
            <div className="h-[14px] aspect-square bg-[#1DA492] rounded-full absolute" />
            <div className="h-[14px] aspect-square bg-[#1DA492] rounded-full absolute translate-x-[20px]" />
            <div className="h-[14px] aspect-square bg-[#1DA492] rounded-full absolute translate-x-[10px] -translate-y-[20px]" />
          </div>
        </div>

        {/** Main area */}
        <div className="flex flex-1 relative">
          {/** Auth container */}
          <div className="h-full w-1/2 flex flex-col">
            {tabIndex === TABS.LOG_IN ? (
              <div className="h-full w-full overflow-hidden">
                {/** Login slider */}
                <div
                  className={clsx("flex flex-row h-full w-full justify-center")}
                >
                  {/** Log in step container */}
                  <div className="flex items-center justify-center gap-[20px] flex-col h-full w-1/2 bg-white">
                    {/** Mascot animation */}
                    <div className="relative aspect-square h-[180px] border-2 border-[#1DA492] rounded-full overflow-hidden">
                      <iframe
                        src="https://cdn.lottielab.com/l/2HPdkE6AbKUhHe.html"
                        height={380}
                        className="-translate-x-[12px] translate-y-[20px] z-0"
                      />
                      <Image
                        src={leftHand}
                        alt=""
                        height={60}
                        className={clsx(
                          "absolute -translate-y-[290px] transition-all duration-400 z-[1]",
                          {
                            "translate-x-[100px]": !passwordShow,
                            "translate-x-[200px]": passwordShow,
                          },
                        )}
                      />
                      <Image
                        src={rightHand}
                        alt=""
                        height={60}
                        className={clsx(
                          "absolute -translate-y-[290px] transition-all duration-400 z-[1]",
                          { "-translate-x-[100px]": passwordShow },
                        )}
                      />
                    </div>
                    {/** Title */}
                    <h1
                      className={clsx(
                        roboto.className,
                        "text-[27px] font-bold text-[#1DA492]",
                      )}
                    >
                      Đăng nhập
                    </h1>
                    {/** Fields */}
                    <div className="flex flex-col gap-[10px]">
                      <RoundedTextBox
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setIdentifier(e.target.value)
                        }
                        placeholder="Email hoặc tên đăng nhập"
                        width="330"
                        value={identifier}
                      />
                      <RoundedPasswordBox
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        onStateChange={onStateChange}
                        value={password}
                        placeholder="Mật khẩu"
                        width="330"
                      />
                    </div>
                    {/** Forget password link */}
                    <Link
                      className={clsx(
                        "font-medium cursor-pointer hover:text-[#1DA492] hover:underline",
                        "mr-[150px]",
                      )}
                      href="/auth/reset-password"
                    >
                      Quên mật khẩu ?
                    </Link>
                    {/** Login button */}
                    <button
                      disabled={!canLogin()}
                      className={clsx(
                        "h-[50px] rounded-full w-[330px] bg-[#23BEAA] text-white font-medium",
                        "disabled:bg-gray-300 cursor-not-allowed relative flex items-center justify-center",
                        {
                          "cursor-pointer hover:opacity-90":
                            identifier.length > 0 && password.length > 0,
                        },
                      )}
                      onClick={() => handleLogin()}
                    >
                      Đăng nhập
                      <div className="absolute right-0 aspect-square h-[30px] mr-[15px]">
                        <Loader isLoading={loginLoading} />
                      </div>
                    </button>
                    {/** Login with google */}
                    <React.Fragment>
                      <div className="h-5 w-[300px] flex relative items-center justify-center">
                        <span className="h-0.5 w-full bg-gray-200"></span>
                        <span className="mr-auto ml-auto absolute bg-white px-2 text-gray-400">
                          Hoặc
                        </span>
                      </div>
                      {hasGoogleClientId ? (
                        <GoogleOAuthProvider clientId={clientId}>
                          <GoogleLogin
                            size="large"
                            shape="pill"
                            theme="filled_blue"
                            width={330}
                            type="standard"
                            onSuccess={handleSuccess}
                            onError={handleError}
                          />
                          <div className="text-gray-400 text-base">
                            (Chỉ dành cho phụ huynh)
                          </div>
                        </GoogleOAuthProvider>
                      ) : (
                        <div className="w-[330px] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
                          Đăng nhập Google hiện chưa được cấu hình.
                        </div>
                      )}
                    </React.Fragment>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full overflow-hidden">
                {/** Sign up slider */}
                <div
                  className={clsx(
                    "flex flex-row h-full w-[200%] transition-all duration-200",
                    {
                      "translate-x-[-50%]": registerStep === AUTHSTEPS.SIGN_UP,
                    },
                  )}
                >
                  {/** Select role step container */}
                  <div className="flex items-center justify-center gap-[40px] flex-col h-full w-1/2 bg-white">
                    <h1
                      className={clsx(
                        "text-[25px] text-[#1DA492] font-bold",
                        roboto.className,
                      )}
                    >
                      Tạo tài khoản với vai trò:
                    </h1>
                    <div
                      className={clsx(
                        "flex flex-row items-center pl-[20px] gap-[100px] h-[120px] w-[450px] rounded-[20px] border-3 cursor-pointer border-[rgba(0,0,0,0.2)]",
                        "group text-[rgba(0,0,0,0.7)] hover:border-[#23BEAA] hover:text-[#23BEAA] transition-all duration-200",
                      )}
                      onClick={() => {
                        setRole(ROLES.STUDENT);
                        setRegisterStep(AUTHSTEPS.SIGN_UP);
                      }}
                    >
                      <Image
                        className="group-hover:scale-150 transition-all duration-200"
                        src={student}
                        height={100}
                        alt=""
                      />
                      <label
                        className={clsx(
                          "text-[25px] font-bold select-none cursor-pointer",
                          roboto.className,
                        )}
                      >
                        Học sinh
                      </label>
                    </div>
                    <div
                      className={clsx(
                        "flex flex-row items-center pl-[20px] gap-[100px] h-[120px] w-[450px] rounded-[20px] border-3 cursor-pointer border-[rgba(0,0,0,0.2)]",
                        "group text-[rgba(0,0,0,0.7)] hover:border-[#23BEAA] hover:text-[#23BEAA] transition-all duration-200",
                      )}
                      onClick={() => {
                        setRole(ROLES.PARENT);
                        setRegisterStep(AUTHSTEPS.SIGN_UP);
                      }}
                    >
                      <Image
                        className="group-hover:scale-150 transition-all duration-200"
                        src={parents}
                        height={100}
                        alt=""
                      />
                      <label
                        className={clsx(
                          "text-[25px] font-bold select-none cursor-pointer",
                          roboto.className,
                        )}
                      >
                        Phụ huynh
                      </label>
                    </div>
                  </div>
                  {/** Sign up step container */}
                  <div className="flex items-center justify-center gap-[20px] flex-col h-full w-1/2 bg-white relative">
                    {/** Back button */}
                    <div
                      className={clsx(
                        "absolute top-[40px] left-[40px] flex flex-row items-center justify-center gap-[15px] text-[#91AA9F]",
                        "cursor-pointer hover:gap-[25px] hover:text-[#23BEAA] transition-all duration-200",
                      )}
                      onClick={() => {
                        setRegisterStep(AUTHSTEPS.SELECT_ROLE);
                        resetRegister();
                      }}
                    >
                      <FontAwesomeIcon
                        className="h-[20px] w-[20px]"
                        icon={faArrowLeft}
                      />
                      <label
                        className={clsx(
                          "text-[18px] font-medium cursor-pointer select-none",
                          roboto.className,
                        )}
                      >
                        Quay lại
                      </label>
                    </div>
                    <div className="flex flex-col gap-[2px] items-center justify-center">
                      <Image src={logo} height={80} width={80} alt="" />
                      <h1
                        className={clsx(
                          roboto.className,
                          "text-[27px] font-bold text-[#1DA492]",
                        )}
                      >
                        {`Đăng ký tài khoản ${role === ROLES.PARENT ? "phụ huynh" : "học sinh"}`}
                      </h1>
                      <p
                        className={clsx(
                          roboto.className,
                          "text-[20px] font-medium text-[#91AA9F]",
                        )}
                      >
                        Cùng gia nhập{" "}
                        <span
                          className={clsx(
                            fredoka.className,
                            "font-bold text-[#1DA492]",
                          )}
                        >
                          dino
                        </span>{" "}
                        nào !
                      </p>
                    </div>
                    <div className="flex flex-col gap-[10px]">
                      {role === ROLES.PARENT && (
                        <RoundedTextBox
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFullName(e.target.value)
                          }
                          placeholder="Họ và tên"
                          width="330"
                          value={fullName}
                        />
                      )}
                      <RoundedTextBox
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setIdentifier2(e.target.value)
                        }
                        placeholder={
                          role === ROLES.PARENT ? "Email" : "Tên đăng nhập"
                        }
                        width="330"
                        requirement={
                          role === ROLES.PARENT
                            ? "Email phải đúng định dạng"
                            : "Tên đăng nhập phải ≥8 ký tự"
                        }
                        value={identifier2}
                        isValid={
                          role === ROLES.PARENT
                            ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier2)
                            : identifier2.length >= 8
                        }
                        showTooltip
                      />
                      <RoundedPasswordBox
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword2(e.target.value)
                        }
                        placeholder="Mật khẩu"
                        width="330"
                        value={password2}
                        requirement="Mật khẩu phải ≥8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
                        isValid={
                          password2.length >= 8 &&
                          /[A-Z]/.test(password2) &&
                          /[a-z]/.test(password2) &&
                          /[0-9]/.test(password2) &&
                          /[^A-Za-z0-9]/.test(password2)
                        }
                        showTooltip
                      />
                      <RoundedPasswordBox
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setConfPassword(e.target.value)
                        }
                        placeholder="Xác nhận mật khẩu"
                        width="330"
                        value={confPassword}
                        isValid={password2 === confPassword}
                        showTooltip
                        requirement="Xác nhận mật khẩu phải khớp."
                      />
                    </div>
                    <button
                      disabled={!canRegister()}
                      className={clsx(
                        "h-[50px] rounded-full w-[330px] bg-[#23BEAA] text-white font-medium",
                        "disabled:bg-gray-300 cursor-not-allowed relative flex items-center justify-center",
                        {
                          "cursor-pointer hover:opacity-90":
                            identifier2.length > 0 &&
                            password2.length > 0 &&
                            password2 === confPassword,
                        },
                      )}
                      onClick={() => handleRegister()}
                    >
                      Tạo tài khoản
                      <div className="absolute right-0 aspect-square h-[30px] mr-[15px]">
                        <Loader isLoading={regLoading} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/** Mascot 3D */}
          <div className="absolute right-10 bottom-10 flex items-end justify-center h-full w-1/2 overflow-hidden pointer-events-none">
            <Image
              className="max-h-[150%] w-auto object-contain select-none"
              src={mascot}
              alt=""
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
