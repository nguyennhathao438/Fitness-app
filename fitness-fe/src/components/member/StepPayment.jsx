import momoimg from "../../assets/img/momo.png";
import vnpayimg from "../../assets/img/vnpay.png";
import cardimg from "../../assets/img/creditcard.png";
import { toast } from "react-toastify";
import { register } from "../../services/member/MemberService.js";
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
    id: "card",
    name: "Thẻ tín dụng",
    description: "Visa / MasterCard",
    logo: cardimg,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-400",
    accentColor: "from-yellow-400 to-yellow-500",
  },
];

export default function StepPayment({ data, setData, next, prev }) {
  const choosePayment = (methodId) => {
    setData((prevData) => ({
      ...prevData,
      payment_method: methodId,
    }));
  };

  const handlePayment = async () => {
    if (!data.payment_method) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    //Gọi api thanh toán ở đây
    //Nếu thanh toán thành công
    try {
      console.log("Register data:", data);
      const res = await register(data);

      if (res.data.success) {
        toast.success("Đăng ký thành công");
        next(); // sang step 3 (hoàn tất)
      } else {
        toast.error(res.data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl text-yellow-400 text-center font-semibold">
        Chọn phương thức thanh toán
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => choosePayment(method.id)}
            className={`
        relative p-5 rounded-2xl border-2 transition-all duration-300
        flex flex-col items-center gap-3
        hover:scale-105
        ${
          data.payment_method === method.id
            ? `${method.borderColor} ${method.bgColor}`
            : "border-gray-600 bg-gray-800/50 hover:border-gray-400"
        }
      `}
          >
            {/* Check */}
            {data.payment_method === method.id && (
              <div
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full
          bg-gradient-to-r ${method.accentColor}
          flex items-center justify-center text-white font-bold`}
              >
                ✓
              </div>
            )}

            {/* Logo */}
            <div
              className={`w-16 h-16 rounded-xl p-2 flex items-center justify-center
        ${data.payment_method === method.id ? "bg-white" : "bg-gray-700"}`}
            >
              <img
                src={method.logo}
                alt={method.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Name */}
            <span
              className={`font-semibold ${
                data.payment_method === method.id
                  ? "text-gray-800"
                  : "text-white"
              }`}
            >
              {method.name}
            </span>
          </button>
        ))}
      </div>

      {data.payment_method && (
        <div className="text-center py-3 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
          <span className="text-yellow-400">
            Bạn đã chọn:{" "}
            <strong>
              {paymentMethods.find((m) => m.id === data.payment_method)?.name}
            </strong>
          </span>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          onClick={prev}
          className="flex-1 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 
      hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
        >
          Quay lai
        </button>

        <button
          onClick={handlePayment}
          disabled={!data.payment_method}
          className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300
      ${
        data.payment_method
          ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
          : "bg-gray-600 text-gray-400 cursor-not-allowed"
      }`}
        >
          Thanh toan
        </button>
      </div>
    </div>
  );
}
