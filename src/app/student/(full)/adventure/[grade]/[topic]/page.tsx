import { FC } from "react";

interface MilestonesPageProps {
  params: {
    grade: string;
    topic: string;
  };
}

// Mock data
const GRADES = {
  1: {
    world: "Vùng đất hứa",
    url: "../../../../../../../public/scalable_assets/paths/grade_1/checkpoint.png",
    lands: [
      { name: "Thảo nguyên rực rỡ", url: "../../../../../../../public/scalable_assets/paths/grade_1/level_1.png" },
      { name: "Hồ mộng mơ", url: "../../../../../../../public/scalable_assets/paths/grade_1/level_2.png" },
      { name: "Thác thiên đường", url: "../../../../../../../public/scalable_assets/paths/grade_1/level_3.png" }
    ]
  },

  2: {
    world: "Rừng huyền dịu",
    url: "../../../../../../../public/scalable_assets/paths/grade_2/checkpoint.png",
    lands: [
      { name: "Rừng mưa bí ẩn", url: "../../../../../../../public/scalable_assets/paths/grade_2/level_1.png" },
      { name: "Rừng lấp lánh", url: "../../../../../../../public/scalable_assets/paths/grade_2/level_2.png" },
      { name: "Vương quốc nấm", url: "../../../../../../../public/scalable_assets/paths/grade_2/level_3.png" }
    ]
  },

  3: {
    world: "Biển ký ức",
    url: "../../../../../../../public/scalable_assets/paths/grade_3/checkpoint.png",
    lands: [
      { name: "Bờ biển ấm áp", url: "../../../../../../../public/scalable_assets/paths/grade_3/level_1.png" },
      { name: "Đảo cô đơn", url: "../../../../../../../public/scalable_assets/paths/grade_3/level_2.png" },
      { name: "Thành phố bí mật", url: "../../../../../../../public/scalable_assets/paths/grade_3/level_3.png" }
    ]
  },

  4: {
    world: "Sa mạc huy hoàng",
    url: "../../../../../../../public/scalable_assets/paths/grade_4/checkpoint.png",
    lands: [
      { name: "Thung lũng gió", url: "../../../../../../../public/scalable_assets/paths/grade_4/level_1.png" },
      { name: "Tàn tích bị lãng quên", url: "../../../../../../../public/scalable_assets/paths/grade_4/level_2.png" },
      { name: "Eo cát Ánh trăng", url: "../../../../../../../public/scalable_assets/paths/grade_4/level_3.png" }
    ]
  },

  5: {
    world: "Vương quốc Mặt Trời",
    url: "../../../../../../../public/scalable_assets/paths/grade_5/checkpoint.png",
    lands: [
      { name: "Cánh đồng hoa ngũ sắc", url: "../../../../../../../public/scalable_assets/paths/grade_5/level_1.png" },
      { name: "Cao nguyên đá đỏ", url: "../../../../../../../public/scalable_assets/paths/grade_5/level_2.png" },
      { name: "Đỉnh Mặt Trời", url: "../../../../../../../public/scalable_assets/paths/grade_5/level_3.png" }
    ]
  }
};

const Milestones: FC<MilestonesPageProps> = ({ params }) => {
  return (
    <div>
      <h1>Topic: {params.topic}</h1>
    </div>
  );
};

export default Milestones;