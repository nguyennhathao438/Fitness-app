import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";

export default function AvatarWithBubble({ member, defaultAvatar }) {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const messages = [
    "Xem hôm nay bạn cần làm gì nào ?",
    "Xem lại lịch sử tập luyện",
    "Đừng quên cập nhật cân nặng của bạn nhé !",
    "Ở đây có mọi thống kê về sức khỏe của bạn đấy !",
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer;
    let hideTimer;

    const loop = () => {
      showTimer = setTimeout(() => {
        setVisible(true);

        hideTimer = setTimeout(() => {
          setVisible(false);

          setTimeout(() => {
            setIndex((prev) => (prev + 1) % messages.length);
            loop(); // lặp lại
          }, 500);
        }, 2500); // thời gian hiển thị
      }, 3000); // delay giữa các lần xuất hiện
    };

    loop();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 relative">
      <Link to="/profile" className="relative">
        {member?.avatar ? (
          <img
            src={member.avatar || defaultAvatar}
            alt="avatar"
            className={`w-9 h-9 rounded-full object-cover border-2 transition-all
              ${
                isProfilePage
                  ? "border-fuchsia-500 ring-2 ring-fuchsia-500 animate-pulse"
                  : "border-purple-400"
              }`}
          />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2
              ${
                isProfilePage
                  ? "bg-gray-700 border-fuchsia-500 ring-2 ring-fuchsia-500"
                  : "bg-gray-700 border-purple-400"
              }`}>
            <User className="w-5 h-5 text-gray-300" />
          </div>
        )}
        {/* Chấm đỏ giống livestream */}
        {isProfilePage && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-fuchsia-500 rounded-full border-2 border-black animate-pulse" />
        )}
      </Link>

      <span className="text-sm text-gray-200 font-medium">{member?.name}</span>

      {visible && (
        <div
          className="absolute left-0 top-12 transition-all duration-300"
          style={{
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <div
            className="relative
      bg-black/60 backdrop-blur-md
      text-white text-xs px-3 py-2
      rounded-lg shadow-lg border border-white/10"
          >
            <div className="max-w-[160px] text-center leading-relaxed text-white drop-shadow">
              {messages[index]}
            </div>

            <div
              className="absolute top-0 left-4 w-2 h-2 
        bg-black/60 backdrop-blur-md
        rotate-45 border border-white/10
        -translate-y-1/2"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
