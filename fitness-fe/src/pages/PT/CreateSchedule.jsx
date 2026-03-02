import React, { useEffect, useState } from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  PlusCircle
} from "lucide-react";
import CreateEditScheduleModal from "./CreateEditScheduleModal";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
} from "../../services/pt/ScheduleService";

/**
 * CONSTANTS
 */
const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 64; // Tăng chiều cao lên 64px để thoáng hơn

/**
 * HELPERS
 */
const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const minutesFromStart = (time) =>
  timeToMinutes(time) - START_HOUR * 60;

export default function CalendarPT() {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [schedules, setSchedules] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [editing, setEditing] = useState(null);
  const [popupPos, setPopupPos] = useState(null);
  const [direction, setDirection] = useState("right");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    loadData();
  }, [weekStart]);

 const loadData = async () => {
  const start = format(weekStart, "yyyy-MM-dd");
  const end = format(addDays(weekStart, 6), "yyyy-MM-dd");

  try {
    const sRes = await getSchedules(start, end);
    setSchedules(sRes.data.data || []);
  } catch (err) {
    console.error("Load schedules failed:", err);
    toast.error("Không tải được lịch 😢");
  }
};

  const HOURS = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => `${String(i + START_HOUR).padStart(2, "0")}:00`
  );

  const DAYS = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      labelDay: format(date, "EEE"),
      labelDate: format(date, "dd/MM"),
    };
  });

  const calcPopupPos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 420;
    const margin = 12;
    let x = rect.right + window.scrollX + margin;
    let y = rect.top + window.scrollY;

    if (x + popupWidth > window.innerWidth) {
      x = rect.left + window.scrollX - popupWidth - margin;
    }
    return { x, y };
  };

  const openCreate = (e, date, hour) => {
  e.stopPropagation();

  setEditing(null);

  setPopupPos(calcPopupPos(e));
  setActiveSlot({
    date,
    start_time: `${String(hour).padStart(2, "0")}:00`,
    end_time: `${String(hour + 1).padStart(2, "0")}:00`,
  });
};

 const openEdit = (e, schedule) => {
  e.stopPropagation();

  setActiveSlot(null);

  setPopupPos(calcPopupPos(e));
  setEditing(schedule);
};

 const handleSave = async (data) => {
  try {
    if (editing) {
      const res = await updateSchedule(editing.id, data);
      toast.success(res?.data?.message || "Cập nhật lịch thành công");
    } else {
      const res = await createSchedule(data);
      toast.success(res?.data?.message || "Tạo lịch mới thành công");
    }

    closePopups();
    loadData();
  } catch (err) {
    console.error(err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Có lỗi xảy ra!!");
    }
  }
};

  const handleDelete = async (id) => {
  if (!confirm("Xóa lịch này?")) return;

  try {
    const res = await deleteSchedule(id);
    toast.success(res?.data?.message || "Xóa lịch thành công");

    closePopups();
    loadData();
  } catch (err) {
    console.error(err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Xóa thất bại!!");
    }
  }
};

  const closePopups = () => {
    setActiveSlot(null);
    setEditing(null);
    setPopupPos(null);
  };

  const changeWeek = (offset) => {
  closePopups();

  setDirection(offset > 0 ? "right" : "left");
  setAnimating(true);

  setTimeout(() => {
    setWeekStart(addDays(weekStart, offset));
    setAnimating(false);
  }, 250);
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8" onClick={closePopups}>
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-purple-600" />
              Lịch làm việc PT
            </h1>
            <p className="text-slate-500 font-medium mt-1">Quản lý thời gian huấn luyện trong tuần</p>
          </div>

          <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={(e) => { e.stopPropagation(); changeWeek(-7); }}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="px-6 py-1 text-sm font-bold text-slate-700 min-w-[180px] text-center italic">
              {format(weekStart, "dd MMM")} – {format(addDays(weekStart, 6), "dd MMM, yyyy")}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); changeWeek(7); }}
              className="p-2 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* CALENDAR TABLE */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className={`transition-all duration-300 ease-in-out ${animating ? (direction === "right" ? "-translate-x-8 opacity-0" : "translate-x-8 opacity-0") : "translate-x-0 opacity-100"}`}>
            <div className="grid grid-cols-[80px_repeat(7,1fr)]">
              
              {/* Top-Left Corner */}
              <div className="bg-slate-50/50 border-b border-r border-slate-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-300" />
              </div>

              {/* Day Headers */}
              {DAYS.map((d, i) => {
                const isToday = isSameDay(d.date, new Date());
                return (
                  <div key={i} className={`text-center py-5 border-b border-r last:border-r-0 border-slate-100 ${isToday ? "bg-purple-50/30" : ""}`}>
                    <div className={`text-[11px] font-black uppercase tracking-[0.15em] mb-1 ${isToday ? "text-purple-600" : "text-slate-400"}`}>
                      {d.labelDay}
                    </div>
                    <div className={`text-xl font-black ${isToday ? "text-purple-600" : "text-slate-800"}`}>
                      {format(d.date, "dd")}
                    </div>
                    {isToday && <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mx-auto mt-1" />}
                  </div>
                );
              })}

              {/* Time Column */}
              <div className="bg-slate-50/30 border-r border-slate-100">
                {HOURS.map((h) => (
                  <div key={h} className="h-16 flex items-start justify-end pr-3 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 tabular-nums">{h}</span>
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {DAYS.map((d) => (
                <div 
                  key={format(d.date, "yyyy-MM-dd")} 
                  className="relative border-r last:border-r-0 border-slate-100 group/col" 
                  style={{ height: HOURS.length * HOUR_HEIGHT }}
                >
                  {/* Grid Slots */}
                  {HOURS.map((_, i) => (
                    <div
                      key={i}
                      className="h-16 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group/slot relative"
                      onClick={(e) => openCreate(e, d.date, START_HOUR + i)}
                    >
                      <PlusCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                    </div>
                  ))}

                  {/* Schedule Items */}
                  {schedules
                    .filter((s) => s.date === format(d.date, "yyyy-MM-dd"))
                    .map((s) => {
                      const top = (minutesFromStart(s.start_time) / 60) * HOUR_HEIGHT;
                      const height = ((timeToMinutes(s.end_time) - timeToMinutes(s.start_time)) / 60) * HOUR_HEIGHT;

                      return (
                        <div
                          key={s.id}
                          onClick={(e) => openEdit(e, s)}
                          style={{ top: top + 4, height: height - 8, left: "6px", right: "6px" }}
                          className="absolute z-10 p-3 rounded-2xl border-l-[6px] border-purple-600 bg-white shadow-md shadow-purple-100 hover:shadow-lg hover:shadow-purple-200 transition-all group/item cursor-pointer overflow-hidden ring-1 ring-slate-100"
                        >
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 uppercase mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                                {s.start_time} - {s.end_time}
                              </div>
                              <div className="text-[13px] font-black text-slate-800 leading-tight group-hover/item:text-purple-700 transition-colors truncate">
                                {s.member?.name || "Lịch tập PT"}
                              </div>
                            </div>
                            
                            {s.member && (
                              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-50">
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                  {s.member.name.charAt(0)}
                                </div>
                                <span className="text-[10px] font-medium text-slate-500 truncate">Học viên</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {(activeSlot || editing) && popupPos && (
  <CreateEditScheduleModal
    key={editing ? `edit-${editing.id}` : `create-${activeSlot?.date}-${activeSlot?.start_time}`}
    slot={activeSlot}
    schedule={editing}
    position={popupPos}
    onClose={closePopups}
    onSave={handleSave}
    onDelete={handleDelete}
  />
)}
    </div>
  );
}