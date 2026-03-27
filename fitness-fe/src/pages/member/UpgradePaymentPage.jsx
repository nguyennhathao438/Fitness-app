import { useState, useEffect } from "react"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StepPaymentMember from "../../components/member/StepPaymentMember";
import backgroundImage from "../../assets/background.jpg";
import { CheckCircle, Info } from "lucide-react"; 

export default function UpgradePaymentPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const isExtend = location.state?.isExtend || false;
  const isNewPurchase = location.state?.isNewPurchase || false; 

  const [data, setData] = useState({
    payment_method: "",
    package_id: packageId,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const handleSuccess = () => {
    navigate("/"); 
  };

  const handleBack = () => {
    navigate(-1); 
  };

  let pageConfig = {
    title: "Xác nhận Nâng cấp",
    alertBg: "bg-purple-500/10 border-purple-500/50", 
    alertIcon: <Info className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />,
    alertTitleColor: "text-purple-400",
    alertTitle: "Chính sách nâng cấp",
    alertContent: (
      <span>
        Gói hiện tại của bạn sẽ kết thúc. <span className="text-purple-400 font-bold">Giá trị sử dụng còn lại</span> của gói cũ sẽ được hệ thống tính toán và <span className="text-purple-400 font-bold">trừ trực tiếp vào hóa đơn</span> thanh toán của gói mới.
      </span>
    )
  };

  if (isNewPurchase) {
    pageConfig = {
      title: "Xác nhận Đăng ký",
      alertBg: "bg-blue-500/10 border-blue-500/50",
      alertIcon: <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />,
      alertTitleColor: "text-blue-400",
      alertTitle: "Thông tin đăng ký",
      alertContent: (
        <span>
          Gói tập của bạn sẽ được kích hoạt và tính ngày <span className="text-blue-400 font-bold">ngay sau khi thanh toán</span> thành công.
        </span>
      )
    };
  } 
  else if (isExtend) {
    pageConfig = {
      title: "Xác nhận Gia hạn",
      alertBg: "bg-green-500/10 border-green-500/50",
      alertIcon: <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />,
      alertTitleColor: "text-green-400",
      alertTitle: "Thông tin gia hạn",
      alertContent: (
        <span>
          Thời gian của gói mới sẽ được <span className="text-green-400 font-bold">cộng dồn</span> tiếp vào ngày hết hạn hiện tại của bạn.
        </span>
      )
    };
  }

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
                {pageConfig.title}
            </h2>
        </div>

        {/* BOX CHỨA */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-6 py-8 shadow-2xl">
          
            {/* KHỐI THÔNG BÁO*/}
            <div className={`mb-6 border rounded-xl p-4 flex items-start gap-3 ${pageConfig.alertBg}`}>
                {pageConfig.alertIcon}
                
                <div className="text-sm text-left">
                    <p className={`font-bold mb-1 uppercase text-xs tracking-wide ${pageConfig.alertTitleColor}`}>
                        {pageConfig.alertTitle}
                    </p>
                    
                    <div className="text-gray-200 leading-relaxed text-sm">
                        {pageConfig.alertContent}
                    </div>
                </div>
            </div>

            {/* COMPONENT THANH TOÁN */}
            <StepPaymentMember
                data={data}
                setData={setData}
                next={handleSuccess}
                prev={handleBack}
                isUpgrade={!isExtend && !isNewPurchase} 
                isExtend={isExtend}
                isNewPurchase={isNewPurchase}
            />
        </div>
      </div>
    </div>
  );
}