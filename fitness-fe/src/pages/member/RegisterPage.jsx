import { useState, useEffect } from "react";
import StepInfo from "../../components/member/StepInfo";
import StepPayment from "../../components/member/StepPayment";
import StepSurvey from "../../components/member/StepSurvey";
import backgroundImage from "../../assets/background.jpg";
import { useParams } from "react-router-dom";
import StepBodyMetrics from "../../components/member/StepBodyMetrics.jsx";
import { getTrainingPackageById } from "../../services/member/TraningPakageService.js";
export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const { packageId } = useParams();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    payment_method: "",
    package_id: packageId,
  });
  const [packageInfo, setPackageInfo] = useState(null);

  useEffect(() => {
    if (!data.package_id) return;

    getTrainingPackageById(data.package_id)
      .then((res) => {
        if (res.data.success) {
          setPackageInfo(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy gói tập:", err);
      });
  }, [data.package_id]);
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
        ? "max-w-5xl" // StepSurvey rộng hơn
        : "max-w-lg" // Step 1,2 gọn hơn
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
