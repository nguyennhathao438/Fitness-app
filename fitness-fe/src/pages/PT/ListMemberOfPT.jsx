import { useEffect, useState } from "react";
import { Users, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getMembersOfPT } from "../../services/pt/PtService";

export default function ListMemberOfPT() {
  const { ptId } = useParams(); // ✅ lấy từ route
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // ⚠️ KHÔNG cần ptId nếu BE lấy từ token
    getMembersOfPT()
      .then((res) => {
        setMembers(res.data.data || []);
      })
      .catch((err) => {
        console.error("Load members failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Đang tải danh sách học viên...
      </div>
    );
  }

  return (
    <section className="py-10 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-700" />
            Học viên của tôi
          </h2>

          <span className="text-sm text-gray-500">
            Tổng: {members.length} học viên
          </span>
        </div>

        {/* Quick actions */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/pt/${ptId}/schedules`)}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
          >
            📅 Quản lý lịch PT
          </button>
        </div>

        {/* Empty */}
        {members.length === 0 ? (
          <div className="text-center text-gray-500">
            Bạn chưa có học viên nào
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <div
                key={m.member_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
              >
                {/* Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={m.avatar || "/avatar-default.png"}
                    alt={m.name}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {m.name}
                    </h3>
                    <p className="text-sm text-gray-500">{m.phone}</p>
                  </div>
                </div>

                {/* Target */}
                <div className="mb-3">
                  <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    🎯 {m.target_type || "Chưa khảo sát"}
                  </span>
                </div>

                {/* Status */}
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Trạng thái</span>
                    <span
                      className={`font-medium ${
                        m.status === "active"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {m.status === "active" ? "Đang tập" : "Hết hạn"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Hết hạn</span>
                    <span>{m.end_date || "--"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Buổi gần nhất</span>
                    <span>{m.last_training || "Chưa có"}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() =>
                    navigate(`/pt/${ptId}/members/${m.member_id}`)
                  }
                  className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold text-purple-700 border border-purple-700 rounded-lg py-2 hover:bg-purple-50 transition"
                >
                  Xem chi tiết
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
