'use client'

import Image from "next/image"

import dinoWizard from '../../../public/assets/onboarding/wizard.svg'
import MascotWriting, { POSES } from "@/components/MascotWriting/MascotWriting"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { Roboto } from "next/font/google"

const roboto = Roboto()

const MESSAGES = {
    ASK_NAME: 'Bạn tên là gì vậy? Mình muốn ghi vào danh sách những bạn siêu dễ thương hôm nay đó!',
    ASK_AVATAR: 'Chọn cho mình một ảnh đại diện thật đẹp để khoe với bạn bè nào ! Mình sẽ cho bạn xem trước lựa chọn của mình ở đây nhé !',
    ASK_CODE: 'Sắp xong rồi ! Bạn nhập mã mà phụ huynh cung cấp để tiến hành liên kết tài khoản nhé !'
}

const STEPS = {
    NAME: 0,
    AVATAR: 1,
    CODE: 2
}

const AVATAR_OPTIONS = {
    SYSTEM: 0,
    UPLOAD: 1
}

export default function OnboardingClient({ systemAvatars } : { systemAvatars: string[] }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isFirstRender = useRef(true)

    // UI states
    const [pose, setPose] = useState<keyof typeof POSES>("IDLE");
    const [message, setMessage] = useState(MESSAGES.ASK_NAME)
    const [step, setStep] = useState(STEPS.NAME)
    const [option, setOption] = useState(AVATAR_OPTIONS.SYSTEM)
    const [sysAvtIndex, setSystemAvtIndex] = useState(0)
    const [userSelectedAvt, setUserSelectedAvt] = useState('')

    // Request data state
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [previewAvt, setPreviewAvt] = useState('')

    const openFileDialog = () => {
        if (fileInputRef) fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate MIME type (safer than relying only on 'accept' attribute)
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file (PNG, JPG, etc.)");
            e.target.value = ""; // reset input so user can re-select same file
            return;
        }

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setUserSelectedAvt(objectUrl);
        setPreviewAvt(objectUrl)

        // Reset the input to allow re-selecting same file
        e.target.value = "";
    };

    const switchStepByBullet = (target: number) => {
        if (step > target) {
            setStep(target)
            return
        }

        if (target === STEPS.AVATAR) {
            if (name.length > 0) setStep(target);
            return
        }

        if (target === STEPS.CODE) {
            if (previewAvt.length > 0 && name.length > 0) setStep(target);
            return
        }
    }

    useEffect(() => {
        if (option === AVATAR_OPTIONS.SYSTEM)
            setPreviewAvt(systemAvatars[sysAvtIndex]);
        else setPreviewAvt(userSelectedAvt)
    }, [option])

    useEffect(() => {
        if (!containerRef.current) return;

        setPreviewAvt(systemAvatars[sysAvtIndex])

        const container = containerRef.current;
        const child = container.children[sysAvtIndex];
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
    }, [sysAvtIndex]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const messageMap = {
            [STEPS.NAME]: MESSAGES.ASK_NAME,
            [STEPS.AVATAR]: MESSAGES.ASK_AVATAR,
            [STEPS.CODE]: MESSAGES.ASK_CODE,
        };

        setMessage(messageMap[step]);
        setPose('WRITING');

        const talkingTimer = setTimeout(() => setPose('TALKING'), 1300);
        const idleTimer = setTimeout(() => setPose('IDLE'), 4300);

        return () => {
            clearTimeout(talkingTimer);
            clearTimeout(idleTimer);
        };
    }, [step]);

    return (
        <div className="flex flex-row w-screen h-screen">
            <div className="w-[55%] h-full">
                {/** Mascot area */}
                <div className="flex flex-row h-[250px] pl-[20px] pt-[20px] relative overflow-hidden">
                    <MascotWriting pose={pose} />
                    <div
                        className={clsx(
                            "h-fit w-fit p-[20px] rounded-[20px] border-2 border-[#F1A12E] text-[#F1A12E] font-medium text-[16px]",
                            "flex flex-row items-center justify-center gap-[20px] -ml-[100px]"
                        )}
                    >
                        <p className="text-wrap max-w-[400px]">{message}</p>

                        {step === STEPS.AVATAR && (
                            <div
                                className="relative h-[150px] w-[150px] flex-shrink-0 overflow-hidden rounded-full"
                            >
                                {previewAvt ? (
                                    <Image
                                        src={previewAvt}
                                        fill
                                        alt="Selected avatar preview"
                                        className="object-cover object-center"
                                    />
                                ) : (
                                    <p className="flex items-center justify-center h-full text-sm text-gray-600">
                                        No image selected
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                { /** Main container */}
                <div className="h-[450px] w-full overflow-hidden">
                    { /** Slider */}
                    <div className={clsx(
                        "h-full w-[300%] flex flex-row transition-all duration-1000",
                        {
                            '-translate-x-[calc(0.333*100%)]': step === STEPS.AVATAR,
                            '-translate-x-[calc(0.667*100%)]': step === STEPS.CODE
                        }
                    )}>
                        {/** Name section */}
                        <div className="flex flex-col gap-[30px] items-center h-full w-1/3 pl-[70px] pt-[8px]">
                            <h1 className={clsx(
                                "text-[27px] font-bold text-[#1DA492]",
                                roboto.className
                            )}>TÊN ĐẦY ĐỦ</h1>
                            <div className={clsx(
                                "h-[58px] w-[370px] border-2 border-[rgba(0,0,0,0.15)] rounded-[8px]",
                                'focus-within:border-[#23BEAA] transition-all duration-150'
                            )}>
                                <input className="h-full w-[90%] border-none outline-none pl-[20px] text-[20px]"
                                    placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <button disabled={name.length === 0}
                                className={clsx(
                                    "h-[60px] w-[370px] rounded-[10px] bg-[#1DA492] cursor-pointer hover:opacity-90",
                                    'disabled:opacity-60 disabled:cursor-not-allowed'
                                )} onClick={() => setStep(STEPS.AVATAR)}>
                                <div className={clsx(
                                    "h-full w-full bg-[#23BEAA] text-white font-medium text-[18px]",
                                    'rounded-bl-[50px] rounded-tr-[50px] rounded-tl-[10px] rounded-br-[10px]',
                                    'flex items-center justify-center'
                                )}>
                                    Tiếp tục
                                </div>
                            </button>
                        </div>
                        {/** Avatar section */}
                        <div className="flex flex-col gap-[50px] h-full w-1/3 pl-[100px]">
                            {/** Option 1 */}
                            <div className="flex flex-row gap-[30px] items-center">
                                {/** Customized radio box */}
                                <div className="block">
                                    <div className={clsx(
                                        "h-[20px] aspect-square border-2 rounded-full transition-all duration-150 cursor-pointer",
                                        'flex items-center justify-center',
                                        option === AVATAR_OPTIONS.SYSTEM ? 'border-[#23BEAA]' : 'border-[rgba(0,0,0,0.7)]'
                                    )} onClick={() => setOption(AVATAR_OPTIONS.SYSTEM)}>
                                        <div className={clsx(
                                            'h-[12px] aspect-square bg-[#23BEAA] transition-all duration-150 rounded-full',
                                            option === AVATAR_OPTIONS.SYSTEM ? 'opacity-100' : 'opacity-0'
                                        )}></div>
                                    </div>
                                </div>
                                <label className={clsx(
                                    'font-medium text-[20px] min-w-[150px]',
                                    roboto.className,
                                    option === AVATAR_OPTIONS.SYSTEM ? 'text-[#23BEAA]' : 'text-[rgba(0,0,0,0.7)]'
                                )}>
                                    Ảnh hệ thống:
                                </label>
                                <div className="relative w-full overflow-hidden">
                                    <div
                                        ref={containerRef}
                                        className={clsx(
                                            "flex flex-row items-center gap-[20px] px-[10px] py-[10px]",
                                            'overflow-x-hidden scroll-smooth snap-x snap-mandatory h-[130px] w-[450px]',
                                            'pl-[20px] pr-[20px]'
                                        )}
                                        style={{ scrollSnapType: "x mandatory" }}
                                    >
                                        {systemAvatars.map((avt, idx) => (
                                            <button
                                                disabled={option !== AVATAR_OPTIONS.SYSTEM}
                                                key={idx}
                                                type="button"
                                                onClick={() => setSystemAvtIndex(idx)}
                                                className={clsx(
                                                    "relative flex-shrink-0 rounded-full overflow-hidden transition-all duration-300 snap-center cursor-pointer",
                                                    sysAvtIndex === idx
                                                        ? "ring-4 ring-[#1DA492] scale-120"
                                                        : "opacity-80 hover:opacity-100"
                                                )}
                                            >
                                                <Image
                                                    src={avt}
                                                    alt="system avatar"
                                                    width={70}
                                                    height={70}
                                                    className="rounded-full object-cover"
                                                    unoptimized
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/** Option 2 */}
                            <div className="flex flex-row gap-[30px] items-center">
                                {/** Customized radio box */}
                                <div className="block">
                                    <div className={clsx(
                                        "h-[20px] aspect-square border-2 rounded-full transition-all duration-150 cursor-pointer",
                                        'flex items-center justify-center',
                                        option === AVATAR_OPTIONS.UPLOAD ? 'border-[#23BEAA]' : 'border-[rgba(0,0,0,0.7)]'
                                    )} onClick={() => setOption(AVATAR_OPTIONS.UPLOAD)}>
                                        <div className={clsx(
                                            'h-[12px] aspect-square bg-[#23BEAA] transition-all duration-150 rounded-full',
                                            option === AVATAR_OPTIONS.UPLOAD ? 'opacity-100' : 'opacity-0'
                                        )}></div>
                                    </div>
                                </div>
                                <label className={clsx(
                                    'font-medium text-[20px]',
                                    roboto.className,
                                    option === AVATAR_OPTIONS.UPLOAD ? 'text-[#23BEAA]' : 'text-[rgba(0,0,0,0.7)]'
                                )}>
                                    Ảnh tự chọn:
                                </label>
                                <button disabled={option === AVATAR_OPTIONS.SYSTEM}
                                    className={clsx(
                                        "h-[45px] w-[160px] bg-[#8A2BE2] rounded-[10px] ml-[50px]",
                                        'flex items-center justify-center text-white font-medium text-[16px]',
                                        'disabled:bg-gray-400 disabled:cursor-not-allowed',
                                        'hover:opacity-90 cursor-pointer'
                                    )} onClick={() => openFileDialog()}>
                                    Tải ảnh lên
                                </button>
                                <input onChange={handleFileChange} ref={fileInputRef}
                                    type="file" className="hidden"
                                    accept=".png,.jpg,.jpeg,.webp,.bmp,.svg,.ico,.tiff,.avif" />
                            </div>
                            <button disabled={previewAvt.length === 0}
                                className={clsx(
                                    "h-[60px] w-[370px] rounded-[10px] bg-[#1DA492] cursor-pointer hover:opacity-90",
                                    'disabled:opacity-60 disabled:cursor-not-allowed ml-auto mr-auto'
                                )} onClick={() => setStep(STEPS.CODE)}>
                                <div className={clsx(
                                    "h-full w-full bg-[#23BEAA] text-white font-medium text-[18px]",
                                    'rounded-bl-[50px] rounded-tr-[50px] rounded-tl-[10px] rounded-br-[10px]',
                                    'flex items-center justify-center'
                                )}>
                                    Tiếp tục
                                </div>
                            </button>
                        </div>
                        {/** Code section */}
                        <div className="flex flex-col gap-[30px] items-center h-full w-1/3 pl-[70px] pt-[8px]">
                            <h1 className={clsx(
                                "text-[27px] font-bold text-[#1DA492]",
                                roboto.className
                            )}>MÃ LIÊN KẾT TÀI KHOẢN</h1>
                            <div className={clsx(
                                "h-[58px] w-[370px] border-2 border-[rgba(0,0,0,0.15)] rounded-[8px]",
                                'focus-within:border-[#23BEAA] transition-all duration-150'
                            )}>
                                <input className="h-full w-[90%] border-none outline-none pl-[20px] text-[20px]"
                                    placeholder="Mã liên kết" value={code} onChange={e => setCode(e.target.value)} />
                            </div>
                            <button disabled={name.length === 0 || previewAvt.length === 0 || code.length === 0}
                                className={clsx(
                                    "h-[60px] w-[370px] rounded-[10px] bg-[#1DA492] cursor-pointer hover:opacity-90",
                                    'disabled:opacity-60 disabled:cursor-not-allowed'
                                )}>
                                <div className={clsx(
                                    "h-full w-full bg-[#23BEAA] text-white font-medium text-[18px]",
                                    'rounded-bl-[50px] rounded-tr-[50px] rounded-tl-[10px] rounded-br-[10px]',
                                    'flex items-center justify-center'
                                )}>
                                    Hoàn thành
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                {/** Step bullets */}
                <div className="flex flex-row gap-[5px] items-center justify-center w-[108%]">
                    <div className={clsx(
                        'h-[10px] w-[50px] rounded-full',
                        step >= STEPS.NAME ? 'bg-[#23BEAA]' : 'bg-[#d9d9d9]',
                        'transition-all duration-200 cursor-pointer'
                    )} onClick={() => switchStepByBullet(STEPS.NAME)}></div>
                    <div className={clsx(
                        'h-[10px] w-[50px] rounded-full',
                        step >= STEPS.AVATAR ? 'bg-[#23BEAA]' : 'bg-[#d9d9d9]',
                        'transition-all duration-200 cursor-pointer'
                    )} onClick={() => switchStepByBullet(STEPS.AVATAR)}></div>
                    <div className={clsx(
                        'h-[10px] w-[50px] rounded-full',
                        step === STEPS.CODE ? 'bg-[#23BEAA]' : 'bg-[#d9d9d9]',
                        'transition-all duration-200 cursor-pointer'
                    )} onClick={() => switchStepByBullet(STEPS.CODE)}></div>
                </div>
            </div>
            { /** Dino Wizard SVG */}
            <div className="w-[45%] h-full">
                <Image className="ml-auto mb-[2px] mr-[60px]" src={dinoWizard} alt="" height={780} />
            </div>
        </div>
    )
}