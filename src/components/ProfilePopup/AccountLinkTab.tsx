"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export default function AccountLinkTab() {
    const [linkCode, setLinkCode] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hasLinkedParent, setHasLinkedParent] = useState(true);

    return (
        <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Liên kết tài khoản</h2>

            <div className="mb-6">
                <h3 className="text-base font-medium text-gray-500 mb-4">Liên kết với tài khoản phụ huynh</h3>
                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={linkCode}
                        onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        placeholder="Nhập mã liên kết"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                        disabled={linkCode.length < 6}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${linkCode.length >= 6
                                ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Gửi yêu cầu
                    </button>
                </div>

                {!hasLinkedParent && (
                    <div className="p-8 flex flex-col items-center justify-center mb-4">
                        <div className="w-60 h-60 mb-4 opacity-50 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-8xl">🔗</span>
                        </div>
                        <p className="text-gray-400 font-medium text-center">Tài khoản của bạn chưa được liên kết</p>
                    </div>
                )}

                {hasLinkedParent && (
                    <>
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">Tài khoản phụ huynh được liên kết</h4>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-[#C5EDE5] flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-lg text-gray-800">Nguyễn Văn H</h5>
                                        <p className="text-sm text-gray-500">vanh@gmail.com</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Mã liên kết tài khoản</p>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm">
                                                7HS90F
                                            </div>
                                            <button className="text-[#1ABC9C] hover:text-[#16A085] cursor-pointer">
                                                <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-medium text-gray-500 mb-4">Các thành viên khác trong gia đình</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {["Nguyễn Văn A", "Nguyễn Văn B"].map((name, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-[#C5EDE5] flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl">👤</span>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-base text-gray-800">{name}</h5>
                                                <p className="text-sm text-gray-500">
                                                    {name.toLowerCase().replace(/\s+/g, "")}@gmail.com
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}