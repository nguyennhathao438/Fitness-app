import React, { useEffect, useState } from "react";
import { getMySchedules, cancelMySchedule } from "../../services/member/MemberService";
import { toast } from "react-toastify";
import { Calendar, Clock, X, Bell, Zap, ChevronRight, MapPin } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { vi } from "date-fns/locale";

export default function MySchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getMySchedules();
      // Sắp xếp lịch theo thời gian gần nhất lên đầu
      const sorted = (res.data.data || []).sort((a, b) => 
        new Date(`${a.date}T${a.start_time}`) - new Date(`${b.date}T${b.start_time}`)
      );
      setSchedules(sorted);
    } catch (err) {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Xác nhận hủy lịch tập này?")) return;
    try {
      await cancelMySchedule(id);
      toast.success("Đã hủy lịch");
      loadData();
    } catch (err) {
      toast.error("Hủy lịch thất bại");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );

  const nextSession = schedules[0]; // Buổi tập gần nhất

  return (
    <div className="min-h-screen bg-[#fdfdff] p-4 lg:p-10 text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP BANNER: NEXT SESSION */}
        {nextSession && (
          <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 mb-12 text-white shadow-2xl shadow-purple-200">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Buổi tập sắp tới
                </div>
                <h2 className="text-4xl font-black mb-2">
                  {format(parseISO(nextSession.date), "EEEE, dd/MM", { locale: vi })}
                </h2>
                <div className="flex items-center gap-4 text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {nextSession.start_time} - {nextSession.end_time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> PT {nextSession.pt?.name}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleCancel(nextSession.id)}
                className="bg-white/10 hover:bg-red-500/20 hover:text-red-400 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl font-bold transition-all"
              >
                Hủy buổi này
              </button>
            </div>
            {/* Decorative Background Circles */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
          </div>
        )}

        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-xl font-black flex items-center gap-2">
            Lịch trình chi tiết
            <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full">{schedules.length} buổi</span>
          </h3>
        </div>

        {/* TIMELINE LIST */}
        {schedules.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-400">Bạn chưa có lịch tập nào được lên kế hoạch.</p>
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[4.5rem] before:-z-10 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
            {schedules.map((s, idx) => (
              <div key={s.id} className="group relative flex items-start gap-4 md:gap-8 transition-all">
                
                {/* Time Indicator (Desktop) */}
                <div className="hidden md:flex flex-col items-end min-w-[80px] pt-1">
                  <span className="text-sm font-black text-slate-900">{s.start_time}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.end_time}</span>
                </div>

                {/* Dot */}
                <div className={`mt-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ring-2 ${idx === 0 ? 'ring-purple-600 bg-purple-600' : 'ring-slate-200 bg-slate-200'}`} />

                {/* Card */}
                <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group-hover:shadow-md group-hover:border-purple-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${idx === 0 ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="md:hidden text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">
                        {s.start_time} - {idx === 0 ? 'Sắp diễn ra' : 'Lịch tập'}
                      </div>
                      <h4 className="font-black text-slate-800 tracking-tight">
                        {format(parseISO(s.date), "EEEE, dd 'tháng' MM", { locale: vi })}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> Training Center • PT {s.pt?.name || 'Cá nhân'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleCancel(s.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end md:self-center"
                    title="Hủy lịch"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4">
          <Bell className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="text-sm text-amber-800 leading-relaxed font-medium">
            <strong>Ghi chú:</strong> Vui lòng có mặt trước 5-10 phút để khởi động. Nếu muốn thay đổi lịch, hãy hủy và đặt lại ít nhất 2 tiếng trước giờ tập.
          </div>
        </div>
      </div>
    </div>
  );
}