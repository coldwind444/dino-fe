import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

import plane from '../../public/assets/landing/paper-plane.png'
import geometry from '../../public/assets/landing/geometry.svg'
import things from '../../public/assets/landing/things.svg'

import { Bricolage_Grotesque, Roboto } from "next/font/google";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const BG = Bricolage_Grotesque()
const roboto = Roboto()

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="top-0 h-fit w-fit fixed">
        <Navbar isAuthenticated={false} />
      </header>
      <div className="h-[calc(100vh - 80px)] w-screen flex flex-col items-center">
        <div className="relative mt-[20px]">
          <iframe src="https://cdn.lottielab.com/l/ALwZUaUV549Cdr.html" width="900" height="508"></iframe>
          <div className="bg-white h-[100px] w-[300px] -translate-y-[150px] right-0 absolute"></div>
        </div>
        <div className="flex items-center flex-col -translate-y-[150px]">
          <h1 className={clsx(BG.className, 'font-bold text-[50px] text-[rgba(0,0,0,0.7)]')}>Học mà chơi, chơi mà học !</h1>
          <p className={clsx(roboto.className, 'font-medium text-[20px] text-[rgba(0,0,0,0.5)] text-center')}>Dino là nền tảng web trực tuyến giúp việc học Toán tư duy <br /> trở nên thú vị hơn dành cho học sinh Tiểu học !</p>
        </div>
        <div className="flex flex-col items-center -translate-y-[120px] z-10">
          <Image src={plane} height={120} width={120} alt="" />
          <Link href='/auth' className={clsx(
            'h-[60px] w-[290px] rounded-[35px] bg-[#AF7522] cursor-pointer',
            '-translate-y-[10px] hover:opacity-90'
          )}>
            <div className={clsx(
              'h-[60px] w-[290px] rounded-[35px] bg-[#F1A12E]',
              'flex flex-row gap-[20px] items-center justify-center text-white -translate-y-[6px]',
              'hover:-translate-y-[3px] transition-all duration-200'
            )}>
              <label className={clsx(roboto.className, 'text-[20px] ml-[20px] font-medium cursor-pointer')}>Bắt đầu ngay</label>
              <FontAwesomeIcon className={clsx('h-[30px] w-[30px] ml-[20px]')} icon={faPlay} />
            </div>
          </Link>
        </div>
        <div className="flex flex-row justify-between w-screen overflow-hidden -translate-y-[380px] z-0">
          <Image className="bottom-0 left-0 select-none" src={geometry} height={300} width={300} alt="" />
          <Image className="right-0 translate-x-[90px] select-none" src={things} height={400} width={400} alt="" />
        </div>
      </div>
      <footer>
      </footer>
    </div>
  );
}
