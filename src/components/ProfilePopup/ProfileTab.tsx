"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { UserProfileResponse } from "@/types";
import Image from "next/image";
import clsx from "clsx";
import { getAllGrades, updateUserProfile, uploadAvatar } from "@/apis";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader/Loader";

export default function ProfileTab({ profileData }: { profileData: UserProfileResponse }) {
    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarContainerRef = useRef<HTMLDivElement>(null);

    // UI state
    const [loading, setLoading] = useState(false)

    // Data states
    // states for grade mapping
    const [gradeLevels, setGradeLevels] = useState<number[]>([])
    const [gradeIds, setGradeIds] = useState<string[]>([])

    // states for avatar management
    const [avatarType, setAvatarType] = useState<'system' | 'user'>('system')

    const [systemAvatars, setSystemAvatars] = useState<string[]>([]); // sys avt array
    const [currSysAvatarIndex, setCurrSysAvatarIndex] = useState(0); // for system avt

    const [avatarFile, setAvatarFile] = useState<File | undefined>() // media file for uploaded avt

    const [previewUrl, setPreviewUrl] = useState<string>(profileData.avatarUrl || ''); // preview avatar object url

    const originalFormData = {
        fullname: profileData.name,
        gradeId: profileData.gradeId,
        avatarUrl: profileData.avatarUrl,
        email: profileData.email,
    };

    const [formData, setFormData] = useState(originalFormData);

    // Computed values
    // Computed values
    const hasAvatarChanged = (() => {
        // Case 1: User Mode - Only changed if a NEW file is uploaded
        if (avatarType === 'user') {
            return !!avatarFile;
        }

        // Case 2: System Mode - Changed if selected URL != Original URL
        // We check systemAvatars.length to avoid initial undefined issues
        if (avatarType === 'system' && systemAvatars.length > 0) {
            return systemAvatars[currSysAvatarIndex] !== originalFormData.avatarUrl;
        }

        return false;
    })();

    // Combine form data check + avatar check
    const isFormDirty = JSON.stringify(formData) !== JSON.stringify(originalFormData) || hasAvatarChanged;

    // Map grade level <=> grade id
    const getGradeIdByLevel = (level: number) => {
        const idx = gradeLevels.indexOf(level)
        if (idx !== -1) return gradeIds[idx]
        return ''
    }

    const getGradeLevelById = (id: string) => {
        const idx = gradeIds.indexOf(id)
        if (idx !== -1) return gradeLevels[idx]
        return ''
    }

    // Functions
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Save selected file
        setAvatarFile(file)

        // Validate MIME type (safer than relying only on 'accept' attribute)
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file (PNG, JPG, etc.)");
            e.target.value = ""; // reset input so user can re-select same file
            return;
        }

        // Reset the input to allow re-selecting same file
        e.target.value = "";
    };

    function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    const handleUpdateProfile = async () => {
        try {
            setLoading(true)
            // Validate request
            let req: any = { ...formData };
            delete req.email
            if (profileData.role === 'parent') {
                delete req.gradeId
            }

            // Avatar upload
            let finalAvatarUrl = originalFormData.avatarUrl;
            if (avatarType === 'user' && avatarFile) {
                const base64Image = await fileToBase64(avatarFile);
                const res = await uploadAvatar(base64Image)
                finalAvatarUrl = res.avatarUrl
            } else if (avatarType === 'system') {
                finalAvatarUrl = systemAvatars[currSysAvatarIndex]
            }
            req.avatarUrl = finalAvatarUrl

            // Call API
            await updateUserProfile(req)
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Lỗi không xác định xảy ra.');
            }
        } finally {
            setLoading(false)
        }
    };

    // Effects
    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const res = await fetch("https://cdn.jsdelivr.net/gh/coldwind444/sample_data@main/sys_avatars.json");
                const avatars = await res.json();

                const idx = avatars.indexOf(profileData.avatarUrl)
                if (idx != -1) setCurrSysAvatarIndex(idx);
                else setAvatarType('user')

                setSystemAvatars(avatars);
            } catch (error) {
                console.error("Failed to fetch avatars:", error);
            }
        };

        const fetchAllGrades = async () => {
            try {
                const res = await getAllGrades()
                const levels = res.map(g => g.level)
                const ids = res.map(g => g._id)
                setGradeIds(ids)
                setGradeLevels(levels)
            } catch (err) {
                console.log('Failed to fetch grades.', err)
            }
        }

        fetchAllGrades()
        fetchAvatars();
    }, []);

    useEffect(() => {
        if (avatarType === 'system') {
            // CRITICAL CHECK: Only update if system avatars have actually loaded.
            // Otherwise, keep the initial state value.
            if (systemAvatars.length > 0 && systemAvatars[currSysAvatarIndex]) {
                setPreviewUrl(systemAvatars[currSysAvatarIndex]);
            }
        } else if (avatarType === 'user') {
            let url = '';
            if (avatarFile) {
                url = URL.createObjectURL(avatarFile);
                setPreviewUrl(url);
            } else {
                // Fallback: If in user mode but no file is selected yet, 
                // keep showing the original avatar.
                setPreviewUrl(profileData.avatarUrl);
            }
        }

        // Cleanup memory
        return () => {
            if (avatarType === 'user' && avatarFile) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [avatarType, currSysAvatarIndex, avatarFile, systemAvatars, profileData.avatarUrl]);
    // Added 'systemAvatars' to dependencies so it updates once the API loads

    useEffect(() => {
        if (!avatarContainerRef.current || currSysAvatarIndex === -1) return;

        const container = avatarContainerRef.current;
        const child = container.children[currSysAvatarIndex];
        if (!child) return;

        const containerRect = container.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        const containerCenter = containerRect.width / 2;
        const childCenter = childRect.left - containerRect.left + childRect.width / 2;
        const scrollAmount = childCenter - containerCenter;

        container.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    }, [currSysAvatarIndex]);

    return (
        <>
            <Toaster position="top-right" />
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>
            {/** Avatar section */}
            <div className="w-full mb-6">
                <h3 className="text-md font-semibold text-gray-800 pl-65">Ảnh đại diện</h3>
                <div className="flex items-start gap-8 pl-20">
                    <div className="flex-shrink-0">
                        <div className="relative w-40 h-40 rounded-full bg-[#E0F5F1] flex items-center justify-center overflow-hidden">
                            {previewUrl === '' && <label className="text-center text-gray-500 font-medium">Chưa có ảnh nào <br /> được tải lên.</label>}
                            {previewUrl && <Image
                                src={previewUrl}
                                alt="Chưa có ảnh nào được tải lên."
                                fill
                                className="w-full h-full object-cover"
                            />}
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        {/* System avatars */}
                        <div className="flex items-center gap-3">
                            <div
                                className={clsx(
                                    "h-[20px] w-[20px] border-2 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center",
                                    avatarType === 'system' ? "border-[#23BEAA]" : "border-gray-400"
                                )}
                                onClick={() => setAvatarType('system')}>
                                <div
                                    className={clsx(
                                        "h-[12px] w-[12px] bg-[#23BEAA] transition-all duration-150 rounded-full",
                                        avatarType === 'system' ? "opacity-100" : "opacity-0"
                                    )} />
                            </div>
                            <label
                                className={clsx(
                                    "text-sm font-medium cursor-pointer",
                                    avatarType === 'system' ? "text-[#23BEAA]" : "text-gray-400"
                                )}
                                onClick={() => setAvatarType('system')}>
                                Ảnh hệ thống
                            </label>
                            <div className="relative overflow-x-hidden overflow-y-visible w-[250px] h-[110px]">
                                <div
                                    ref={avatarContainerRef}
                                    className="flex gap-6 overflow-x-hidden scroll-smooth snap-x snap-mandatory px-6 py-6">
                                    {systemAvatars.map((avatar, idx) => (
                                        <div key={idx} className="relative flex-shrink-0 snap-center">
                                            {currSysAvatarIndex === idx && (
                                                <div
                                                    className={clsx(
                                                        "absolute -top-7 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] z-10",
                                                        avatarType === 'user' ? "border-t-[#D9D9D9]" : "border-t-[#1DA492]"
                                                    )}
                                                />
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (avatarType === 'system') {
                                                        setCurrSysAvatarIndex(idx);
                                                    }
                                                }}
                                                disabled={avatarType === 'user'}
                                                className={clsx(
                                                    "w-14 h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300",
                                                    avatarType === 'user' ? 'opacity-50 cursor-not-allowed ring-[#D9D9D9]' : 'opacity-80 hover:opacity-100 ring-[#1DA492] ',
                                                    currSysAvatarIndex === idx ? 'ring-4 scale-125' : '',
                                                )}>
                                                <img src={avatar} alt={`avatar ${idx + 1}`} className="w-full h-full rounded-full object-cover" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upload custom avatar */}
                        <div className="flex items-center gap-3">
                            <div
                                className={clsx(
                                    "h-[20px] w-[20px] border-2 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center",
                                    avatarType === 'user' ? "border-[#23BEAA]" : "border-gray-400"
                                )}
                                onClick={() => setAvatarType('user')}>
                                <div
                                    className={clsx(
                                        "h-[12px] w-[12px] bg-[#23BEAA] transition-all duration-150 rounded-full",
                                        avatarType === 'user' ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </div>
                            <label
                                className={clsx(
                                    "text-sm font-medium cursor-pointer",
                                    avatarType === 'user' ? "text-[#23BEAA]" : "text-gray-400"
                                )}
                                onClick={() => setAvatarType('user')}>
                                Ảnh của tôi
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={avatarType !== 'user'}
                                className={clsx(
                                    "px-6 py-2 rounded-full transition-colors text-sm ml-8 text-white font-medium cursor-pointer",
                                    avatarType !== 'user'
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#23BEAA] hover:bg-[#1DA492]"
                                )}>
                                Tải ảnh lên
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/** Form data section */}
            <div className="space-y-4 mb-6 max-w-lg ml-20">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.fullname}
                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                            className="w-full p-3 pl-5 pr-10 border font-medium border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none text-[#1ABC9C]"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                            <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <input
                                type="email" readOnly
                                value={formData.email}
                                className="w-full p-3 pl-5 pr-10 border border-gray-300 bg-gray-100 
                                        cursor-not-allowed rounded-lg font-medium text-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Khối lớp</label>
                        <div className="relative">
                            <select
                                value={getGradeLevelById(formData.gradeId)}
                                onChange={(e) => setFormData({ ...formData, gradeId: getGradeIdByLevel(Number(e.target.value)) })}
                                className="w-full p-3 pl-5 font-medium pr-10 border border-gray-300 rounded-lg focus:border-[#1ABC9C] focus:outline-none appearance-none text-[#1ABC9C]">
                                <option value={1}>Khối 1</option>
                                <option value={2}>Khối 2</option>
                                <option value={3}>Khối 3</option>
                                <option value={4}>Khối 4</option>
                                <option value={5}>Khối 5</option>
                            </select>
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/** Update button */}
            <button
                onClick={handleUpdateProfile}
                disabled={!isFormDirty || loading}
                className={clsx(
                    "max-w-lg ml-20 py-3 rounded-xl font-semibold text-base transition-colors w-full relative", // Ensure 'relative' is here
                    isFormDirty
                        ? "bg-[#1ABC9C] text-white hover:bg-[#16A085]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}>

                {/* Text Label */}
                <span>Cập nhật thông tin</span>

                {/* Loader Container */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    <Loader isLoading={loading} />
                </div>
            </button>
        </>
    );
}