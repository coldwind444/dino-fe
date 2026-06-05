import { faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type BlobModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content?: string;
    buttonText?: string;
};

const BlobModal = ({ isOpen, onClose, title, content, buttonText }: BlobModalProps) => {
    if (!isOpen) return null;

    return (
        <>
            <style>
                {`
          @keyframes leafFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
            }
            50% {
              transform: translateY(-15px) rotate(2deg);
              border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
            }
          }
          .animate-leaf-blob {
            animation: leafFloat 5s ease-in-out infinite;
          }
        `}
            </style>

            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 font-sans backdrop-blur-md">

                <div className="animate-leaf-blob relative w-[380px] border-4 border-orange-400 bg-gradient-to-br from-teal-300 to-teal-600 p-10 text-center shadow-[0px_0px_40px_rgba(132,204,22,0.4)]">

                    <div className="mb-2 text-6xl drop-shadow-md text-white">
                        <FontAwesomeIcon icon={faBinoculars} size="xl" />
                    </div>
                    <h2 className="mb-3 text-3xl font-extrabold text-white drop-shadow-md">
                        {title}
                    </h2>

                    <p className="mb-8 px-2 text-base font-medium leading-relaxed text-white">
                        {content}
                    </p>

                    <button
                        onClick={onClose}
                        className="rounded-full cursor-pointer bg-orange-400 px-8 py-3 text-lg font-extrabold uppercase tracking-wide text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-[0px_10px_20px_rgba(0,0,0,0.3)] active:scale-95"
                    >
                        {buttonText}
                    </button>

                </div>
            </div>
        </>
    );
};

export default BlobModal;