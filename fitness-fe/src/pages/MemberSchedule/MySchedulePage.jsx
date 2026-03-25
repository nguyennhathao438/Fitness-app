import React, { useEffect, useState } from "react";
import { getMySchedules, cancelMySchedule } from "../../services/member/MemberService";
import { toast } from "react-toastify";
import { getMyPT } from "../../services/member/MemberService";

import { 
  Calendar, 
  Clock, 
  X, 
  Bell, 
  Zap, 
  MapPin, 
  AlertTriangle,
  Info
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export default function MySchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null); // Lưu ID lịch đang chờ xác nhận hủy
const [myPT, setMyPT] = useState(null);
  useEffect(() => { loadData();loadPT(); }, []);
const loadPT = async () => {
  try {
    const res = await getMyPT();
    if (res.data?.has_pt) {
      setMyPT(res.data.pt);
    }
  } catch (err) {
    console.log(err);
  }
};
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getMySchedules();
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

  const confirmCancel = async () => {
    if (!cancelingId) return;
    try {
      await cancelMySchedule(cancelingId);
      toast.success("Đã hủy lịch tập thành công");
      setCancelingId(null);
      loadData();
    } catch (err) {
  const message =
    err?.response?.data?.message ||
    "Hủy lịch thất bại";

  toast.error(message);
  setCancelingId(null);
}
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );

  const nextSession = schedules[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DESIGN SYSTEM */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              Lịch tập của tôi
            </h1>
            <p className="text-slate-500 font-medium mt-1">Theo dõi và quản lý lộ trình tập luyện cá nhân</p>
          </div>
        </div>

        {/* NEXT SESSION HIGHLIGHT - HERO CARD */}
        {nextSession && (
          <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-6 md:p-10 mb-10 text-white shadow-xl shadow-purple-900/20 group">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-[0.2em]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                  </span>
                  Sắp diễn ra
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                  {format(parseISO(nextSession.date), "EEEE, dd/MM", { locale: vi })}
                </h2>
                <div className="flex flex-wrap items-center gap-6 text-slate-300 font-bold">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <Clock className="w-4 h-4 text-purple-400" /> {nextSession.start_time} - {nextSession.end_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> 
                    <span>Huấn luyện viên: <span className="text-white">{myPT?.name}</span></span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setCancelingId(nextSession.id)}
                className="bg-white text-slate-900 hover:bg-red-500 hover:text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                Hủy buổi tập này
              </button>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-purple-600/30 transition-all duration-700" />
          </div>
        )}

        {/* DETAILED SCHEDULE LIST */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Chi tiết lộ trình
                <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                  {schedules.length} Buổi tập
                </span>
              </h3>
            </div>

            {schedules.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Calendar className="w-10 h-10" />
                </div>
                <h4 className="text-slate-900 font-black text-lg">Chưa có lịch tập</h4>
                <p className="text-slate-500 font-medium">Lịch tập của bạn sẽ xuất hiện tại đây sau khi đăng ký.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((s, idx) => (
                  <div key={s.id} className="group relative bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl p-5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 ${idx === 0 ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                        <span className="text-[10px] font-black uppercase leading-none mb-1">{format(parseISO(s.date), "MMM")}</span>
                        <span className="text-lg font-black leading-none">{format(parseISO(s.date), "dd")}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${idx === 0 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                            {idx === 0 ? 'Sắp diễn ra' : 'Lịch tập'}
                          </span>
                          <span className="text-slate-400 font-bold text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {s.start_time} - {s.end_time}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-800 text-lg leading-tight">
                          {format(parseISO(s.date), "EEEE, dd 'tháng' MM, yyyy", { locale: vi })}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-sm font-bold text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Fitness Center
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          <div className="text-sm font-bold text-slate-600">
                            PT: <span className="text-purple-600">{myPT?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setCancelingId(s.id)}
                      className="md:opacity-0 group-hover:opacity-100 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                      title="Hủy lịch tập"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NOTES BOX */}
        <div className="mt-10 p-6 rounded-[24px] bg-slate-100 border border-slate-200 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Info className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-sm text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-900 block mb-1">Quy định phòng tập:</strong> 
            Vui lòng có mặt đúng giờ để đảm bảo chất lượng buổi tập. Trong trường hợp có việc đột xuất, bạn nên thực hiện hủy lịch ít nhất <span className="text-purple-600 font-bold">2 tiếng</span> trước khi bắt đầu để PT sắp xếp khung giờ khác.
          </div>
        </div>
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {cancelingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setCancelingId(null)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-slate-200 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Xác nhận hủy lịch?</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Buổi tập của bạn sẽ được giải phóng cho học viên khác. Bạn chắc chắn muốn hủy khung giờ này?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setCancelingId(null)}
                className="bg-slate-100 text-slate-700 rounded-xl px-5 py-3 font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Quay lại
              </button>
              <button 
                onClick={confirmCancel}
                className="bg-red-500 text-white rounded-xl px-5 py-3 font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200"
              >
                Hủy lịch tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}