import { useSelector } from "react-redux";

import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function RequireMember({ children }) {
  const { statusInvoice, validUntil } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const now = new Date();
  if (statusInvoice === null && validUntil === null) {
    return <Navigate to="/" replace />;
  }
  // pending -> waiting
  if (statusInvoice === "pending") {
    return <Navigate to="/waiting" replace />;
  }

  const isExpired = !validUntil || new Date(validUntil) < now;

  // khóa scroll khi hết hạn
  useEffect(() => {
    if (isExpired) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExpired]);

  return (
    <>
      {children}

      {isExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Gói tập đã hết hạn
            </h2>

            <p className="text-gray-600 mb-6">
              Bạn cần gia hạn để tiếp tục sử dụng hệ thống
            </p>

            <button
              onClick={() => navigate("/upgrade")}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Gia hạn ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
