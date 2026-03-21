import { getScheduleOfMember} from "@/services/admin/Schedule";
import { useEffect, useState } from "react";

export default function MemberScheduleInfoTab({ member }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // ngày thứ 2 của tuần hiện tại
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay(); // 0-Chủ nhật, 1-Thứ 2...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // Lấy lịch Member theo id
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const res = await getScheduleOfMember(member);
        setSchedules(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  fetchSchedules();
  }, [member]);

  // nút tuần trước / tuần sau
  const prevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const nextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  // mảng 7 ngày của tuần
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const weekDays = getWeekDays();

  // nhóm lịch theo ngày
  const schedulesByDate = weekDays.map(day => {
    const dateStr = day.toISOString().split("T")[0]; // yyyy-mm-dd
    const daySchedules = schedules.filter(sch => sch.date === dateStr);
    return { day, schedules: daySchedules };
  });

  // chia ra 3 hàng: [0,1,2], [3,4,5], [6]
  const rows = [
    schedulesByDate.slice(0, 3),
    schedulesByDate.slice(3, 6),
    schedulesByDate.slice(6, 7),
  ];

  return (
    <div className="p-4">
      {/* Nút tuần trước / tuần sau */}
      <div className="mb-4 flex justify-between items-center gap-2">
        <button
          onClick={prevWeek}
          className="px-3 py-1 rounded-xl font-medium bg-gradient-to-r from-purple-50 via-pink-50 text-gray-500
           hover:opacity-40 transition"
        >
          Tuần trước
        </button>
        <span className="font-bold max-sm:ml-16">
          {weekStart.toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
        </span>
        <button
          onClick={nextWeek}
          className="px-3 py-1 rounded-xl font-medium bg-gradient-to-r from-purple-50 via-pink-50 text-gray-500
           hover:opacity-40 transition"
        >
          Tuần sau
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : schedules.length === 0 ? (
        <p>Chưa có lịch nào.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map(({ day, schedules }) => (
                <div
                  key={day.toISOString()}
                  className="flex-1 rounded p-2 h-48 overflow-auto rounded-xl border
                            transition-shadow duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <p className="font-bold mb-1 text-center">
                    {day.toLocaleDateString("vi-VN", {
                      weekday: "short",
                      day: "numeric",
                      month: "numeric",
                    })}
                  </p>

                  {schedules.length === 0 ? (
                    <p className="text-sm text-gray-400">Không có lịch</p>
                  ) : (
                    schedules.map(sch => (
                      <div
                        key={sch.id}
                        className="mb-1 p-1 border rounded text-sm
                                  bg-gradient-to-r from-purple-50 via-fuchsia-100
                                  transition-colors duration-200 cursor-pointer"
                      >
                        <p className="font-semibold">
                          {sch.member ? sch.member.name : "Chưa có member"}
                        </p>
                        <p>
                          {sch.start_time.slice(0, 5)} - {sch.end_time.slice(0, 5)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ))}

              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, idx) => (
                  <div key={idx} className="flex-1"></div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}