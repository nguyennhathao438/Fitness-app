import { sendEmailForPasswordReset } from "../../services/member/ForgotPasswordService";
import { useState } from "react";
import { toast } from "react-toastify";
export default function StepForgotPassword({ data, setData, next }) {
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    if (!data.email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    // 2. Regex email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Email không hợp lệ");
      return;
    }
    setLoading(true);
    try {
      const res = await sendEmailForPasswordReset({ email: data.email });
      if (!res.data || res.data.success === false) {
        toast.error(res.data.message || "Email không tồn tại");
        return;
      }
      next();
    } catch (err) {
      alert(err.message || "Lỗi hệ thống, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Nhập Email</h3>

        <label className="text-gray-300 text-sm block mb-2">Email</label>

        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Nhập email của bạn"
          className="w-full bg-transparent border-2 border-yellow-400 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 transition-colors"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-full font-bold text-base transition-all
    ${
      loading
        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
        : "bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
    }
  `}
        >
          {loading ? "Đang kiểm tra ..." : "Tiếp theo"}
        </button>
      </div>
    </div>
  );
}
