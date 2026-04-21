"use client";

import { useState } from "react";
import { faCheck, faCrown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const premiumFeatures = [
  "Không giới hạn chủ đề học tập",
  "Không giới hạn Minigames",
];

const freeFeatures = [
  "Tính năng cơ bản",
  "Giới hạn chủ đề học tập",
  "Giới hạn Minigames",
];

type PaymentSession = {
  orderCode: string;
  amountLabel: string;
  expiresIn: string;
};

function PaymentImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-sm font-medium text-gray-400 ${className ?? ""}`}
    >
      <span className="max-w-[80%] leading-snug">{label}</span>
    </div>
  );
}

export default function UpgradeTab() {
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(
    null,
  );

  const startPayment = () => {
    const generatedOrderCode = `WH${Date.now().toString().slice(-10)}`;

    setPaymentSession({
      orderCode: generatedOrderCode,
      amountLabel: "599,000 VND",
      expiresIn: "14:30",
    });
  };

  const cancelPayment = () => {
    setPaymentSession(null);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Nâng cấp</h2>

      {paymentSession ? (
        <div className="mt-4 w-full max-w-5xl">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="text-[24px] font-medium text-gray-500">
              Thanh toán qua VNPAY - QR Code
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
            <div className="flex items-start gap-6">
              <div className="w-[220px] shrink-0">
                <PaymentImagePlaceholder
                  label="Vùng ảnh QR / mã thanh toán"
                  className="h-[220px] w-[220px]"
                />
              </div>

              <div className="flex flex-1 flex-col pt-1">
                <h3 className="max-w-xl text-[21px] font-bold leading-tight text-[#23BEAA]">
                  NÂNG CẤP TÀI KHOẢN PREMIUM - DINO MATH
                </h3>

                <div className="mt-6 space-y-4 text-[16px] text-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="min-w-28 font-semibold">Mã đơn hàng:</span>
                    <span className="font-semibold">
                      {paymentSession.orderCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-28 font-semibold">Số tiền:</span>
                    <span className="font-semibold">
                      {paymentSession.amountLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-28 font-semibold">Trạng thái:</span>
                    <span className="font-medium text-[#F59E0B]">
                      Chờ thanh toán
                    </span>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="text-[#F59E0B] animate-spin"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-28 font-semibold">Hết hạn sau:</span>
                    <span className="font-medium italic text-[#FF5964]">
                      {paymentSession.expiresIn}
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
              Hủy thanh toán
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
                599,000đ
              </div>

              <div className="space-y-3 text-gray-600">
                {premiumFeatures.map((feature) => (
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
                className="mt-auto w-full rounded-xl bg-gradient-to-r from-[#23BEAA] to-[#3B84F2] py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
