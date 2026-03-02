import React, { useEffect, useState } from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import { 
  User, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Lock,
  Zap
} from "lucide-react";
import {
  getMyPT,
  getPTList,
  choosePT,
  getMemberSchedules,
  registerSchedule,
} from "../../services/member/MemberService";

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 64;

const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const minutesFromStart = (time) => timeToMinutes(time) - START_HOUR * 60;

export default function MemberRegisterPage() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [myPT, setMyPT] = useState(null);
  const [ptList, setPtList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { checkMyPT(); }, []);
  useEffect(() => { if (myPT) loadSchedules(); }, [weekStart, myPT]);

  const checkMyPT = async () => {
    try {
      const res = await getMyPT();
      if (res.data?.has_pt) setMyPT(res.data.pt);
      else { setMyPT(null); await loadPTList(); }
    } catch (err) { setMyPT(null); await loadPTList(); }
    finally { setLoading(false); }
  };

  const loadPTList = async () => {
    try {
      const res = await getPTList();
      setPtList(res.data?.data || []);
    } catch (err) { toast.error("Không tải được danh sách PT"); }
  };

  const handleChoosePT = async (id) => {
    try {
      await choosePT(id);
      toast.success("Chọn PT thành công!");
      checkMyPT();
    } catch (err) { toast.error("Chọn PT thất bại"); }
  };

  const loadSchedules = async () => {
    try {
      const start = format(weekStart, "yyyy-MM-dd");
      const end = format(addDays(weekStart, 6), "yyyy-MM-dd");
      const res = await getMemberSchedules(start, end);
      setSchedules(res.data?.data || []);
    } catch (err) { toast.error("Không tải được lịch"); }
  };

  const handleRegister = async (id) => {
    try {
      await registerSchedule(id);
      toast.success("Đăng ký lịch tập thành công!");
      loadSchedules();
    } catch (err) { toast.error(err.response?.data?.message || "Đăng ký thất bại"); }
  };

  const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const DAYS = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return { date, labelDay: format(date, "EEE"), labelDate: format(date, "dd/MM") };
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Đang chuẩn bị dữ liệu...</p>
    </div>
  );

  // ===============================
  // ===== GIAO DIỆN CHỌN PT =======
  // ===============================
  if (!myPT) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-4 italic">Tìm Huấn Luyện Viên</h1>
            <p className="text-slate-500 max-w-lg mx-auto font-medium">Chọn một người đồng hành phù hợp nhất để bắt đầu hành trình thay đổi vóc dáng của bạn.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ptList.map((pt) => (
              <div key={pt.id} className="group bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <User className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{pt.name}</h2>
                <p className="text-purple-600 font-bold text-sm uppercase tracking-widest mb-6">{pt.specialty || "Expert Trainer"}</p>
                <button
                  onClick={() => handleChoosePT(pt.id)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  Bắt đầu tập luyện
                  <Zap className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // ===== GIAO DIỆN ĐĂNG KÝ LỊCH ==
  // ===============================
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-[0.2em] mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Đã kết nối với PT
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-none flex items-center gap-3">
              Lịch tập cùng {myPT.name}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="px-4 font-black text-slate-700 text-sm min-w-[150px] text-center">
              Tuần: {format(weekStart, "dd/MM")} – {format(addDays(weekStart, 6), "dd/MM")}
            </div>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Schedule Info Legend */}
        <div className="flex gap-6 mb-6 px-2">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-3 h-3 rounded bg-purple-600" /> Của bạn
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /> Còn trống
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-3 h-3 rounded bg-slate-200" /> Đã kín
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[70px_repeat(7,1fr)]">
            
            {/* Header Spacer */}
            <div className="border-b border-r border-slate-100 bg-slate-50/50" />

            {/* Days Header */}
            {DAYS.map((d, i) => {
              const isToday = isSameDay(d.date, new Date());
              return (
                <div key={i} className={`text-center py-5 border-b border-r last:border-r-0 border-slate-100 ${isToday ? "bg-purple-50/30" : ""}`}>
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isToday ? "text-purple-600" : "text-slate-400"}`}>
                    {d.labelDay}
                  </div>
                  <div className={`text-lg font-black ${isToday ? "text-purple-600" : "text-slate-800"}`}>
                    {format(d.date, "dd")}
                  </div>
                </div>
              );
            })}

            {/* Time Column */}
            <div className="bg-slate-50/20 border-r border-slate-100">
              {HOURS.map((h) => (
                <div key={h} className="h-16 flex items-start justify-center pt-2 text-[11px] font-bold text-slate-400 tabular-nums">
                  {h}:00
                </div>
              ))}
            </div>

            {/* Event Columns */}
            {DAYS.map((d) => (
              <div key={format(d.date, "yyyy-MM-dd")} className="relative border-r last:border-r-0 border-slate-100" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                {/* Hourly Lines (Background) */}
                {HOURS.map((_, i) => (
                  <div key={i} className="h-16 border-b border-slate-50" />
                ))}

                {/* Schedules */}
                {schedules
                  .filter((s) => s.date === format(d.date, "yyyy-MM-dd"))
                  .map((s) => {
                    const top = (minutesFromStart(s.start_time) / 60) * HOUR_HEIGHT;
                    const height = ((timeToMinutes(s.end_time) - timeToMinutes(s.start_time)) / 60) * HOUR_HEIGHT;
                    const isBooked = !!s.member;
                    const isMine = s.member?.id === user?.id;

                    return (
                      <div
                        key={s.id}
                        style={{ top: top + 4, height: height - 8, left: 6, right: 6 }}
                        onClick={() => !isBooked && handleRegister(s.id)}
                        className={`absolute z-10 p-3 rounded-2xl flex flex-col justify-between transition-all duration-200 group
                          ${isMine 
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-[1.02]" 
                            : isBooked 
                            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed" 
                            : "bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-100 hover:scale-[1.02] hover:shadow-md"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black ${isMine ? 'text-purple-100' : isBooked ? 'text-slate-300' : 'text-emerald-500'}`}>
                            {s.start_time}
                          </span>
                          {isBooked && !isMine && <Lock className="w-3 h-3 opacity-50" />}
                        </div>

                        <div className="font-black text-[11px] leading-tight flex items-center gap-1">
                          {isMine ? (
                            <><CheckCircle2 className="w-3 h-3" /> Đã đặt</>
                          ) : isBooked ? (
                            "Kín lịch"
                          ) : (
                            "Đặt ngay"
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
  );
}