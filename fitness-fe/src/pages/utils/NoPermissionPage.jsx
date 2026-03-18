import { ShieldX } from "lucide-react";

export default function NoPermissionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center w-[420px]">
        {/* icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* title */}
        <h1 className="text-2xl font-bold text-purple-700">
          Không có quyền truy cập
        </h1>

        {/* desc */}
        <p className="text-gray-500 mt-3">
          Bạn không có permission để truy cập trang này. Vui lòng liên hệ quản
          trị viên.
        </p>

        {/* button */}
        <button
          onClick={() => window.history.back()}
          className="
            mt-6
            px-6 py-2.5
            rounded-xl
            text-white
            font-semibold
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-700 hover:to-indigo-700
            transition
            hover:scale-105
            active:scale-95
          "
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
