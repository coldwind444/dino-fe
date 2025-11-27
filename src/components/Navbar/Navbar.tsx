"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser as faUserOutlined } from "@fortawesome/free-regular-svg-icons";
import {
  faCaretDown,
  faHouse,
  faCubes,
  faFireFlameCurved,
  faTrophy,
  faBarsProgress,
  faGamepad,
  faUser,
  faChartColumn,
  faHandsHoldingChild,
} from "@fortawesome/free-solid-svg-icons";
import { Roboto } from "next/font/google";
import { Righteous } from "next/font/google";
import clsx from "clsx";
import { useEffect, useState } from "react";

import brand from "../../../public/assets/brand.svg";
import fullEgg from "../../../public/assets/landing/egg_normal.png";
import brokenEgg from "../../../public/assets/landing/egg_break.png";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { usePathname, useRouter } from "next/navigation";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import Link from "next/link";
import ProfilePopup from "../ProfilePopup/ProfilePopup";
import { getUserProfile } from "@/apis/userApis";
import { logout } from "@/apis/authApis";

const roboto = Roboto({ subsets: ["latin"] });
const righteous = Righteous({ weight: "400" });

const studentLinks: { name: string; icon: IconDefinition; pathname: string }[] =
  [
    { name: "Nhà", icon: faHouse, pathname: "/student/home" },
    { name: "Bài học", icon: faCubes, pathname: "/student/lessons" },
    { name: "Đấu trường", icon: faFireFlameCurved, pathname: "/student/arena" },
    { name: "Xếp hạng", icon: faTrophy, pathname: "/student/leaderboard" },
    { name: "Nhiệm vụ", icon: faBarsProgress, pathname: "/student/missions" },
    { name: "Trò chơi", icon: faGamepad, pathname: "/student/games" },
  ];

const parentLinks: { name: string; icon: IconDefinition; pathname: string }[] =
  [
    { name: "Thống kê", icon: faChartColumn, pathname: "/parent/dashboard" },
    { name: "Học cùng con", icon: faHandsHoldingChild, pathname: "/parent/learning" },
  ];

export default function Navbar({
  isAuthenticated = false,
  role = null,
  notifications = [],
}: {
  isAuthenticated: boolean;
  username?: string | null;
  role?: string | null;
  avatarUrl?: string;
  notifications?: { title: string; content: string }[];
}) {
  const router = useRouter()
  const [signUpHover, setSignUpHover] = useState(false);
  const [urls, setUrls] = useState<{ name: string, icon: IconDefinition, pathname: string }[]>([]);
  const [notificationsShow, setNotificationsShow] = useState(false);
  const [profilePopupShow, setProfilePopupShow] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string|null>(null);

  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  useEffect(() => {
    if (role === "student") {
      setUrls(studentLinks);
    } else if (role === "parent") {
      setUrls(parentLinks);
    }
  }, [role])

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfile();
        setUsername(res.name.split(' ').pop() || '');
        setAvatar(res.avatarUrl);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    fetchUserProfile();
  }, [])

  return (
    <div
      className={clsx(
        "bg-white border-2 border-[rgba(0,0,0,0.1)] h-[80px] w-screen",
        "flex items-center justify-center pl-5 pr-5"
      )}
    >
      <Image src={brand} height={20} width={100} alt="dino-brand" />
      {isAuthenticated && (
        <div className="flex gap-[20px] items-center ml-auto mr-auto">
          {urls.map((item, key) => (
            <Link
              href={item.pathname}
              key={key}
              className={clsx(
                "flex items-center h-[50px] rounded-[25px] overflow-hidden pl-[13px] pr-[16px] transition-all duration-500 group cursor-pointer",
                pathname.startsWith(item.pathname)
                  ? "bg-[#23BEAA] max-w-[250px]"
                  : "bg-[rgba(0,0,0,0.1)] max-w-[50px] hover:bg-[#23BEAA] hover:max-w-[250px]"
              )}
            >
              <FontAwesomeIcon
                className={clsx(
                  "text-[20px] flex-shrink-0 transition-colors duration-300 mr-[10px]",
                  pathname.startsWith(item.pathname)
                    ? "text-white"
                    : "text-[rgba(0,0,0,0.6)] group-hover:text-white"
                )}
                icon={item.icon}
              />

              <span
                className={clsx(
                  "whitespace-nowrap font-medium transition-all duration-300 text-center",
                  pathname.startsWith(item.pathname)
                    ? "opacity-100 text-white"
                    : "opacity-0 text-[rgba(0,0,0,0.6)] group-hover:opacity-100 group-hover:text-white"
                )}
              >
                {item.name}
              </span>
            </Link>

          ))}
        </div>
      )}
      {!isAuthenticated ? (
        <div
          className={clsx(
            "flex gap-[10px] items-center justify-center ml-auto mr-10px"
          )}
        >
          <Link
            href="/auth"
            onMouseEnter={() => setSignUpHover(true)}
            onMouseLeave={() => setSignUpHover(false)}
            className={clsx(
              "h-[55px] w-[170px] bg-[#FF5964] rounded-[15px] cursor-pointer hover:opacity-90"
            )}
          >
            <div
              className={clsx(
                "h-[50px] w-[166px] bg-white border-2 border-[#FF5964] rounded-[10px]",
                "flex justify-center items-center gap-[15px]"
              )}
            >
              <label
                className={clsx(
                  roboto.className,
                  "font-bold text-[18px] text-[#FF5964] select-none cursor-pointer"
                )}
              >
                Đăng ký
              </label>
              <Image
                src={signUpHover ? brokenEgg : fullEgg}
                height={30}
                width={30}
                alt="egg"
              />
            </div>
          </Link>
          <Link
            href="/auth"
            className={clsx(
              "h-[55px] w-[170px] bg-[#15897A] rounded-[15px] cursor-pointer"
            )}
          >
            <div
              className={clsx(
                "h-[50px] w-[166px] bg-[#1DA492] rounded-[10px]",
                "flex justify-center items-center",
                "hover:opacity-90"
              )}
            >
              <label
                className={clsx(
                  roboto.className,
                  "font-bold text-[18px] text-white select-none cursor-pointer"
                )}
              >
                Đăng nhập
              </label>
            </div>
          </Link>
        </div>
      ) : (
        <div
          className={clsx(
            "flex items-center justify-center gap-[20px] mr-[10px]"
          )}
        >
          <div
            className={clsx(
              "h-[30px] aspect-square rounded-full hover:bg-[#D9D9D9] cursor-pointer",
              "flex items-center justify-center"
            )}
          >
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div
            className={clsx(
              "h-[30px] aspect-square rounded-full hover:bg-[#D9D9D9] cursor-pointer",
              "flex items-center justify-center"
            )} onClick={() => setProfilePopupShow(true)}
          >
            <FontAwesomeIcon icon={faUserOutlined} />
          </div>
          {avatar&&<Image src={avatar} alt="avatar" height={60} width={60} />}
          <div className={clsx("flex flex-col justify-center mt-[5px]")}>
            <label className={clsx(righteous.className, "select-none")}>
              Xin chào,
            </label>
            <label
              className={clsx(
                roboto.className,
                "text-[22px] select-none font-bold"
              )}
            >
              {username}
            </label>
          </div>
          <FontAwesomeIcon
            onClick={() => handleLogout()}
            className={clsx("cursor-pointer text-rose-500")}
            icon={faSignOut}
          />
        </div>
      )}
      <ProfilePopup
        isOpen={profilePopupShow}
        onClose={() => setProfilePopupShow(false)}
      />
    </div>
  );
}
