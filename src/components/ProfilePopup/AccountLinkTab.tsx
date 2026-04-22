"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { UserProfileResponse } from "@/types";
import { getFamilyCode, getUsers } from "@/apis";

type AccountLinkTabProps = {
  profile: UserProfileResponse;
};

export default function AccountLinkTab({ profile }: AccountLinkTabProps) {
  const [familyCode, setFamilyCode] = useState(".........");
  const [linkedStudents, setLinkedStudents] = useState<UserProfileResponse[]>(
    [],
  );
  const [copied, setCopied] = useState(false);

  const isParent = profile.role === "parent";

  useEffect(() => {
    let ignore = false;

    const fetchFamilyCode = async () => {
      try {
        const res = await getFamilyCode(profile.familyId);
        if (!ignore) {
          setFamilyCode(res);
        }
      } catch (err) {
        console.error("Failed to fetch family code", err);
      }
    };

    const fetchLinkedStudents = async () => {
      if (!isParent) return;
      try {
        const users = await getUsers({
          familyId: profile.familyId,
          role: "student",
        });
        if (!ignore) {
          setLinkedStudents(users);
        }
      } catch (err) {
        console.error("Failed to fetch linked students", err);
      }
    };

    if (profile.familyId) {
      fetchFamilyCode();
      if (isParent) {
        fetchLinkedStudents();
      }
    }

    return () => {
      ignore = true;
    };
  }, [profile, isParent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(familyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Liên kết tài khoản
      </h2>

      {!isParent ? (
        /* For students */
        <div className="mb-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Tài khoản phụ huynh được liên kết
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#C5EDE5] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-lg text-gray-800">
                    Nguyễn Văn H
                  </h5>
                  <p className="text-sm text-gray-500">vanh@gmail.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Mã liên kết tài khoản
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm">
                      {familyCode}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`${copied ? "text-[#16A085]" : "text-[#1ABC9C] hover:text-[#16A085]"} cursor-pointer transition-colors`}
                    >
                      <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* For parents */
        <div className="space-y-8">
          <div>
            <div className="flex gap-4 items-center">
              <div className="w-64">
                <p className="text-base text-gray-500 mb-2">
                  Mã liên kết tài khoản
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={familyCode}
                    readOnly
                    className="w-full bg-white border border-[#1ABC9C] text-[#1ABC9C] font-mono rounded-lg py-2.5 px-4 outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${copied ? "text-[#16A085]" : "text-[#1ABC9C] hover:text-[#16A085]"} cursor-pointer transition-colors bg-white px-1`}
                  >
                    <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 pt-7">
                <p className="text-[#F39C12] font-semibold italic text-sm">
                  Bạn có thể chia sẻ mã liên kết này cho con để liên kết tài
                  khoản.
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-base text-gray-500 mb-4">
              Các tài khoản đã được liên kết
            </p>
            <div className="space-y-4">
              {linkedStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D6F8EB] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 text-sm">
                      {student.name}
                    </h5>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              ))}
              {linkedStudents.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Chưa có tài khoản nào được liên kết.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
