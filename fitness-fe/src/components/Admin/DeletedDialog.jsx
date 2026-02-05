import { AlertTriangleIcon } from "lucide-react";

export default function DeletedDialog({ open, onClose, onConfirm,name}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl w-[360px] p-6 shadow-xl animate-scaleIn">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangleIcon className="w-7 h-7 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-center mb-2">
          Xóa {name}
        </h3>

        {/* Content */}
        <p className="text-sm text-gray-500 text-center mb-6">
          Bạn có chắc chắn muốn xóa {name} này không?  
          Hành động này có thể hoàn tác.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100"
          >
            Không
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Có, xóa
          </button>
        </div>
      </div>
    </div>
  );
}
