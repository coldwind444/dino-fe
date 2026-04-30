"use client";

import clsx from "clsx";
import { baloo } from "@/app/fonts";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import feather from "../../../public/assets/home/feather.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type EntranceTestPopupProps = {
  close: () => void;
  start: () => void;
  lastname: string;
};

export default function EntranceTestPopup({
  close,
  start,
  lastname,
}: EntranceTestPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="h-screen w-screen bg-[rgba(0,0,0,0.5)] flex items-center justify-center absolute top-0 left-0 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 15 }}
          className="h-[50%] w-[50%] bg-white rounded-2xl flex flex-row gap-8 py-10 items-center relative shadow-2xl"
        >
          {/** Illustration */}
          <Image
            src={feather}
            height={500}
            width={500}
            alt=""
            priority={true}
            className="absolute -translate-x-1/3"
          />
          {/** Close button */}
          <div
            className="absolute aspect-square h-20 bg-amber-500 rounded-full top-0 right-0 translate-x-1/3 -translate-y-1/4
                                    hover:brightness-110 cursor-pointer flex items-center justify-center
                                    text-white text-3xl shadow-inner"
            onClick={close}
          >
            <FontAwesomeIcon icon={faClose} />
            <span
              className="absolute top-0 right-0 aspect-square h-3 w-6 rotate-45 mt-3 mr-2
                                        [clip-path:ellipse(50%_50%_at_50%_50%)] bg-[rgba(255,255,255,0.4)] rounded-full"
            ></span>
          </div>
          {/** Main */}
          <div className="flex flex-col w-3/4 h-full ml-auto mr-0 gap-10">
            <div className={clsx(baloo.className, "flex flex-col font-bold")}>
              <h1 className="text-amber-500 text-3xl">{`CHÀO ${lastname.toUpperCase()}`}</h1>
              <h2 className="text-[#23BEAA] text-xl">
                Bạn đã sẵn sàng làm bài kiểm tra đầu vào chưa ?
              </h2>
              <p className="text-[rgba(0,0,0,0.5)] text-[16px] text-justify text-wrap max-w-[85%] mt-7">
                Bài kiểm tra đầu vào của Dino Math được biên soạn nhằm mục đích
                kiểm tra năng lực của học sinh. Kết quả của bài kiểm tra này chỉ
                được dùng để đánh giá trình độ ban đầu của bạn, ngoài ra không
                dùng với bất kỳ mục đích nào khác. Vì thế, đừng quá căng thẳng
                nhé. Chúc bạn làm bài thật tốt !
              </p>
            </div>
            <div className="flex flex-row items-center gap-55 mt-auto mb-0">
              <div
                className={clsx(
                  "h-[50px] w-fit px-10 rounded-2xl border-2 border-[#FF5964] text-xl text-[#FF5964] font-bold",
                  "cursor-pointer hover:opacity-90 flex items-center justify-center z-10",
                  baloo.className,
                )}
                onClick={close}
              >
                Huỷ
              </div>

              <div
                className={clsx(
                  "h-[50px] w-fit px-10 rounded-2xl text-white bg-[#23BEAA] font-bold text-xl",
                  "cursor-pointer hover:opacity-90 flex items-center justify-center",
                  baloo.className,
                )}
                onClick={start}
              >
                Làm bài
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
