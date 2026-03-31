import { verifyOtp } from "../../services/member/ForgotPasswordService";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function StepOTP({ data, setData, next, prev }) {
  const [isloading, setIsloading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  //  countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    if (timeLeft <= 0) {
      toast.error("OTP đã hết hạn, nhấn quay lại để gửi lại OTP mới");
      return;
    }

    if (!data.otp || data.otp.trim().length !== 6) {
      toast.error("OTP phải đủ 6 số");
      return;
    }

    try {
      setIsloading(true);
      const res = await verifyOtp({ email: data.email, otp: data.otp });
      console.log("OTP verification response:", res.data);
      toast.success("Xác thực OTP thành công");
      next();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">
          Xác thực mã OTP
        </h3>

        <p className="text-gray-400 text-sm mb-2">
          Mã OTP đã được gửi đến{" "}
          <span className="text-yellow-400">{data.email}</span>
        </p>

        {/* ⏱ Countdown */}
        <p
          className={`text-sm mb-4 ${timeLeft <= 10 ? "text-red-400" : "text-gray-400"}`}
        >
          OTP hết hạn sau: <span className="font-semibold">{timeLeft}s</span>
        </p>

        <label className="text-gray-300 text-sm block mb-2">Mã OTP</label>

        <input
          type="text"
          name="otp"
          value={data.otp}
          onChange={handleChange}
          placeholder="Nhập mã OTP (6 ký tự)"
          maxLength={6}
          className="w-full bg-transparent border-2 border-yellow-400 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 transition-colors text-center text-2xl tracking-widest"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prev}
          className="flex-1 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
        >
          Quay lại
        </button>

        <button
          type="button"
          disabled={isloading || timeLeft <= 0}
          onClick={handleSubmit}
          className={`
            flex-1 py-3 rounded-full font-semibold transition-all duration-300
            ${
              isloading || timeLeft <= 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
            }
          `}
        >
          {isloading ? "Đang xác thực..." : "Xác thực OTP"}
        </button>
      </div>
    </div>
  );
}
