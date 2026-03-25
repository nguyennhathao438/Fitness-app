import { ArrowRightIcon, Calendar, Clock, XIcon } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.jpg";

export function CurrentPTStep({ pt,startDate,endDate, loading,onNext, onRemove }) {
  
  return (
    <div className="px-6 pb-6 space-y-6">
      <div className="rounded-xl border bg-gray-50 p-5 flex gap-4">
        {/* Avatar */}
        <div className="relative">
          <div>
            <img className="size-20 rounded-full object-cover font-bold" src={pt.avatar || defaultAvatar} alt={pt.name} />
          </div>
          <span className="absolute -top-1 -right-1 size-6 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-sm">
            ✓
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{pt.name}</h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-fuchsia-100 text-fuchsia-600">
              Active
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Certified personal trainer specializing in strength training and HIIT workouts.
          </p>

          <div className="flex gap-6 pt-2 text-sm text-gray-600">
            <div className="gap-2">
              <p className="flex items-center gap-2">
              <Calendar size={16} />
              Assigned
              </p>
              <span>{startDate}</span>
            </div>
            <div className="gap-2">
              <p className="flex items-center gap-2">
              <Clock size={16} />
              End Date
              </p>
              <span>{endDate}</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onRemove}
          className="px-6 py-2 flex items-center gap-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
        >
          <XIcon/>
          {loading ? "Removing..." : "Remove PT"}
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-80 flex items-center gap-2"
        >
          Next
          <ArrowRightIcon/>
        </button>
      </div>
    </div>
  );
}
