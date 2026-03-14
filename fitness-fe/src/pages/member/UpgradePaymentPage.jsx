import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import StepPayment from "../../components/member/StepPayment";
import backgroundImage from "../../assets/background.jpg";
import { AlertTriangle, CheckCircle } from "lucide-react"; 

export default function UpgradePaymentPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const isExtend = location.state?.isExtend || false;

  const [data, setData] = useState({
    payment_method: "",
    package_id: packageId,
  });

  const handleSuccess = () => {
    navigate("/"); 
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-purple-900/70 -z-10" />

      <div className="relative z-10 w-full max-w-lg transition-all duration-300">
        
        {/* HEADER */}
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider drop-shadow-md">
                {isExtend ? "Xác nhận Gia hạn" : "Xác nhận Nâng cấp"}
            </h2>
        </div>

        {/* BOX CHỨA */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-6 py-8 shadow-2xl">
          
            {/* KHỐI THÔNG BÁO*/}
            <div className={`mb-6 border rounded-xl p-4 flex items-start gap-3 ${
                isExtend 
                ? "bg-green-500/10 border-green-500/50" 
                : "bg-red-500/10 border-red-500/50"
            }`}>
                {/* Icon thay đổi */}
                {isExtend ? (
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                ) : (
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                )}
                
                <div className="text-sm text-left">
                    <p className={`font-bold mb-1 uppercase text-xs tracking-wide ${
                        isExtend ? "text-green-400" : "text-red-400"
                    }`}>
                        {isExtend ? "Thông tin gia hạn" : "Lưu ý quan trọng"}
                    </p>
                    
                    <div className="text-gray-200 leading-relaxed text-sm">
                        {isExtend ? (
                            <span>
                                Thời gian của gói mới sẽ được <span className="text-green-400 font-bold">cộng dồn</span> tiếp vào ngày hết hạn hiện tại của bạn.
                            </span>
                        ) : (
                            <span>
                                Khi nâng cấp, gói hiện tại sẽ <span className="text-red-400 font-bold">kết thúc ngay</span> và <span className="text-red-400 font-bold">không bảo lưu</span> số ngày còn lại.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* COMPONENT THANH TOÁN */}
            <StepPayment
                data={data}
                setData={setData}
                next={handleSuccess}
                prev={handleBack}
                isUpgrade={!isExtend} 
                isExtend={isExtend}
            />
        </div>
      </div>
    </div>
  );
}