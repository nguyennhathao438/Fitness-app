import React, { useEffect, useState } from "react";
import { startOfWeek, addDays, format, isSameDay, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import { 
  User, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  Zap,
  Dumbbell,
  Clock,
  Info,
  AlertCircle,
  MessageCircleMoreIcon
} from "lucide-react";
import {
  getMyPT,
  getPTList,
  choosePT,
  getMemberSchedules,
  registerSchedule,
} from "../../services/member/MemberService";
import Dialog from "@/components/Admin/Dialog";
import { getPTChat } from "@/services/member/Message";
import ProfileMessage from "@/components/member/ProfileMessage";
import NoPermissionModal from "@/components/utils/NoPermissionModel";
import { useSelector } from "react-redux";

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 80; 

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [pt, setPt] = useState(null);
  const roles = useSelector((state) => state.auth.roles) || [];
  const permissions = useSelector((state) => state.auth.permissions) || [];
  const [openNoPermission, setOpenNoPermission] = useState(false);
  const canReadRole = roles.includes("Member_vip");
  const canReadPermission = permissions.includes("message_user.read");
  useEffect(() => { checkMyPT(); fetchPT();}, []);
  useEffect(() => { if (myPT) loadSchedules(); }, [weekStart, myPT]);

  const fetchPT = async () => {
    try {
      const res = await getPTChat();
        setPt(res.data[0]);
    } catch (error) {
      console.log("lỗi không lấy được pt chat",error)
    }
  };
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
      setScheduleLoading(true);
      const start = format(weekStart, "yyyy-MM-dd");
      const end = format(addDays(weekStart, 6), "yyyy-MM-dd");
      const res = await getMemberSchedules(start, end);
      setSchedules(res.data?.data || []);
    } catch (err) {
      toast.error("Không tải được lịch");
    } finally {
      setTimeout(() => setScheduleLoading(false), 400);
    }
  };

  const handleRegister = (schedule) => {
    setSelectedSchedule(schedule);
    setConfirmOpen(true);
  };

  const confirmRegister = async () => {
    try {
      await registerSchedule(selectedSchedule.id);
      toast.success("Đăng ký lịch tập thành công!");
      setConfirmOpen(false);
      setSelectedSchedule(null);
      loadSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const DAYS = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return { date, labelDay: format(date, "EEEE", { locale: vi }), labelDate: format(date, "dd/MM") };
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-bold tracking-tight">Đang tải dữ liệu huấn luyện viên...</p>
    </div>
  );

  // ===============================
  // ===== GIAO DIỆN CHỌN PT =======
  // ===============================
  if (!myPT) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER DESIGN SYSTEM */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Dumbbell className="w-8 h-8 text-purple-600" />
                Tìm Huấn Luyện Viên
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Chọn người đồng hành phù hợp để bắt đầu hành trình thay đổi vóc dáng.
              </p>
            </div>
          </div>

          {/* GRID SYSTEM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ptList.map((pt) => (
              <div key={pt.id} className="group bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/60 border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-slate-100 rounded-[24px] flex items-center justify-center mb-6 ring-4 ring-slate-50 group-hover:bg-purple-600 group-hover:ring-purple-100 transition-all duration-300">
                    <User className="w-8 h-8 text-slate-400 group-hover:text-white" />
                  </div>
                  
                  <h2 className="text-xl font-black text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">{pt.name}</h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                    {pt.specialty || "Expert Trainer"}
                  </p>
                  
                  <button
                    onClick={() => handleChoosePT(pt.id)}
                    className="mt-auto w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                  >
                    Bắt đầu tập luyện
                    <Zap className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {ptList.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[32px] border border-slate-200 shadow-sm mt-8">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Không có PT sẵn sàng</h3>
                <p className="text-slate-500 font-medium">Vui lòng quay lại sau ít phút.</p>
              </div>
          )}
        </div>
      </div>
    );
  }

  // ===============================
  // ===== GIAO DIỆN ĐĂNG KÝ LỊCH ==
  // ===============================
  return (
    <>
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DESIGN SYSTEM */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Đã kết nối PT
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Lịch tập cùng {myPT.name}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Đăng ký các khung giờ trống để huấn luyện viên hướng dẫn bạn.</p>
          </div>
          {/* DATE NAVIGATION */}
          <div className="sm:ml-96 relative">
            <button 
              onClick={() => {
                if (canReadRole && canReadPermission) {
                  setOpenMessage(true);
                } else {
                  setOpenNoPermission(true);
                }
              }}
              className="max-sm:absolute top-7 left-80 px-3 py-3 bg-purple-400 rounded-full hover:bg-purple-300"
            >
              <MessageCircleMoreIcon/>
            </button>
          </div>
          {/* DATE NAVIGATION */}
          <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 self-start md:self-center">
            <button 
              onClick={() => setWeekStart(addDays(weekStart, -7))} 
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 font-black text-slate-900 text-sm min-w-[180px] text-center uppercase tracking-tighter">
              {format(weekStart, "dd MMM", { locale: vi })} – {format(addDays(weekStart, 6), "dd MMM", { locale: vi })}
            </div>
            <button 
              onClick={() => setWeekStart(addDays(weekStart, 7))} 
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LEGEND BOX */}
        <div className="flex flex-wrap gap-6 mb-8 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-300" /> Sẵn sàng đăng ký
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <div className="w-4 h-4 rounded-md bg-slate-200 border border-slate-300" /> Đã kín lịch
          </div>
        </div>

        {/* CALENDAR DESIGN SYSTEM */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden relative">
          {scheduleLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Đang đồng bộ...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-[80px_repeat(7,1fr)] overflow-x-auto min-w-[900px]">
            {/* Header Spacer */}
            <div className="border-b border-r border-slate-100 bg-slate-50/50" />

            {/* Days Column Header */}
            {DAYS.map((d, i) => {
              const isToday = isSameDay(d.date, new Date());
              return (
                <div key={i} className={`text-center py-6 border-b border-r last:border-r-0 border-slate-100 ${isToday ? "bg-purple-50/30" : ""}`}>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? "text-purple-600" : "text-slate-400"}`}>
                    {d.labelDay.replace("Thứ ", "T")}
                  </div>
                  <div className={`text-2xl font-black ${isToday ? "text-purple-600" : "text-slate-900"}`}>
                    {format(d.date, "dd")}
                  </div>
                </div>
              );
            })}

            {/* Time Indicator Column */}
            <div className="bg-slate-50/30 border-r border-slate-100">
              {HOURS.map((h) => (
                <div key={h} style={{ height: HOUR_HEIGHT }} className="flex items-start justify-center pt-3 text-[11px] font-bold text-slate-400 tabular-nums">
                  {h}:00
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            {DAYS.map((d) => (
              <div key={format(d.date, "yyyy-MM-dd")} className="relative border-r last:border-r-0 border-slate-100 group/col" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                {HOURS.map((_, i) => (
                  <div key={i} style={{ height: HOUR_HEIGHT }} className="border-b border-slate-50 last:border-b-0" />
                ))}

                {/* Event Cards */}
                {schedules
                  .filter((s) => s.date === format(d.date, "yyyy-MM-dd"))
                  .map((s) => {
                    const top = (minutesFromStart(s.start_time) / 60) * HOUR_HEIGHT;
                    const height = ((timeToMinutes(s.end_time) - timeToMinutes(s.start_time)) / 60) * HOUR_HEIGHT;
                    const memberId = Number(s.member?.id ?? s.member_id ?? 0);
const isBooked = memberId !== 0;

// kiểm tra thời gian đã qua
const now = new Date();
const scheduleTime = new Date(`${s.date}T${s.start_time}`);
const isPast = scheduleTime < now;

                    return (
                      <div
                        key={s.id}
                        style={{ top: top + 4, height: height - 8, left: 6, right: 6 }}
onClick={() => !isBooked && !isPast && handleRegister(s)}                        className={`absolute z-10 p-3 rounded-2xl flex flex-col justify-between transition-all duration-300 group/item overflow-hidden
                          ${isBooked || isPast
                            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-pointer hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-0.5"
                          }`}
                      >
                        <div className="flex items-center justify-between relative z-10">
                          <span className={`text-[10px] font-black tabular-nums ${isBooked ? "text-slate-400" : "text-emerald-500 group-hover/item:text-emerald-100"}`}>
                            {s.start_time}
                          </span>
                         {isBooked || isPast ? <Lock className="w-3 h-3 text-slate-300" /> : <Zap className="w-3 h-3 opacity-50 fill-current" />}
                        </div>

                        <div className="font-black text-[10px] uppercase tracking-wider relative z-10">
                          {isPast ? "Đã qua"
 : isBooked ? "Đã kín"
 : "Đặt lịch ngay"}
                        </div>
                        
                        {!isBooked && (
                          <div className="absolute bottom-[-10px] right-[-10px] opacity-10 group-hover/item:scale-150 transition-transform duration-500">
                             <Dumbbell className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM HELPER DESIGN */}
        <div className="mt-10 p-6 rounded-[24px] bg-slate-100 border border-slate-200 flex items-start gap-4">
          <Info className="w-6 h-6 text-slate-400 shrink-0" />
          <div className="text-sm text-slate-500 leading-relaxed font-medium">
            <strong>Ghi chú đăng ký:</strong> Lịch tập sẽ được chốt sau khi PT xác nhận. Nếu bạn cần dời lịch hoặc hủy buổi tập, vui lòng thông báo cho PT trước ít nhất 2 giờ để đảm bảo quyền lợi và sắp xếp khung giờ mới.
          </div>
        </div>

        {/* CONFIRMATION MODAL DESIGN SYSTEM */}
        {confirmOpen && selectedSchedule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmOpen(false)} />
            
            <div className="relative bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-purple-50 rounded-[24px] flex items-center justify-center mb-6">
                <CalendarIcon className="w-8 h-8 text-purple-600" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Xác nhận đặt lịch</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Bạn đang thực hiện đăng ký lịch tập cùng huấn luyện viên <span className="text-slate-900 font-bold">{myPT.name}</span> vào lúc:
                <span className="block mt-2 px-4 py-3 bg-slate-50 rounded-2xl text-purple-600 font-black text-lg">
                  {format(parseISO(selectedSchedule.date), "EEEE, dd/MM", { locale: vi })}
                  <span className="mx-2 text-slate-300">|</span>
                  {selectedSchedule.start_time} - {selectedSchedule.end_time}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition-all active:scale-95"
                >
                  Để sau
                </button>
                <button
                  onClick={confirmRegister}
                  className="px-5 py-3.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold shadow-lg shadow-purple-200 transition-all active:scale-95"
                >
                  Xác nhận đặt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    <Dialog open={openMessage} onClose={() => setOpenMessage(false)} width="max-w-2xl">
      <div className="p-6 h-[600px]">
        <ProfileMessage pt={pt} />
      </div>
    </Dialog>

    <NoPermissionModal
      open={openNoPermission}
      onClose={() => setOpenNoPermission(false)}
    />
    </>
  );
}