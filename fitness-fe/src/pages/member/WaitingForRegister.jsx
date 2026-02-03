import backgroundImage from "../../assets/background.jpg";
import { Hourglass } from "lucide-react";
export default function WaitingForRegister() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-purple-900/70 -z-10" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-10 py-10 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <Hourglass className="w-16 h-16 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-3xl font-bold"></Hourglass>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Đang chờ xác nhận thanh toán
          </h2>

          {/* Content */}
          <p className="text-gray-200 leading-relaxed mb-6">
            Vui lòng đợi bên chúng tôi xác nhận tiền để bạn có thể sử dụng dịch
            vụ.
            <br />
            Quá trình này có thể mất một chút thời gian.
          </p>

          <p className="text-gray-400 text-sm italic">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ
          </p>

          {/* Loading */}
          <div className="mt-6 flex justify-center">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
