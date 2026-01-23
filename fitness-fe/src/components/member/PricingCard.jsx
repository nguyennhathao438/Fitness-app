import { DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function PricingCard({ package: pkg }) {
  const navigate = useNavigate();
  const formatVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  return (
    <div className="group h-[320px] [perspective:1000px]">
      <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front Face */}
        <div className="absolute inset-0 bg-gray-50 rounded-2xl p-5 flex flex-col [backface-visibility:hidden] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{pkg.name}</h3>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-700" />
            </div>
            <span className="text-2xl font-bold text-purple-700">
              {formatVND(pkg.price)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-700" />
            </div>
            <div className="flex-col">
              <span className="text-xl font-bold text-gray-900">
                {pkg.duration_days} ngày
              </span>
            </div>
          </div>

          <p className="text-purple-600 text-sm mt-4">Hover để xem thêm →</p>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 bg-purple-700 rounded-2xl p-6 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h4 className="text-xl font-bold text-white mb-4">Chi tiết gói:</h4>

          <p className="text-purple-100 text-base leading-relaxed mb-auto">
            {pkg.description}
          </p>

          <button
            type="button"
            onClick={() => navigate(`/register/${pkg.id}`)}
            className="w-full bg-white text-purple-700 font-bold py-3 rounded-full hover:bg-gray-100 transition-colors mt-6"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
