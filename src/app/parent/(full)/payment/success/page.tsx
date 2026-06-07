'use client'

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentSuccessModal from "@/components/PaymentSuccessModal/PaymentSuccessModal";
import treasureBg from '../../../../../../public/assets/payment/treasure.jpg';

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
        <div className="h-screen w-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(${treasureBg.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
            <Suspense fallback={<div className="text-white text-lg">Đang tải...</div>}>
                <PaymentSuccessContent />
            </Suspense>
        </div>
    );
};
