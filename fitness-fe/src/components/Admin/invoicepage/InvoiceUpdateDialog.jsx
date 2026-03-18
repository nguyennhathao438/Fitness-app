import { CheckCircleIcon, XCircleIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

export default function InvoiceUpdateDialog({
  open,
  onClose,
  onConfirm,
  invoice,
  loading = false,
}) {
  const [status, setStatus] = useState("paid");
  const [note, setNote] = useState("");

  if (!open || !invoice) return null;

  const statusStyles = {
    paid: "bg-green-100 text-green-600",
    reject: "bg-red-100 text-red-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white w-[420px] rounded-2xl shadow-xl p-6 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <FileTextIcon className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Update Invoice</h3>
            <p className="text-sm text-gray-500">
              Invoice #{invoice.id} • {invoice.member?.name}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border
                       focus:ring-2 focus:ring-purple-500
                       focus:outline-none"
          >
            <option value="paid">Paid</option>
            <option value="reject">Reject</option>
          </select>

          <div className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {status.toUpperCase()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border
                       hover:bg-gray-100 text-gray-700"
          >
            Hủy
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onConfirm({
                status,
                note,
              })
            }
            className={`flex-1 px-4 py-2 rounded-xl text-white
              flex items-center justify-center gap-2
              ${status === "paid"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"}
              ${loading && "opacity-60 cursor-not-allowed"}`}
          >
            {status === "paid" ? (
              <CheckCircleIcon size={18} />
            ) : (
              <XCircleIcon size={18} />
            )}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
