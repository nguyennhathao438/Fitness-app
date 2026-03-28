import { useNavigate } from "react-router-dom";

export default function UpgradeModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1c1b3a] rounded-2xl border-2 border-yellow-400 w-[400px] p-6 text-center shadow-xl">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Tính năng cao cấp
        </h2>

        {/* Message */}
        <p className="text-gray-300 mb-6">
          Tính năng này chỉ dành cho gói tập cao hơn. Vui lòng nâng cấp để tiếp
          tục sử dụng.
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          {/* Close */}
          <button
            onClick={() => {
              onClose();
            }}
            className="flex-1 py-2 rounded-full border border-gray-400 text-white hover:bg-gray-600 transition"
          >
            Thoát
          </button>

          {/* Upgrade */}
          <button
            onClick={() => navigate("/upgrade")}
            className="flex-1 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
          >
            Nâng cấp
          </button>
        </div>
      </div>
    </div>
  );
}
