"use client";

import { faPaperPlane, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { baloo } from "@/app/fonts";
import { motion, AnimatePresence } from "framer-motion";

export const MODAL_TYPES = {
  SEND: {
    themeColor: "#3B84F2",
    message: "Bạn có chắc chắn muốn nộp bài không ?",
    icon: faPaperPlane,
  },
  WARNING: {
    themeColor: "#FF9600",
    message:
      "Bài làm hiện tại của bạn sẽ được lưu lại. \n Bạn có chắc chắn muốn thoát không ?",
    icon: faWarning,
  },
};

export type MODAL_TYPE_KEY = keyof typeof MODAL_TYPES;

export type PopupModalParams = {
  type: MODAL_TYPE_KEY;
  action: () => void;
  close: () => void;
  customMessage?: string;
};

export default function PopupModal({ type, action, close, customMessage }: PopupModalParams) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="h-screen w-screen bg-[rgba(0,0,0,0.5)] flex items-center justify-center absolute top-0 left-0 z-20"
      >
        <motion.div
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 15 }}
          className="h-[40%] w-1/3 bg-white rounded-2xl flex flex-col gap-8 p-7 items-center justify-center shadow-2xl"
          style={{ color: MODAL_TYPES[type].themeColor }}
        >
          <FontAwesomeIcon className="text-6xl" icon={MODAL_TYPES[type].icon} />

          <p
            className={clsx(
              "text-wrap text-center w-[85%] text-xl font-bold",
              baloo.className,
            )}
          >
            {customMessage || MODAL_TYPES[type].message}
          </p>

          <div className="w-full flex flex-row justify-around mt-auto mb-0">
            <div
              className={clsx(
                "h-[50px] w-fit px-10 rounded-2xl border-2 border-[#FF5964] text-xl text-[#FF5964] font-bold",
                "cursor-pointer hover:opacity-90 flex items-center justify-center",
                baloo.className,
              )}
              onClick={close}
            >
              Không
            </div>

            <div
              className={clsx(
                "h-[50px] w-fit px-10 rounded-2xl text-white bg-[#23BEAA] font-bold text-xl",
                "cursor-pointer hover:opacity-90 flex items-center justify-center",
                baloo.className,
              )}
              onClick={action}
            >
              Có
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
