"use client"; // Required for Framer Motion animations

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

// ... (Keep your existing asset imports)
import plane from '../../public/assets/landing/paper-plane.png'
import idea from '../../public/assets/landing/idea.png'
import puzzle from '../../public/assets/landing/puzzle.png'
import game from '../../public/assets/landing/game.png'
import fight from '../../public/assets/landing/fighting.png'
import history from '../../public/assets/landing/history.png'
import pvp from '../../public/assets/landing/pvp.png'
import reading from '../../public/assets/landing/reading.png'
import dino from '../../public/assets/landing/dino.jpg'
import logo from '../../public/assets/logo.svg'

import aws from '../../public/assets/landing/aws.svg'
import next from '../../public/assets/landing/nextjs.svg'
import react from '../../public/assets/landing/react.svg'
import mongo from '../../public/assets/landing/mongo.svg'
import node from '../../public/assets/landing/nodejs.svg'
import cocos from '../../public/assets/landing/cocos.svg'


import { Baloo_2, Bricolage_Grotesque, Roboto } from "next/font/google";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStar, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

const BG = Bricolage_Grotesque()
const baloo = Baloo_2()
const roboto = Roboto()

export default function Home() {
  const reviews = [
    { name: "Chị Thu Thủy", role: "Phụ huynh bé lớp 2", content: "Bé nhà mình từ chỗ sợ học Toán nay đã chủ động đòi mở Dino Math mỗi tối." },
    { name: "Anh Minh Nhật", role: "Phụ huynh bé lớp 4", content: "Giao diện đẹp, dễ dùng. Tôi rất thích tính năng theo dõi tiến độ." },
    { name: "Cô Thanh Hằng", role: "Giáo viên Tiểu học", content: "Một công cụ hỗ trợ giảng dạy tuyệt vời. Các bài tập tương tác rất tốt." },
    { name: "Anh Hoàng Nam", role: "Phụ huynh bé lớp 1", content: "Con mình rất hào hứng với phần Đấu trường PvP. Rất cạnh tranh và vui!" },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <header className="top-0 h-fit w-full fixed z-50">
        <Navbar isAuthenticated={false} />
      </header>

      <div className="flex flex-col w-full h-fit overflow-x-hidden">
        {/** Section 1 - Getting started */}
        <section className="h-[770px] w-full flex flex-col items-center overflow-hidden">
          <div className="relative">
            <iframe src="https://cdn.lottielab.com/l/ALwZUaUV549Cdr.html" width="900" height="508"></iframe>
            <div className="bg-white h-[100px] w-[300px] -translate-y-[150px] right-0 absolute"></div>
          </div>
          <div className="flex items-center flex-col -translate-y-[150px]">
            <h1 className={clsx(BG.className, 'font-bold text-[50px] text-[rgba(0,0,0,0.7)]')}>Học mà chơi, chơi mà học !</h1>
            <p className={clsx(roboto.className, 'font-medium text-[20px] text-[rgba(0,0,0,0.5)] text-center')}>Dino là nền tảng web trực tuyến giúp việc học Toán tư duy <br /> trở nên thú vị hơn dành cho học sinh Tiểu học !</p>
          </div>
          <div className="flex flex-col items-center -translate-y-[120px] z-10">
            <Image src={plane} height={120} width={120} alt="" />
            <Link href='/auth' className={clsx(
              'h-[60px] w-[290px] rounded-[35px] bg-[#AF7522] cursor-pointer',
              '-translate-y-[10px] hover:opacity-90'
            )}>
              <div className={clsx(
                'h-[60px] w-[290px] rounded-[35px] bg-[#F1A12E]',
                'flex flex-row gap-[20px] items-center justify-center text-white -translate-y-[6px]',
                'hover:-translate-y-[3px] transition-all duration-200'
              )}>
                <label className={clsx(roboto.className, 'text-[20px] ml-[20px] font-medium cursor-pointer')}>Bắt đầu ngay</label>
                <FontAwesomeIcon className={clsx('h-[30px] w-[30px] ml-[20px]')} icon={faPlay} />
              </div>
            </Link>
          </div>
        </section>

        {/** NEW SECTION: Statistics with scroll animation */}
        <StatisticsSection />

        {/** Section 2 - Features with scroll animation */}
        <FeaturesSection />

        {/** SECTION: Animated User Reviews with scroll animation */}
        <ReviewsSection reviews={reviews} />

        {/** Tech support */}
        <div className="h-50 w-full bg-white items-center justify-center flex flex-col gap-8 border-gray-100 border">
          <span className="font-medium text-xl">Được hỗ trợ bởi</span>
          <div className="flex flex-row justify-around w-full">
              <Image src={aws} alt="" height={70} width={70}/>
              <Image src={next} alt="" height={70} width={70}/>
              <Image src={react} alt="" height={70} width={70}/>
              <Image src={mongo} alt="" height={70} width={70}/>
              <Image src={node} alt="" height={70} width={70}/>
              <Image src={cocos} alt="" height={70} width={70}/>
          </div>
        </div>
      </div>

      {/** Footer */}
      <footer>
        <div className="flex flex-row h-fit w-full bg-[#1C6655] gap-10">
          <Image src={dino} alt="" height={400} width={400} className="rounded-tr-[250px] object-cover" />
          <div className="h-[400px] w-full flex flex-col">
            <div className="flex flex-row pt-10 gap-40 flex-wrap">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-3 items-end">
                  <Image src={logo} alt="" height={60} width={60} />
                  <span className={clsx(baloo.className, 'font-bold text-white text-2xl')}>DINO MATH</span>
                </div>
                <p className="text-[rgba(255,255,255,0.8)] text-[17px] max-w-85 text-wrap ml-3">
                  Dino Math là website hỗ trợ học Toán tư duy dành cho học sinh Tiểu học.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-5">
                <span className="text-white font-bold">Sản phẩm</span>
                <Link href={''} className="text-[rgba(255,255,255,0.7)] font-light hover:text-white">Dùng ngay</Link>
                <Link href={''} className="text-[rgba(255,255,255,0.7)] font-light hover:text-white">Các tính năng nổi bật</Link>
                <Link href={''} className="text-[rgba(255,255,255,0.7)] font-light hover:text-white">Phản hồi</Link>
              </div>
              <div className="flex flex-col gap-3 pt-5">
                <span className="text-white font-bold">Công ty</span>
                <Link href={''} className="text-[rgba(255,255,255,0.7)] font-light hover:text-white">Về chúng tôi</Link>
                <Link href={''} className="text-[rgba(255,255,255,0.7)] font-light hover:text-white">Quyền riêng tư</Link>
                <Link href={''} className="text-[rgba(255,255,255,0.7)] font-light hover:text-white">Điều khoản dịch vụ</Link>
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-auto mb-5">
              <span className="h-[1px] w-[95%] bg-[rgba(255,255,255,0.5)]"></span>
              <span className="text-white font-bold">© 2025 Dino Math. Bảo lưu mọi quyền.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Statistics Section Component with Animation
function StatisticsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { num: "50,000+", label: "Học sinh đăng ký" },
    { num: "1M+", label: "Bài tập đã giải" },
    { num: "95%", label: "Phụ huynh hài lòng" },
    { num: "4.8/5", label: "Đánh giá ứng dụng" },
  ];

  return (
    <section ref={ref} className="py-20 bg-white w-full flex justify-center border-y border-gray-100">
      <div className="max-w-6xl w-full grid grid-cols-2 md:grid-cols-4 gap-10 px-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <span className={clsx(BG.className, "text-4xl font-bold text-[#1DA492]")}>{stat.num}</span>
            <span className={clsx(roboto.className, "text-gray-500 font-medium mt-2")}>{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Features Section Component with Animation
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    { icon: puzzle, text: "Học toán qua các bài tập dạng tương tác" },
    { icon: game, text: "Vừa học vừa chơi với các Minigames Toán học" },
    { icon: fight, text: "So tài Toán học với những người dùng khác trong Đấu trường" },
    { icon: history, text: "Biết điểm mạnh và điểm yếu của bản thân qua lịch sử học tập" },
    { icon: pvp, text: "Tăng sự gắn kết giữa phụ huynh và học sinh thông các trò chơi PvP" },
    { icon: reading, text: "Gợi ý chương trình học sát với lộ trình học thực tế trên trường" },
  ];

  return (
    <section ref={ref} className="min-h-[770px] py-20 w-full flex flex-row items-center overflow-hidden bg-[#FFFBF5]">
      <Image src={idea} alt="" height={380} width={380} className="-translate-x-17 rotate-12 hidden lg:block" />
      <div className="flex flex-col gap-5 h-full flex-1 px-10 lg:px-0">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className={clsx(baloo.className, 'text-amber-500 font-bold text-3xl')}
        >
          CÁC TÍNH NĂNG NỔI BẬT
        </motion.h1>
        <div className="flex flex-row flex-wrap gap-x-5 gap-y-5 w-full pr-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="w-full md:w-[49%]"
            >
              <FeatureCard icon={feature.icon} text={feature.text} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reviews Section Component with Animation
function ReviewsSection({ reviews }: { reviews: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 bg-white w-full flex flex-col items-center overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
        className={clsx(baloo.className, 'text-[#23BEAA] font-bold text-3xl mb-16')}
      >
        CẢM NHẬN CỦA PHỤ HUYNH
      </motion.h1>

      {/** Slider Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative w-full"
      >
        {/** Gradient Overlays for smooth fade-in/out */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        {/** Animated Track */}
        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
        >
          {[...reviews, ...reviews].map((review, idx) => (
            <div key={idx} className="w-[350px] md:w-[450px]">
              <ReviewCard
                name={review.name}
                role={review.role}
                content={review.content}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// Helper Components for cleaner code
function FeatureCard({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex flex-row gap-6 bg-white items-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] cursor-pointer rounded-2xl h-38 w-full px-10 hover:scale-[1.02] transition-transform">
      <Image src={icon} alt="" height={70} width={70} />
      <p className="font-medium text-lg leading-snug select-none">{text}</p>
    </div>
  )
}

function ReviewCard({ name, role, content }: { name: string, role: string, content: string }) {
  return (
    <div className="flex flex-col bg-[azure] p-8 rounded-[40px] relative shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute -top-5 left-10 w-10 h-10 rounded-full flex items-center justify-center text-[#23BEAA]">
        <FontAwesomeIcon icon={faQuoteLeft} className="h-30 w-30" />
      </div>
      <div className="flex gap-1 mb-4 text-amber-400">
        {[...Array(5)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} className="h-7 w-7" />)}
      </div>
      <p className={clsx(roboto.className, "text-gray-700 italic mb-6 text-lg leading-relaxed")}>"{content}"</p>
      <div className="mt-auto">
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-sm text-[#1DA492] font-medium">{role}</p>
      </div>
    </div>
  )
}