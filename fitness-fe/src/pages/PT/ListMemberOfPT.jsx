import { useEffect, useState } from "react";
import { Users, ChevronRight, Phone, Mail, Search } from "lucide-react";
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

  // Lọc học viên theo tên
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải danh sách học viên...</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-8 h-8 text-purple-700" />
              </div>
              Học viên của tôi
            </h2>
            <p className="text-slate-500 mt-2">Quản lý và theo dõi tiến độ tập luyện của học viên.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm tên học viên..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
               <span className="text-sm font-semibold text-purple-700">{members.length}</span>
               <span className="text-sm text-slate-500 ml-1 font-medium">Tổng số</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Không tìm thấy học viên</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              {searchTerm ? "Không có kết quả nào khớp với tìm kiếm của bạn." : "Khi học viên đăng ký với bạn, họ sẽ xuất hiện tại đây."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className="group bg-white rounded-2xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Trang trí góc card */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 opacity-50" />

                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={m.avatar || "https://ui-avatars.com/api/?name=" + m.name}
                      alt={m.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-purple-50 transition-all shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm" title="Active"></div>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-purple-700 transition-colors">
                    {m.name}
                  </h3>
                  
                  <div className="flex flex-col gap-1 mt-3 w-full">
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm italic">
                      <Phone className="w-3 h-3" />
                      {m.phone || "N/A"}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/pt/members/${m.id}`)}
                    className="mt-6 w-full flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-slate-900 rounded-xl py-3 hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-purple-200"
                  >
                    Hồ sơ chi tiết
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