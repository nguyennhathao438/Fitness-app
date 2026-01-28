import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users } from "lucide-react";
import { getScheduleMembers } from "../../services/pt/ScheduleService";

export default function ScheduleMembersPT() {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScheduleMembers(id)
      .then((res) => {
        setMembers(res.data.data ?? res.data ?? []);
      })
      .catch((err) => {
        console.error("Load members failed:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Đang tải danh sách hội viên...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-700" />
          Hội viên đã đặt lịch
        </h2>

        <Link
          to="/pt/schedules"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại lịch
        </Link>
      </div>

      {/* Empty */}
      {members.length === 0 ? (
        <div className="text-center text-gray-500">
          Chưa có hội viên nào đặt slot này
        </div>
      ) : (
        <ul className="space-y-3">
          {members.map((m) => (
            <li
              key={m.member_id ?? m.id}
              className="bg-white border rounded-xl p-4 flex items-center gap-4"
            >
              <img
                src={m.avatar || "/avatar-default.png"}
                alt={m.name}
                className="w-12 h-12 rounded-full object-cover border"
              />

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {m.name}
                </p>
                <p className="text-sm text-gray-500">
                  {m.email || m.phone || "—"}
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Đã đặt
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
