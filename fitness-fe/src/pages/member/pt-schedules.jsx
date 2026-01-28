import { useEffect, useState } from "react";
import {
  getAvailableSchedules,
  bookSchedule,
} from "../../services/scheduleService";

export default function PTScheduleList({ ptId }) {
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await getAvailableSchedules(ptId, dayOfWeek);
      setSchedules(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, [dayOfWeek]);

  const handleBook = async (id) => {
    try {
      await bookSchedule(id);
      alert("Đặt lịch thành công");
      fetchSchedules(); // refresh → slot biến mất
    } catch (err) {
      alert(err.response?.data?.message || "Slot đã được đặt");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lịch PT</h2>

      <select
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value={1}>Thứ 2</option>
        <option value={2}>Thứ 3</option>
        <option value={3}>Thứ 4</option>
        <option value={4}>Thứ 5</option>
        <option value={5}>Thứ 6</option>
        <option value={6}>Thứ 7</option>
        <option value={0}>Chủ nhật</option>
      </select>

      {loading && <p>Đang tải...</p>}

      {!loading && schedules.length === 0 && (
        <p className="text-gray-500">Không có khung giờ trống</p>
      )}

      <ul className="space-y-3">
        {schedules.map((s) => (
          <li
            key={s.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <span>
              {s.start_time} - {s.end_time}
            </span>
            <button
              onClick={() => handleBook(s.id)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Đặt lịch
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
