import { useEffect, useState } from "react";
import { getMemberSchedules } from "../../services/scheduleService";

export default function MySchedules() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    getMemberSchedules()
      .then((res) => {
        setSchedules(res.data.data ?? res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lịch đã đặt</h2>

      {schedules.length === 0 && (
        <p className="text-gray-500">Chưa có lịch nào</p>
      )}

      <ul className="space-y-3">
        {schedules.map((s) => (
          <li key={s.schedule_id} className="border p-3 rounded">
            <p>
              <b>Thứ:</b> {s.day_of_week}
            </p>
            <p>
              <b>Giờ:</b> {s.start_time} - {s.end_time}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
