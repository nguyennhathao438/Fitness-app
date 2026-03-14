import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  ChevronRight,
  Activity,
  ClipboardList,
  Scale
} from "lucide-react";

import { getMemberDetail } from "../../services/pt/PtService";

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemberDetail(id)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  const member = data.member;
  const sessions = data.sessions;
  const upcoming = data.upcoming_sessions;
  const pkg = data.package;
  const metrics = data.body_metrics;

  const progress =
    sessions.total > 0
      ? Math.round((sessions.completed / sessions.total) * 100)
      : 0;

  const bmi =
    metrics && metrics.height
      ? (metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1)
      : null;

  return (
    // GLOBAL PAGE LAYOUT
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-slate-500 hover:text-purple-600 font-semibold transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
          Quay lại danh sách
        </button>

        {/* HEADER DESIGN SYSTEM */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <User className="text-purple-600 w-8 h-8" />
              Chi tiết Hội viên
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Quản lý thông tin và tiến trình tập luyện của hội viên
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Profile & Main Stats */}
          <div className="flex flex-col gap-8">
            
            {/* CARD: PROFILE */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 p-8 text-center">
              <img
                src={
                  member.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                  )}&background=7c3aed&color=fff`
                }
                alt={member.name}
                className="w-32 h-32 rounded-[24px] mx-auto mb-6 ring-4 ring-slate-50 object-cover shadow-md"
              />

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{member.name}</h2>
              <span className="inline-block mt-3 px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Active Member
              </span>

              <div className="mt-8 space-y-3 text-left">
                <Info icon={<Mail size={16} className="text-slate-400" />} label="Email" value={member.email} />
                <Info
                  icon={<Phone size={16} className="text-slate-400" />}
                  label="Điện thoại"
                  value={member.phone || "Chưa cập nhật"}
                />
              </div>
            </div>

            {/* CARD: PACKAGE SUMMARY */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 p-6">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <Activity size={18} className="text-purple-600" />
                Thông tin Gói tập
              </h3>

              <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100">
                <p className="font-black text-slate-800 text-lg">{pkg?.name || "N/A"}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">Tên gói dịch vụ</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Stat label="Đã tập" value={sessions.completed} color="emerald" />
                <Stat label="Còn lại" value={sessions.remaining} color="purple" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Progress & Body Metrics */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* CARD: PROGRESS */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 p-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Tiến độ lộ trình</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Tỷ lệ hoàn thành buổi tập</p>
                </div>
                <span className="text-purple-600 text-3xl font-black italic">
                  {progress}%
                </span>
              </div>

              <div className="bg-slate-100 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {sessions.completed} / {sessions.total} buổi tập hoàn thành
                </p>
              </div>
            </div>

            {/* CARD: BODY METRICS */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 p-8">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Scale className="text-purple-600" />
                Chỉ số cơ thể (Body Metrics)
              </h3>

              {metrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Metric label="Cân nặng" value={metrics.weight} unit="kg" />
                  <Metric label="Chiều cao" value={metrics.height} unit="cm" />
                  <Metric label="BMI" value={bmi} highlight />
                  <Metric label="Cơ bắp" value={metrics.muscle} unit="%" />
                  <Metric label="Mỡ cơ thể" value={metrics.body_fat} unit="%" />
                  <Metric label="Mỡ nội tạng" value={metrics.visceral_fat} />
                  <Metric label="Nước" value={metrics.body_water} unit="%" />
                </div>
              ) : (
                /* Empty State for Metrics */
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic text-sm">Chưa có dữ liệu đo lường chỉ số</p>
                </div>
              )}
            </div>

            {/* CARD: UPCOMING SESSIONS */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <ClipboardList className="text-purple-600" />
                  Lịch tập sắp tới
                </h3>
              </div>

              {upcoming.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                   <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-slate-300 w-8 h-8" />
                  </div>
                  <p className="font-semibold">Chưa có lịch tập được sắp xếp</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 p-2">
                  {upcoming.map((s) => (
                    <div
                      key={s.id}
                      className="group flex items-center justify-between p-6 rounded-[24px] hover:bg-slate-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-[18px] flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm shadow-purple-200/50">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.date}</p>
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm mt-0.5">
                            <Clock size={14} className="text-slate-400" />
                            {s.start_time} - {s.end_time}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* UI COMPONENTS (Maintain logic, update styling) */

function Metric({ label, value, unit, highlight = false }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all hover:shadow-md ${highlight ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-100'}`}>
      <p className={`text-2xl font-black tracking-tight ${highlight ? 'text-purple-600' : 'text-slate-900'}`}>
        {value} <span className="text-sm font-bold text-slate-400">{unit}</span>
      </p>
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{label}</p>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">{label}</p>
        <p className="font-bold text-slate-700 text-sm truncate">{value}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100"
  };

  return (
    <div className={`p-5 rounded-2xl text-center border transition-transform hover:-translate-y-1 ${colors[color]}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-70">{label}</p>
    </div>
  );
}