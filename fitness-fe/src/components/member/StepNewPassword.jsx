import { useState } from "react";
import { toast } from "react-toastify";
export default function StepResetPassword({ data, setData, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!data.password) {
      toast.error("Mật khẩu không được để trống");
      return;
    } else if (data.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không được để trống");
      return;
    } else if (data.password !== data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      if (onSubmit) onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg font-semibold mb-6">
          Đặt lại mật khẩu
        </h3>

        {/* PASSWORD */}
        <label className="text-gray-300 text-sm block mb-2">Mật khẩu</label>

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới"
            className="w-full bg-transparent border-2 border-yellow-400 rounded-full px-6 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <label className="text-gray-300 text-sm block mb-2">
          Xác nhận mật khẩu
        </label>

        <div className="relative mb-2">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            className="w-full bg-transparent border-2 border-yellow-400 rounded-full px-6 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-3 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30"
        >
          Hoàn tất
        </button>
      </div>
    </div>
  );
}
