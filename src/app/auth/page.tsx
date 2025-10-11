'use client'

import { faArrowLeft, faNewspaper, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Roboto, Fredoka } from "next/font/google";
import { useEffect, useState } from "react";
import Image from "next/image";

import mascot from '../../../public/assets/auth/dino_3d.svg'
import student from '../../../public/assets/auth/student.png'
import parents from '../../../public/assets/auth/parents.png'
import leftHand from '../../../public/assets/auth/left.svg'
import rightHand from '../../../public/assets/auth/right.svg'
import logo from '../../../public/assets/logo.svg'

import RoundedTextBox from "@/components/RoundedTextBox/RoundedTextBox";
import RoundedPasswordBox from "@/components/RoundedPasswordBox/RoundedPasswordBox";
import Link from "next/link";

const roboto = Roboto()
const fredoka = Fredoka()

const ROLES = {
    STUDENT: 0,
    PARENT: 1
}

const TABS = {
    LOG_IN: 0,
    SIGN_UP: 1
}

const AUTHSTEPS = {
    SELECT_ROLE: 0,
    LOG_IN: 1,
    PERSONAL_INFO: 2,
    SIGN_UP: 3
}

export default function Auth() {
    // UI states
    const [tabIndex, setTabIndex] = useState(TABS.LOG_IN)
    const [loginStep, setLoginStep] = useState(AUTHSTEPS.SELECT_ROLE)
    const [registerStep, setRegisterStep] = useState(AUTHSTEPS.SELECT_ROLE)

    const [role, setRole] = useState<number | null>(null)

    // login request states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordShow, setPasswordShow] = useState(false)

    // register request states
    const [email2, setEmail2] = useState('')
    const [password2, setPassword2] = useState('')
    const [confPassword, setConfPassword] = useState('')

    const onStateChange = (state: boolean) => {
        setPasswordShow(state)
    }

    useEffect(() => {
        setLoginStep(AUTHSTEPS.SELECT_ROLE)
        setRegisterStep(AUTHSTEPS.SELECT_ROLE)
    }, [tabIndex])

    return (
        <div className="w-screen h-screen bg-[#F6F6F6] flex items-center justify-center">
            { /** Container card */}
            <div className={clsx(
                "flex flex-row h-[90%] w-[95%] bg-white rounded-[70px]",
                'shadow-[0_0_20px_rgba(0,0,0,0.2)]'
            )}>
                { /** Sidebar */}
                <div className={clsx(
                    'h-[100%] w-1/6 bg-[#23BEAA] rounded-tl-[70px] rounded-bl-[70px]',
                    'flex flex-col pt-[20px] relative'
                )}>
                    {/** Back link */}
                    <Link href='/' className={clsx(
                        'flex flex-row items-center justify-center gap-[20px] text-white',
                        'cursor-pointer hover:gap-[40px] transition-all duration-200'
                    )}>
                        <FontAwesomeIcon className="h-[15px] w-[15px]" icon={faArrowLeft} />
                        <label className={clsx("select-none font-medium text-[16px] cursor-pointer", roboto.className)}>Về trang chủ</label>
                    </Link>
                    { /** Tabs container*/}
                    <div className={clsx(
                        'flex flex-col mt-[100%] mb-auto'
                    )}>
                        {/** Log in tab */}
                        <div className={clsx(
                            'flex flex-row gap-[30px] items-center text-white h-[50px] cursor-pointer',
                            'transition-all duration-200',
                            { 'bg-[#1DA492]': tabIndex === TABS.LOG_IN }
                        )} onClick={() => setTabIndex(0)}>
                            <div className={clsx(
                                'bg-white h-full w-[8px] transition-all duration-200',
                                tabIndex === TABS.LOG_IN ? 'opacity-100' : 'opacity-0'
                            )} />
                            <FontAwesomeIcon icon={faUnlock} className="h-[20px] w-[20px]" />
                            <label className={clsx(roboto.className, 'text-[18px] font-medium cursor-pointer')}>Đăng nhập</label>
                        </div>
                        {/** Sign up tab */}
                        <div className={clsx(
                            'flex flex-row gap-[30px] items-center text-white h-[50px] cursor-pointer',
                            'transition-all duration-200',
                            { 'bg-[#1DA492]': tabIndex === TABS.SIGN_UP }
                        )} onClick={() => setTabIndex(1)}>
                            <div className={clsx(
                                'bg-white h-full w-[8px] transition-all duration-200',
                                tabIndex === TABS.SIGN_UP ? 'opacity-100' : 'opacity-0'
                            )} />
                            <FontAwesomeIcon icon={faNewspaper} className="h-[20px] w-[20px]" />
                            <label className={clsx(roboto.className, 'text-[18px] font-medium cursor-pointer')}>Đăng ký</label>
                        </div>
                    </div>
                    {/** Dinosaur spots */}
                    <div className="absolute bottom-0 right-0 -translate-y-[50px] mr-[30px] rotate-180">
                        <div className="h-[14px] aspect-square bg-[#1DA492] rounded-full absolute" />
                        <div className="h-[14px] aspect-square bg-[#1DA492] rounded-full absolute translate-x-[20px]" />
                        <div className="h-[14px] aspect-square bg-[#1DA492] rounded-full absolute translate-x-[10px] -translate-y-[20px]" />
                    </div>
                </div>

                {/** Main area */}
                <div className="flex flex-1">
                    { /** Auth container */}
                    <div className="h-full w-1/2 flex flex-col">
                        {tabIndex === TABS.LOG_IN ? (
                            <div className="h-full w-full overflow-hidden">
                                { /** Login slider */}
                                <div className={clsx(
                                    "flex flex-row h-full w-[200%] transition-all duration-200",
                                    { 'translate-x-[-50%]': loginStep === AUTHSTEPS.LOG_IN }
                                )}>
                                    {/** Select role step container */}
                                    <div className="flex items-center justify-center gap-[40px] flex-col h-full w-1/2 bg-white">
                                        <h1 className={clsx(
                                            "text-[25px] text-[#1DA492] font-bold", roboto.className
                                        )}>
                                            Đăng nhập với vai trò:
                                        </h1>
                                        <div className={clsx(
                                            "flex flex-row items-center pl-[20px] gap-[100px] h-[120px] w-[450px] rounded-[20px] border-3 cursor-pointer border-[rgba(0,0,0,0.2)]",
                                            'group text-[rgba(0,0,0,0.7)] hover:border-[#23BEAA] hover:text-[#23BEAA] transition-all duration-200'
                                        )} onClick={() => { setRole(ROLES.STUDENT); setLoginStep(AUTHSTEPS.LOG_IN) }}>
                                            <Image className="group-hover:scale-150 transition-all duration-200" src={student} height={100} alt="" />
                                            <label className={clsx('text-[25px] font-bold select-none cursor-pointer', roboto.className)}>Học sinh</label>
                                        </div>
                                        <div className={clsx(
                                            "flex flex-row items-center pl-[20px] gap-[100px] h-[120px] w-[450px] rounded-[20px] border-3 cursor-pointer border-[rgba(0,0,0,0.2)]",
                                            'group text-[rgba(0,0,0,0.7)] hover:border-[#23BEAA] hover:text-[#23BEAA] transition-all duration-200'
                                        )} onClick={() => { setRole(ROLES.PARENT); setLoginStep(AUTHSTEPS.LOG_IN) }}>
                                            <Image className="group-hover:scale-150 transition-all duration-200" src={parents} height={100} alt="" />
                                            <label className={clsx('text-[25px] font-bold select-none cursor-pointer', roboto.className)}>Phụ huynh</label>
                                        </div>
                                    </div>
                                    {/** Log in step container */}
                                    <div className="flex items-center justify-center gap-[20px] flex-col h-full w-1/2 bg-white">
                                        <div className="relative aspect-square h-[180px] border-2 border-[#1DA492] rounded-full overflow-hidden">
                                            <iframe src="https://cdn.lottielab.com/l/2HPdkE6AbKUhHe.html" height={380}
                                                className="-translate-x-[12px] translate-y-[20px] z-0" />
                                            <Image src={leftHand} alt='' height={60}
                                                className={clsx(
                                                    "absolute -translate-y-[290px] transition-all duration-400",
                                                    { 'translate-x-[100px]': !passwordShow, 'translate-x-[200px]': passwordShow}
                                                )} />
                                            <Image src={rightHand} alt='' height={60}
                                                className={clsx(
                                                    "absolute -translate-y-[290px] transition-all duration-400",
                                                    { '-translate-x-[100px]': passwordShow }
                                                )} />
                                        </div>
                                        <h1 className={clsx(roboto.className, 'text-[27px] font-bold text-[#1DA492]')}>Đăng nhập</h1>
                                        <div className="flex flex-col gap-[10px]">
                                            <RoundedTextBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                placeholder="Email" width="330" />
                                            <RoundedPasswordBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                onStateChange={onStateChange}
                                                placeholder="Password" width="330" />
                                        </div>
                                        <Link className={clsx(
                                            "font-medium cursor-pointer hover:text-[#1DA492] hover:underline",
                                            'mr-[150px]'
                                        )} href=''>Quên mật khẩu ?</Link>
                                        <button disabled={email.length === 0 || password.length === 0} className={clsx(
                                            'h-[50px] rounded-full w-[330px] bg-[#23BEAA] text-white font-medium',
                                            'disabled:bg-gray-300 cursor-not-allowed',
                                            { 'cursor-pointer hover:opacity-90': email.length > 0 && password.length > 0 },
                                        )}>Đăng nhập</button>
                                        <div className={clsx(
                                            "flex flex-col gap-[5px] items-center justify-center",
                                            'cursor-pointer group hover:text-[#23BEAA]'
                                        )} onClick={() => setLoginStep(AUTHSTEPS.SELECT_ROLE)}>
                                            <div className={clsx(
                                                "aspect-square h-[80px] flex items-center justify-center",
                                                'rounded-[20px] border-2 border-[rgba(0,0,0,0.2)]',
                                            )}>
                                                <FontAwesomeIcon className="group-hover:scale-150 transition-all duration-200" icon={faArrowLeft} />
                                            </div>
                                            <label className="font-medium cursor-pointer select-none">Quay lại</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full w-full overflow-hidden">
                                { /** Sign up slider */}
                                <div className={clsx(
                                    "flex flex-row h-full w-[200%] transition-all duration-200",
                                    { 'translate-x-[-50%]': registerStep === AUTHSTEPS.SIGN_UP }
                                )}>
                                    {/** Select role step container */}
                                    <div className="flex items-center justify-center gap-[40px] flex-col h-full w-1/2 bg-white">
                                        <h1 className={clsx(
                                            "text-[25px] text-[#1DA492] font-bold", roboto.className
                                        )}>
                                            Tạo tài khoản với vai trò:
                                        </h1>
                                        <div className={clsx(
                                            "flex flex-row items-center pl-[20px] gap-[100px] h-[120px] w-[450px] rounded-[20px] border-3 cursor-pointer border-[rgba(0,0,0,0.2)]",
                                            'group text-[rgba(0,0,0,0.7)] hover:border-[#23BEAA] hover:text-[#23BEAA] transition-all duration-200'
                                        )} onClick={() => { setRole(ROLES.STUDENT); setRegisterStep(AUTHSTEPS.SIGN_UP) }}>
                                            <Image className="group-hover:scale-150 transition-all duration-200" src={student} height={100} alt="" />
                                            <label className={clsx('text-[25px] font-bold select-none cursor-pointer', roboto.className)}>Học sinh</label>
                                        </div>
                                        <div className={clsx(
                                            "flex flex-row items-center pl-[20px] gap-[100px] h-[120px] w-[450px] rounded-[20px] border-3 cursor-pointer border-[rgba(0,0,0,0.2)]",
                                            'group text-[rgba(0,0,0,0.7)] hover:border-[#23BEAA] hover:text-[#23BEAA] transition-all duration-200'
                                        )} onClick={() => { setRole(ROLES.PARENT); setRegisterStep(AUTHSTEPS.SIGN_UP) }}>
                                            <Image className="group-hover:scale-150 transition-all duration-200" src={parents} height={100} alt="" />
                                            <label className={clsx('text-[25px] font-bold select-none cursor-pointer', roboto.className)}>Phụ huynh</label>
                                        </div>
                                    </div>
                                    {/** Sign up step container */}
                                    <div className="flex items-center justify-center gap-[40px] flex-col h-full w-1/2 bg-white">
                                        <div className="flex flex-col gap-[2px] items-center justify-center">
                                            <Image src={logo} height={80} width={80} alt="" />
                                            <h1 className={clsx(roboto.className, 'text-[27px] font-bold text-[#1DA492]')}>Đăng ký</h1>
                                            <p className={clsx(roboto.className, 'text-[20px] font-medium text-[#91AA9F]')}>
                                                Cùng gia nhập <span className={clsx(fredoka.className, 'font-bold text-[#1DA492]')}>dino</span> nào !
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-[10px]">
                                            <RoundedTextBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail2(e.target.value)}
                                                placeholder="Email" width="330" />
                                            <RoundedPasswordBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)}
                                                placeholder="Password" width="330" />
                                            <RoundedPasswordBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfPassword(e.target.value)}
                                                placeholder="Confirm password" width="330" />
                                        </div>
                                        <button disabled={email2.length === 0 || password2.length === 0 || password2 !== confPassword} className={clsx(
                                            'h-[50px] rounded-full w-[330px] bg-[#23BEAA] text-white font-medium',
                                            'disabled:bg-gray-300 cursor-not-allowed',
                                            { 'cursor-pointer hover:opacity-90': email2.length > 0 && password2.length > 0 && password2 === confPassword},
                                        )}>Tạo tài khoản</button>
                                        <div className={clsx(
                                            "flex flex-col gap-[5px] items-center justify-center",
                                            'cursor-pointer group hover:text-[#23BEAA]'
                                        )} onClick={() => setRegisterStep(AUTHSTEPS.SELECT_ROLE)}>
                                            <div className={clsx(
                                                "aspect-square h-[80px] flex items-center justify-center",
                                                'rounded-[20px] border-2 border-[rgba(0,0,0,0.2)]',
                                            )}>
                                                <FontAwesomeIcon className="group-hover:scale-150 transition-all duration-200" icon={faArrowLeft} />
                                            </div>
                                            <label className="font-medium cursor-pointer select-none">Quay lại</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    { /** Mascot 3D */}
                    <div>
                        <Image className="absolute -translate-x-[150px] translate-y-[20px]" src={mascot} alt='' height={700} />
                    </div>
                </div>
            </div>
        </div>
    )
}