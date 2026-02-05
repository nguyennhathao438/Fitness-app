import { toast } from "react-toastify";
import { checkEmail } from "../../services/member/MemberService.js";
import { useState } from "react";
export default function StepInfo({ data, setData, next, pkg }) {
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [loading, setLoading] = useState(false);
  const handleNext = async () => {
    if (!data.name || !data.email || !data.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin cá nhân");
      return;
    }
    if (data.password.length < 6) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }
    setLoading(true);
    try {
      const response = await checkEmail(data.email);
      if (response.data.exists) {
        toast.error("Email đã tồn tại");
        return;
      }
    } catch (error) {
      toast.error("Lỗi hệ thống", error);
      return;
    } finally {
      setLoading(false);
    }
    next();
  };

  return (
    <div className="flex justify-center">
      {/* KHỐI BỊ GIỚI HẠN CHIỀU NGANG */}
      <div className="w-full max-w-md space-y-3">
        {/* TITLE */}
        <h2 className="text-center text-xl font-bold text-white">
          Bạn vừa chọn gói <span className="text-yellow-400">{pkg.name}</span>
        </h2>
        <p className="text-center text-yellow-400 text-sm mb-3">
          {pkg.price}₫ – {pkg.duration_days} ngày
        </p>

        <h2 className="text-center text-base font-semibold text-yellow-400 mb-5">
          Thông tin cá nhân
        </h2>

        {/* HỌ TÊN */}
        <div className="mb-5">
          <label className="block text-sm text-white mb-1">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full px-5 py-2.5 bg-transparent
              border-2 border-yellow-400 rounded-full
              text-white text-sm placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block text-sm text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="w-full px-5 py-2.5 bg-transparent
              border-2 border-yellow-400 rounded-full
              text-white text-sm placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="block text-sm text-white mb-1">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            className="w-full px-5 py-2.5 bg-transparent
              border-2 border-yellow-400 rounded-full
              text-white text-sm placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          />
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className={`w-full py-3 rounded-full font-bold text-base transition-all
    ${
      loading
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
    }
  `}
        >
          {loading ? "Đang kiểm tra ..." : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
}
