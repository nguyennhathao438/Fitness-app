import { useState } from "react";
import StepForgotPassword from "../../components/member/StepForgotPassword.jsx";
import StepOtp from "../../components/member/StepOtp.jsx";
import StepNewPassword from "../../components/member/StepNewPassword.jsx";
import backgroundImage from "../../assets/img/background.jpg";
import { resetPassword } from "../../services/member/ForgotPasswordService.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);
  const handleResetPassword = async () => {
    try {
      await resetPassword({
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
      });

      toast.success("Đổi mật khẩu thành công 🎉");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-purple-900/70 -z-10" />

      <div className="relative z-10 w-full max-w-lg">
        {/* TAB INDICATOR */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${
                  step === i
                    ? "bg-yellow-400 text-gray-900"
                    : step > i
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-400"
                }`}
            >
              {step > i ? "✓" : i}
            </div>
          ))}
        </div>

        {/* CARD */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-12 py-8">
          {step === 1 && (
            <StepForgotPassword data={data} setData={setData} next={next} />
          )}
          {step === 2 && (
            <StepOtp data={data} setData={setData} next={next} prev={prev} />
          )}
          {step === 3 && (
            <StepNewPassword
              data={data}
              setData={setData}
              prev={prev}
              onSubmit={handleResetPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}
