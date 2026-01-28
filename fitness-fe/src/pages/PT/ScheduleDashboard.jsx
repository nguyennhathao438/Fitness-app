import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMySchedules,
} from "../../services/pt/ScheduleService";

const DAY_LABEL = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

export default function ScheduleDashboardPT() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySchedules()
      .then((res) => {
        setSchedules(res.data.data ?? res.data ?? []);
      })
      .catch((err) => {
        console.error("Load schedules failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (s) => {
    if (s.is_locked) return "Đã khoá";
    if (s.is_booked) return "Đã có người đặt";
    return "Còn trống";
  };

  const getColor = (s) => {
    if (s.is_locked) return "bg-gray-100 border-gray-300";
    if (s.is_booked) return "bg-red-50 border-red-200";
    return "bg-green-50 border-green-200";
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Đang tải lịch tập...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lịch tập của PT</h1>
        <Link
          to="/pt/schedules/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tạo lịch
        </Link>
      </div>

      {/* Empty */}
      {schedules.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa tạo lịch nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border ${getColor(s)}`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">
                  {DAY_LABEL[s.day_of_week]}
                </p>
                <span className="text-sm text-gray-600">
                  {getStatus(s)}
                </span>
              </div>

              <p className="text-gray-700">
                ⏰ {s.start_time} – {s.end_time}
              </p>

              {/* Actions */}
              <div className="mt-4 flex gap-4 text-sm">
                {s.is_booked && (
                  <Link
                    to={`/pt/schedules/${s.id}/members`}
                    className="text-blue-600 hover:underline"
                  >
                    Xem hội viên
                  </Link>
                )}

                {!s.is_locked && (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() =>
                      alert("Gắn API lockSchedule ở đây")
                    }
                  >
                    Khoá slot
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
