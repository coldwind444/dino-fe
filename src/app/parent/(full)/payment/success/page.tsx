'use client'

import { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentSuccessModal from "@/components/PaymentSuccessModal/PaymentSuccessModal";
import treasureBg from '../../../../../../public/assets/payment/treasure.webp';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const responseCode = searchParams.get("vnp_ResponseCode");
    const isSuccess = responseCode === "00";

    return (
        <PaymentSuccessModal
            isOpen={true}
            onClose={() => router.push("/parent/dashboard")}
            status={isSuccess ? "success" : "failure"}
            title={isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
            message={isSuccess ? "Giao dịch của bạn đã hoàn tất." : "Giao dịch của bạn không thành công hoặc đã bị hủy."}
        />
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="relative h-screen w-screen flex items-center justify-center">
            <Image
                src={treasureBg}
                alt="Treasure Background"
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                }}
            />
            <div className="relative z-10">
                <Suspense fallback={<div className="text-white text-lg">Đang tải...</div>}>
                    <PaymentSuccessContent />
                </Suspense>
            </div>
        </div>
    );
};
