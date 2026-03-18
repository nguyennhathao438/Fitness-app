export default function NoPermissionModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative w-[420px] rounded-xl bg-white p-6 shadow-lg text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Không có quyền truy cập
        </h2>

        <p className="text-gray-500 mt-2">
          Bạn không có permission để thực hiện chức năng này
        </p>

        <button
          onClick={onClose}
          className="
            mt-4
            rounded-lg
            bg-gray-200
            px-4 py-2
            hover:bg-gray-300
          "
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
