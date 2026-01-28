import { useState } from "react";
import { useParams } from "react-router-dom";
import { createSchedule } from "../../services/pt/ScheduleService";

export default function CreateSchedulePT() {
  const { ptId } = useParams();

  const [form, setForm] = useState({
    day_of_week: 1,
    start_time: "",
    end_time: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (form.end_time <= form.start_time) {
      alert("Giờ kết thúc phải lớn hơn giờ bắt đầu");
      return;
    }

    try {
      await createSchedule(ptId, {
        ...form,
        day_of_week: Number(form.day_of_week),
      });

      alert("Tạo lịch thành công");

      setForm({
        day_of_week: 1,
        start_time: "",
        end_time: "",
      });
    } catch (e) {
      alert(e.response?.data?.message || "Lỗi tạo lịch");
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Tạo lịch làm việc PT</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Thứ</label>
          <select
            className="border p-2 w-full rounded"
            value={form.day_of_week}
            onChange={(e) =>
              setForm({ ...form, day_of_week: e.target.value })
            }
          >
            <option value={1}>Thứ 2</option>
            <option value={2}>Thứ 3</option>
            <option value={3}>Thứ 4</option>
            <option value={4}>Thứ 5</option>
            <option value={5}>Thứ 6</option>
            <option value={6}>Thứ 7</option>
            <option value={0}>Chủ nhật</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Giờ bắt đầu</label>
          <input
            type="time"
            className="border p-2 w-full rounded"
            value={form.start_time}
            onChange={(e) =>
              setForm({ ...form, start_time: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Giờ kết thúc</label>
          <input
            type="time"
            className="border p-2 w-full rounded"
            value={form.end_time}
            onChange={(e) =>
              setForm({ ...form, end_time: e.target.value })
            }
            required
          />
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
          Lưu lịch
        </button>
      </form>
    </div>
  );
}
