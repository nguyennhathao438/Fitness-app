import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Trash2, X, Save, AlertCircle } from "lucide-react";

export default function CreateEditScheduleModal({
  slot,
  schedule,
  position,
  onClose,
  onSave,
  onDelete,
}) {
  const editing = Boolean(schedule);

  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (editing) {
      setDate(schedule.date);
      setStart(schedule.start_time);
      setEnd(schedule.end_time);
    } else if (slot) {
      setDate(format(slot.date, "yyyy-MM-dd"));
      setStart(slot.start_time);
      setEnd(slot.end_time);
    }
  }, [slot, schedule, editing]);

  const submit = () => {
    if (!date || !start || !end) return;
    onSave({
      date,
      start_time: start,
      end_time: end,
    });
  };

  return (
    <div
      className="absolute z-[100] animate-in fade-in zoom-in duration-200"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white w-[360px] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden">
        {/* Decorative Header */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${editing ? 'bg-amber-400' : 'bg-purple-600'}`} />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            {editing ? (
              <>
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Chỉnh sửa lịch
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 text-purple-600" />
                Thêm lịch tập
              </>
            )}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Ngày tập luyện</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Time Pickers */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Khung giờ</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between gap-3">
          {editing ? (
            <button
              onClick={() => onDelete(schedule.id)}
              className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          ) : (
            <div /> // Placeholder
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Hủy
            </button>
            <button
              onClick={submit}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${
                editing 
                ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-200' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
              }`}
            >
              <Save className="w-4 h-4" />
              {editing ? "Cập nhật" : "Lưu lịch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}