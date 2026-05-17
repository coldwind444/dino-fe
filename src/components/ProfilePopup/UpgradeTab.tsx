"use client";

import { useEffect, useState } from "react";
import {
  faCheck,
  faCrown,
  faSpinner,
  faGem,
  faBookOpen,
  faGamepad,
  faUsers,
  faRobot,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { getPackages, purchasePremium } from "@/apis/payment";
import {
  PackageResponse,
  TransactionResponse,
  UserProfileResponse,
} from "@/types";
import { APIError } from "@/apis/config";

const freeFeatures = [
  "Tính năng cơ bản",
  "Giới hạn chủ đề học tập",
  "Giới hạn Minigames",
];

export default function UpgradeTab({
  profile,
}: {
  profile: UserProfileResponse;
}) {
  const [plan, setPlan] = useState<PackageResponse>();
  const [transaction, setTransaction] = useState<TransactionResponse>();
  const [creatingOrder, setCreatingOrder] = useState(false);

  const startPayment = async () => {
    try {
      setCreatingOrder(true);
      const res = await purchasePremium({
        packageId: plan?._id as string,
        paymentMethod: "vnpay",
      });
      if (res.paymentUrl) {
        setTransaction(res);
        window.open(res.paymentUrl, "_blank");
      }
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message);
      }
    } finally {
      setCreatingOrder(false);
    }
  };

  const cancelPayment = () => {
    setTransaction(undefined);
  };

  // Effects
  useEffect(() => {
    let ignore = false;

    const fetchPackages = async () => {
      try {
        const res = await getPackages();
        if (!ignore && res.length > 0) setPlan(res[0]);
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message);
        }
      }
    };
    fetchPackages();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Nâng cấp</h2>

      {profile?.premium?.isPremium ? (
        <div className="flex flex-col items-center justify-center pt-6 pb-10 w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 mt-4 px-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
            <FontAwesomeIcon
              icon={faGem}
              className="relative text-[#FF9F1C] text-[60px] drop-shadow-md"
            />
          </div>

          <h3 className="text-2xl font-bold text-[#FF9F1C] mb-3 text-center">
            Tài khoản của bạn đã được nâng cấp !
          </h3>
          <p className="text-gray-500 text-center max-w-lg mb-8 leading-relaxed">
            Tài khoản của bạn và các học sinh trong Gia đình đang sử dụng dịch
            vụ từ Gói Cao cấp của Dino Math.
          </p>

          <div className="w-full relative max-w-3xl mb-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[15px] font-semibold text-[#FF9F1C]">
                Phúc lợi
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
            {plan?.features?.map((featureText, idx) => {
              const styles = [
                { icon: faBookOpen, color: "text-blue-500", bg: "bg-blue-50" },
                {
                  icon: faGamepad,
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                },
                { icon: faUsers, color: "text-pink-500", bg: "bg-pink-50" },
                { icon: faRobot, color: "text-teal-500", bg: "bg-teal-50" },
                {
                  icon: faChartLine,
                  color: "text-indigo-500",
                  bg: "bg-indigo-50",
                },
              ];
              const style = styles[idx % styles.length];

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-5 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${style.bg} flex items-center justify-center mb-4`}
                  >
                    <FontAwesomeIcon
                      icon={style.icon}
                      className={`w-6 h-6 ${style.color}`}
                    />
                  </div>
                  <p className="text-gray-700 font-medium text-sm leading-snug">
                    {featureText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : transaction ? (
        <div className="mt-4 w-full max-w-5xl">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="text-[24px] font-medium text-gray-500">
              Đang chờ thanh toán qua VNPAY
            </div>
            <div className="flex h-14 w-44 items-center justify-center rounded-xl bg-white">
              <Image
                src="/assets/auth/vnpay-logo.svg"
                alt="VNPAY"
                width={176}
                height={54}
                className="h-auto w-auto max-h-full max-w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center pt-1">
                <h3 className="max-w-xl text-[21px] font-bold leading-tight text-[#23BEAA] text-center mb-6">
                  NÂNG CẤP TÀI KHOẢN PREMIUM - DINO MATH
                </h3>

                <div className="space-y-4 text-[16px] text-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="min-w-32 font-semibold">
                      Mã giao dịch:
                    </span>
                    <span className="font-semibold">
                      {transaction.transactionId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-32 font-semibold">Số tiền:</span>
                    <span className="font-semibold text-[#FF5964]">
                      {transaction.amount.toLocaleString("vi-VN", {
                        currency: "VND",
                      })}{" "}
                      đ
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-32 font-semibold">Trạng thái:</span>
                    <span className="font-medium text-[#F59E0B]">
                      Chờ thanh toán
                    </span>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="text-[#F59E0B] animate-spin"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <span className="font-medium italic text-gray-500 text-center w-full">
                      Vui lòng hoàn tất thanh toán ở tab mới (VNPAY).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={cancelPayment}
              className="min-w-52 rounded-2xl border border-[#FF5964] px-8 py-3 text-base font-medium text-[#FF5964] hover:bg-red-50"
            >
              Hủy / Chọn phương thức khác
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 w-full max-w-5xl rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#23BEAA] to-[#3B84F2] px-6 py-8 text-white">
            <h3 className="text-2xl font-bold">Chọn gói nâng cấp</h3>
            <p className="mt-1 text-sm text-white/80">
              Lựa chọn gói nâng cấp mà bạn cần
            </p>
          </div>

          <div className="grid grid-cols-2 items-stretch">
            <div className="flex min-h-[330px] flex-col border-r border-gray-200 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-2xl font-bold text-gray-800">
                  Gói Miễn phí
                </h4>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  Hiện tại
                </span>
              </div>

              <div className="mb-5 text-4xl font-bold text-gray-800">0đ</div>

              <div className="space-y-3 text-gray-600">
                {freeFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-[#22C55E] w-3.5 h-3.5"
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled
                className="mt-auto w-full rounded-xl bg-gray-200 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
              >
                Gói hiện tại
              </button>
            </div>

            <div className="flex min-h-[330px] flex-col bg-gradient-to-br from-white to-[#F3EEFF] px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-2xl font-bold text-gray-800">
                  Gói Cao cấp
                </h4>
                <FontAwesomeIcon
                  icon={faCrown}
                  className="text-[#EAB308] w-4 h-4"
                />
              </div>

              <div className="mb-5 text-4xl font-bold text-gray-800">
                {plan?.price.toLocaleString("vi-VN", { currency: "VND" })}
              </div>

              <div className="space-y-3 text-gray-600">
                {plan?.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-[#22C55E] w-3.5 h-3.5"
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={startPayment}
                disabled={creatingOrder}
                className="bg-gradient-to-r from-[#23BEAA] to-[#3B84F2] py-3 text-sm 
                           hover:opacity-90
                           disabled:opacity-50 disabled:cursor-not-allowed
                           font-semibold text-white mt-auto w-full rounded-xl
                           cursor-pointer"
              >
                {creatingOrder ? "Đang tạo giao dịch mới ..." : "Nâng cấp ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
