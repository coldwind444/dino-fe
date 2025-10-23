import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function StudentHome() {
  const username = "Tân";
  const egg = "assets/landing/egg_normal";

  const topics = [
    { id: 1, title: "Các số đếm 10 và các phép tính cơ bản" },
    { id: 2, title: "So sánh và các dấu đầu toán học" },
    { id: 3, title: "Hình học cơ bản" },
    { id: 4, title: "Vị trí và phương hướng" },
  ];

  const colors = [
    "#1ABC9C", // teal
    "#F39C12", // orange
    "#3498DB", // blue
    "#9B59B6", // purple
    "#E74C3C", // red
    "#2ECC71",
  ];

  const getRandomColor = (index: number) => {
    return colors[index % colors.length];
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex gap-6 p-6">
        <aside className="w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-2xl p-6 text-white mb-6 relative overflow-hidden flex items-center justify-center">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#5ED9C6] bg-opacity-10 rounded-full"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#A8EDEA] bg-opacity-15 rounded-full"></div>
            <div className="absolute top-2 left-2 w-8 h-8 bg-[#E6FCF9] bg-opacity-20 rounded-full"></div>

            <h3 className="text-lg font-semibold relative z-10 text-center ml-6">
              Chương trình lớp 1
            </h3>
          </div>

          <div className="bg-[#5ED9C6] rounded-2xl p-6 mb-6 relative">
            <div className="absolute top-0 left-0 w-4 h-4">
              <div className="w-full h-full border-l-2 border-t-2 border-teal-400 rounded-tl-lg"></div>
            </div>
            <div className="absolute top-0 right-0 w-4 h-4">
              <div className="w-full h-full border-r-2 border-t-2 border-teal-400 rounded-tr-lg"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-4 h-4">
              <div className="w-full h-full border-l-2 border-b-2 border-teal-400 rounded-bl-lg"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4">
              <div className="w-full h-full border-r-2 border-b-2 border-teal-400 rounded-br-lg"></div>
            </div>
            {/* Progress Card */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gray-300 rounded-2xl translate-x-[4px] translate-y-[4px]" />
              <div className="relative bg-white rounded-2xl p-6">
                <div className="flex flex-col items-center mb-4">
                  <Image
                    src={`/${egg}.png`}
                    alt="egg progress"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="text-sm text-gray-600 mb-2">
                    Tiến trình hiện tại
                  </div>
                  <div className="text-4xl font-bold text-[#1ABC9C]">40%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#1ABC9C] h-2 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gray-300 rounded-2xl translate-x-[4px] translate-y-[4px]" />
              <div className="relative bg-white rounded-2xl p-6">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-[#F39C12]">202</div>
                  <div className="text-sm text-gray-600 uppercase">
                    Tinh thể thạch anh
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#16A085] rounded-2xl translate-x-[4px] translate-y-[4px]" />
              <div className="relative bg-[#1ABC9C] rounded-2xl p-6">
                <div className="space-y-2 text-sm text-white">
                  <div>
                    Số chủ đề đã học: <strong>4</strong>
                  </div>
                  <div>
                    Chủ đề học gần nhất: <strong>4</strong>
                  </div>
                  <div>
                    Số chủ đề đã mở khóa: <strong>6</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Featured Topic */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#1ABC9C] rounded-2xl translate-x-[6px] translate-y-[6px]" />
            <div className="relative bg-gradient-to-br from-[#E8F8F5] to-[#D5F4EC] rounded-2xl border-2 border-[#1ABC9C] p-8">
              <div className="flex items-center gap-6">
                <div className="flex gap-2"></div>
                <div className="flex-1">
                  <div className="inline-block bg-[#A7F3D0] text-[#059669] px-4 py-1 rounded-full text-sm mb-3">
                    Chủ đề 1
                  </div>
                  <h2 className="text-2xl font-bold text-[#1ABC9C] mb-4">
                    Các số đếm 10 và các phép tính cơ bản
                  </h2>
                  <button className="bg-[#1ABC9C] hover:bg-[#16A085] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors">
                    Bắt đầu
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {topics.map((topic, index) => (
              <div key={topic.id} className="relative h-80">
                <div
                  className="absolute inset-0 rounded-2xl translate-x-[4px] translate-y-[4px]"
                  style={{ backgroundColor: getRandomColor(index) }}
                />
                <div
                  className="relative bg-white rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg p-4 h-79"
                  style={{ borderColor: getRandomColor(index) }}
                >
                  <div
                    className={`text-5xl mb-4 ${
                      topic.id > 1 ? "grayscale" : ""
                    }`}
                  ></div>
                  <div className="text-xs text-[#1ABC9C] mb-2">
                    Chủ đề {topic.id}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 text-center leading-tight">
                    {topic.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-3">
            <button className="w-10 h-10 rounded-full border-2 border-[#1ABC9C] flex items-center justify-center text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full border-2 border-[#1ABC9C] flex items-center justify-center text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
