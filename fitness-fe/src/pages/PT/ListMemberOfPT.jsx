import { useEffect, useState } from "react";
import { Users, ChevronRight, Phone, Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPTMembers } from "../../services/pt/PtService";

export default function ListMemberOfPT() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPTMembers()
      .then((res) => {
        setMembers(res.data || []);
      })
      .catch((err) => console.error("Load members failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Đang tải danh sách học viên...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Học viên của tôi
              </h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">
              Quản lý và theo dõi tiến độ tập luyện của đội ngũ học viên.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm học viên..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-lg font-bold text-purple-600">{members.length}</span>
              <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Tổng số</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Không tìm thấy học viên</h3>
            <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium">
              {searchTerm 
                ? "Không có kết quả nào khớp với tìm kiếm của bạn. Vui lòng thử lại với tên khác." 
                : "Danh sách hiện đang trống. Khi học viên đăng ký với bạn, họ sẽ xuất hiện tại đây."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className="group bg-white rounded-[32px] border border-slate-200 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1.5 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Subtle Decorative Element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[80px] -z-0 transition-colors group-hover:bg-purple-50" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="relative mb-5">
                    <img
                      src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=f3e8ff&color=7e22ce&bold=true`}
                      alt={m.name}
                      className="w-24 h-24 rounded-[28px] object-cover ring-8 ring-slate-50 group-hover:ring-purple-100 transition-all duration-300 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" title="Active"></div>
                  </div>

                  <h3 className="font-black text-slate-900 text-xl group-hover:text-purple-600 transition-colors duration-300">
                    {m.name}
                  </h3>
                  
                  <div className="mt-2 px-3 py-1 bg-slate-100 rounded-full group-hover:bg-purple-50 transition-colors">
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-purple-700 text-xs font-bold uppercase tracking-widest">
                      <Phone className="w-3 h-3" />
                      {m.phone || "Chưa cập nhật"}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/pt/members/${m.id}`)}
                    className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 rounded-2xl py-4 hover:bg-purple-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-purple-200"
                  >
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}