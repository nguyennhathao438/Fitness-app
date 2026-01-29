import backgroundImage from "../../assets/img/background.jpg";
import { loginService } from "../../services/member/MemberService.js";
import { useState } from "react";
import { toast } from "react-toastify";
import { login } from "../../storages/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Validate email (email)
    if (!formData.email) {
      toast.error("Vui lòng nhập tài khoản");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate password
    if (!formData.password) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const res = await loginService(formData);
      localStorage.setItem("token", res.data.token);
      dispatch(login(res.data));
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi kết nối sever");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-purple-900/70 -z-10" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-8 py-10">
          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            ĐĂNG NHẬP
          </h1>
          <p className="text-yellow-400 text-center text-sm mb-8">
            Chao mung ban quay tro lai
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* email Field */}
            <div>
              <label className="block text-white text-sm mb-2">Tai khoan</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhap email hoac so dien thoai"
                className="w-full px-5 py-3 rounded-full bg-gray-800/50 border-2 border-yellow-400 
                  text-white placeholder-gray-400 outline-none 
                  focus:border-yellow-300 focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm mb-2">Mat khau</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhap mat khau"
                className="w-full px-5 py-3 rounded-full bg-gray-800/50 border-2 border-yellow-400 
                  text-white placeholder-gray-400 outline-none 
                  focus:border-yellow-300 focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-yellow-400 text-sm hover:text-yellow-300 transition-colors"
              >
                Quen mat khau?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold text-base transition-all
    ${
      loading
        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
        : "bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
    }
  `}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
