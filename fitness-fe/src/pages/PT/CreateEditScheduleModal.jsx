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
const [confirmDelete, setConfirmDelete] = useState(false);
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
    <>
      {/* Overlay cho Mobile để tăng trải nghiệm người dùng */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div
        className={`
          z-[100] animate-in fade-in zoom-in duration-200
          /* Mobile: Căn giữa màn hình */
          fixed inset-x-4 top-[20%] mx-auto 
          /* Desktop: Quay lại dùng tọa độ absolute từ props */
          lg:absolute lg:inset-auto
        `}
        style={{ 
          /* Inline style chỉ áp dụng cho màn hình desktop (lg) */
          left: window.innerWidth >= 1024 ? position.x : undefined, 
          top: window.innerWidth >= 1024 ? position.y : undefined 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CARD DESIGN SYSTEM */}
        <div className="bg-white w-full max-w-[380px] mx-auto rounded-[32px] p-6 md:p-8 shadow-2xl shadow-slate-900/20 border border-slate-200 relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className={`absolute top-0 left-0 right-0 h-2 ${editing ? 'bg-amber-400' : 'bg-purple-600'}`} />
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {editing ? (
                  <>
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                    Chỉnh sửa
                  </>
                ) : (
                  <>
                    <Calendar className="w-6 h-6 text-purple-600" />
                    Thêm lịch
                  </>
                )}
              </h3>
              <p className="text-slate-500 text-xs font-medium mt-1">Cài đặt khung giờ làm việc</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* INPUT: Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">Ngày huấn luyện</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* INPUT: Time Pickers */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">Thời gian (Bắt đầu - Kết thúc)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative w-full">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full pl-11 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
                <span className="hidden sm:block text-slate-300 font-black">→</span>
                <div className="relative w-full">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full pl-11 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            {editing ? (
              <button
               onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            ) : (
              <div /> 
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="bg-slate-100 text-slate-700 rounded-xl px-4 py-2 font-semibold hover:bg-slate-200 transition-all active:scale-95 text-sm"
              >
                Hủy
              </button>
              <button
                onClick={submit}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all active:scale-95 ${
                  editing 
                  ? 'bg-slate-900 hover:bg-slate-800' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                }`}
              >
                <Save className="w-4 h-4" />
                {editing ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirmDelete && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
    <div className="bg-white w-[340px] rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Xác nhận xóa</h3>
          <p className="text-xs text-slate-500">
            Hành động này không thể hoàn tác
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={() => setConfirmDelete(false)}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
        >
          Hủy
        </button>

        <button
          onClick={() => {
            setConfirmDelete(false);
            onDelete(schedule.id);
          }}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
        >
          Xóa
        </button>
      </div>

    </div>

  </div>
)}
    </>
  );
}