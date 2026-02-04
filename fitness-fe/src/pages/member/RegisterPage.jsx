import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import StepInfo from "../../components/member/StepInfo";
import StepPayment from "../../components/member/StepPayment";
import StepSurvey from "../../components/member/StepSurvey";
import StepBodyMetrics from "../../components/member/StepBodyMetrics.jsx";
import backgroundImage from "../../assets/background.jpg";

import { getTrainingPackageById } from "../../services/member/TraningPakageService.js";
import { register } from "../../services/member/MemberService.js";
import { login } from "../../storages/authSlice";

export default function RegisterForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { packageId } = useParams();

  const [step, setStep] = useState(1);
  const [packageInfo, setPackageInfo] = useState(null);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('temp_register_data');
    if (saved) return JSON.parse(saved);
    return {
      name: "",
      email: "",
      password: "",
      payment_method: "",
      package_id: packageId,
    };
  });

  //

  useEffect(() => {
    if (!data.package_id) return;
    getTrainingPackageById(data.package_id)
      .then((res) => {
        if (res.data.success) {
          setPackageInfo(res.data.data);
          setData(prev => ({ ...prev, total_price: res.data.data.price }));
        }
      })
      .catch((err) => console.error("Lỗi lấy gói tập:", err));
  }, [data.package_id]);

  // 

  useEffect(() => {
    const momoResult = searchParams.get("resultCode");
    const vnpResult = searchParams.get("vnp_ResponseCode");

    if (momoResult === "0" || vnpResult === "00") {
      
      const savedData = localStorage.getItem('temp_register_data');

      if (savedData) {
        let parsedData = JSON.parse(savedData);
        
        if (parsedData.payment_method === 'credit_card') {
             parsedData.payment_method = 'vnpay'; 
        }

        register(parsedData)
          .then((res) => {
            dispatch(login(res.data));
            localStorage.setItem("token", res.data.token);
            
            toast.success("Thanh toán thành công!");
            setStep(3); 

            localStorage.removeItem('temp_register_data'); 
            navigate(window.location.pathname, { replace: true });
          })
          .catch((err) => {
            console.error("Lỗi đăng ký:", err); 
            
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Lỗi kích hoạt tài khoản.");
            }
          });
      }
    } else if (momoResult && momoResult !== "0") {
      toast.error("Giao dịch thất bại hoặc bị hủy.");
      localStorage.removeItem('temp_register_data'); 
    }
  }, [searchParams]);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-purple-900/70 -z-10" />

      <div
        className={`relative z-10 w-full transition-all duration-300
    ${
      step === 3
        ? "max-w-5xl" 
        : "max-w-lg" 
    }`}
      >
        {/* TAB INDICATOR */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
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
          {step === 1 && packageInfo && (
            <StepInfo
              data={data}
              setData={setData}
              next={next}
              pkg={packageInfo}
            />
          )}
          {step === 2 && (
            <StepPayment
              data={data}
              setData={setData}
              next={next}
              prev={prev}
            />
          )}
          {step === 3 && <StepSurvey next={next} />}
          {step === 4 && <StepBodyMetrics />}
        </div>
      </div>
    </div>
  );
}
