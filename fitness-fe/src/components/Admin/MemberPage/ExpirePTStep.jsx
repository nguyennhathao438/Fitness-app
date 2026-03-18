import { ArrowLeftIcon, SaveIcon, ShieldAlertIcon } from "lucide-react";

export default function ExpirePTStep({ onBack, onExpire ,loading}) {
  return (
    <div className="px-6 pb-6 space-y-6">
      {/* Icon + text */}
      <div className="flex flex-col items-center gap-4">
        <div className="size-20 rounded-xl bg-yellow-100 flex items-center justify-center">
          <ShieldAlertIcon size={36} className="text-yellow-600" />
        </div>

        <p className="text-center text-gray-600 max-w-md">
          Bạn có chắc muốn hủy PT hiện tại và lưu lịch sử huấn luyện?
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 flex items-center rounded-lg border bg-fuchsia-500 text-white hover:bg-fuchsia-600"
        >
          <ArrowLeftIcon/>
          Back
        </button>

        <button
          type="button"
          onClick={onExpire}
          className="px-6 py-2 gap-1 flex items-center rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          <SaveIcon/>
          {loading ? "Expiring..." : "Expired PT"}
        </button>
      </div>
    </div>
  );
}
