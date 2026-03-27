import { useState } from "react";
import momoimg from "../../assets/momo.png";
import vnpayimg from "../../assets/vnpay.png";
import cardimg from "../../assets/creditcard.png";
import { toast } from "react-toastify";
import { upgradePackage } from "../../services/member/MemberService.js";
import { createPaymentUrl } from "../../services/member/PaymentService.js";

const paymentMethods = [
  {
    id: "momo",
    name: "MoMo",
    description: "Thanh toán qua ví MoMo",
    logo: momoimg,
    bgColor: "bg-pink-50",
    borderColor: "border-pink-400",
    accentColor: "from-pink-500 to-pink-600",
  },
  {
    id: "vnpay",
    name: "VNPay",
    description: "Cổng thanh toán VNPay",
    logo: vnpayimg,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    accentColor: "from-blue-500 to-blue-600",
  },
  {
    id: "cash",
    name: "Tiền mặt",
    description: "Bạn sẽ được admin xác nhận",
    logo: cardimg,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-400",
    accentColor: "from-yellow-400 to-yellow-500",
  },
];

export default function StepPaymentMember({
  data,
  setData,
  next,
  prev,
  setWaiting, 
  isUpgrade = false,
  isExtend = false,
  isNewPurchase = false,
}) {
  const [loading, setLoading] = useState(false);

  const choosePayment = (methodId) => {
    setData((prevData) => ({
      ...prevData,
      payment_method: methodId,
    }));
  };

  const handlePayment = async () => {
    if (!data.payment_method) {
      toast.warning("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    
    setLoading(true);
    
    try {

      //  THANH TOÁN ONLINE (MOMO, VNPAY)

      if (["momo", "vnpay"].includes(data.payment_method)) {
        
        const paymentDataToSave = {
          ...data,
          isUpgrade,
          isExtend,
          isNewPurchase
        };
        localStorage.setItem("temp_register_data", JSON.stringify(paymentDataToSave));

        const bankCode = data.payment_method === "vnpay" ? "NCB" : "";
        const returnUrl = `${window.location.origin}/upgrade`; 

        const res = await createPaymentUrl(
          data.payment_method,
          data.package_id,
          bankCode,
          returnUrl
        );

        if (res.data?.payUrl) {
          window.location.href = res.data.payUrl;
          return; 
        } 
        
        toast.error("Không lấy được link thanh toán từ cổng điện tử!");
        setLoading(false);
        return;
      }

  
      //  THANH TOÁN TIỀN MẶT (CASH)

      let res = await upgradePackage({
        package_id: data.package_id,
        payment_method: data.payment_method,
        is_extend: isExtend,
      });

      let finalMessage = res.data.message;
      if (isNewPurchase) {
        finalMessage = "Đăng ký gói thành công!";
      }

      toast.success(finalMessage);

      if (res.data.waiting) {
        if (setWaiting) setWaiting(true);
      }
      
      next(); 

    } catch (error) {
      console.error(error);
      let errorMsg = "Có lỗi xảy ra";
      if (isExtend) errorMsg = "Gia hạn thất bại";
      else if (isUpgrade) errorMsg = "Nâng cấp thất bại";
      else if (isNewPurchase) errorMsg = "Đăng ký gói thất bại";

      const msg = error.response?.data?.message || errorMsg;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getActionTitle = () => {
    if (isExtend) return "Thanh toán Gia hạn";
    if (isUpgrade) return "Thanh toán Nâng cấp";
    if (isNewPurchase) return "Thanh toán Đăng ký";
    return "Thanh toán Ngay";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl text-yellow-400 text-center font-semibold">
        {getActionTitle()}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {paymentMethods.map((method) => {
          const isSelected = data.payment_method === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => choosePayment(method.id)}
              className={`cursor-pointer
                  relative p-5 rounded-2xl border-2 transition-all duration-300
                  flex flex-col items-center gap-3 hover:scale-105
                  ${isSelected 
                    ? `${method.borderColor} ${method.bgColor}` 
                    : "border-gray-600 bg-gray-800/50 hover:border-gray-400"}
              `}
            >
              {isSelected && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${method.accentColor} flex items-center justify-center text-white font-bold`}>
                  ✓
                </div>
              )}

              <div className={`w-16 h-16 rounded-xl p-2 flex items-center justify-center ${isSelected ? "bg-white" : "bg-gray-700"}`}>
                <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
              </div>

              <span className={`font-semibold ${isSelected ? "text-gray-800" : "text-white"}`}>
                {method.name}
              </span>
            </button>
          )
        })}
      </div>

      {data.payment_method && (
        <div className="text-center py-3 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
          <span className="text-yellow-400">
            Bạn đã chọn: <strong>{paymentMethods.find((m) => m.id === data.payment_method)?.name}</strong>
          </span>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          onClick={prev}
          className=" cursor-pointer flex-1 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:scale-105 hover:text-gray-900 hover:font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30"
        >
          Quay lại
        </button>

        <button
          onClick={handlePayment}
          disabled={!data.payment_method || loading}
          className={`cursor-pointer flex-1 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2
          ${data.payment_method && !loading 
            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30" 
            : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
        >
          {loading && <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />}
          {loading ? "Đang xử lý..." : getActionTitle()}
        </button>
      </div>
    </div>
  );
}