import { faCheck, faXmark, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Baloo_2 } from "next/font/google";
import clsx from "clsx";

const baloo2 = Baloo_2({
    subsets: ["latin"],
    weight: "700"
});

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
    status?: "success" | "failure" | "error";
}

const statusConfig = {
    success: { color: "text-yellow-300", icon: faCheck },
    failure: { color: "text-red-400", icon: faXmark },
    error: { color: "text-amber-400", icon: faExclamationTriangle }
};

const PaymentSuccessModal = ({
    isOpen,
    onClose,
    title = "Thanh toán thành công",
    message = "Giao dịch của bạn đã hoàn tất.",
    buttonText = "Trở về trang web",
    status = "success"
}: PaymentSuccessModalProps) => {
    if (!isOpen) return null;

    const currentConfig = statusConfig[status];

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2a113a] border border-yellow-400/50 rounded-xl max-w-sm w-full p-6 shadow-[0_10px_50px_rgba(42,17,58,0.8)] text-center relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-b from-yellow-300 to-yellow-600 p-1 rounded-full aspect-square h-fit shadow-lg">
                        <div className="bg-[#2a113a] h-fit rounded-full p-4 aspect-square">
                            <FontAwesomeIcon
                                className={clsx("size-12", currentConfig.color)}
                                icon={currentConfig.icon}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-2">
                        {title}
                    </h2>
                    <p className="text-purple-200 text-sm mb-6 leading-relaxed">{message}</p>
                    <button
                        onClick={onClose}
                        className={clsx("w-full bg-gradient-to-r cursor-pointer from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-purple-950 font-extrabold py-3 px-4 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-200", baloo2.className)}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;