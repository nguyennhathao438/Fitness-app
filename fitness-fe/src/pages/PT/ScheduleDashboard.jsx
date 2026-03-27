import { useEffect, useState } from "react";
import { startOfWeek, addDays, format, subWeeks, addWeeks } from "date-fns";
import { toast } from "react-toastify";
import CreateEditScheduleModal from "./CreateEditScheduleModal";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
} from "../../services/pt/ScheduleService";

/**
 * =========================
 * CONSTANT
 * =========================
 */
const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 56;

/**
 * =========================
 * HELPERS
 * =========================
 */
const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const minutesFromStart = (time) => timeToMinutes(time) - START_HOUR * 60;

/**
 * =========================
 * COMPONENT
 * =========================
 */
export default function CalendarPT() {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const [schedules, setSchedules] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [editing, setEditing] = useState(null);
  const [popupPos, setPopupPos] = useState(null);

  const [direction, setDirection] = useState("right");
  const [animating, setAnimating] = useState(false);

  /**
   * =========================
   * LOAD DATA
   * =========================
   */
  useEffect(() => {
    loadData();
  }, [weekStart]);

  const loadData = async () => {
    const start = format(weekStart, "yyyy-MM-dd");
    const end = format(addDays(weekStart, 6), "yyyy-MM-dd");

    const res = await getSchedules(start, end);
    setSchedules(res.data.data || []);
  };

  /**
   * =========================
   * DATA BUILDERS
   * =========================
   */
  const HOURS = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => `${String(i + START_HOUR).padStart(2, "0")}:00`,
  );

  const DAYS = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      labelDay: format(date, "EEE"),
      labelDate: format(date, "dd/MM"),
    };
  });

  /**
   * =========================
   * POPUP POSITION
   * =========================
   */
  const calcPopupPos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 420;
    const popupHeight = 360;
    const margin = 8;

    let x = rect.right + window.scrollX + margin;
    let y = rect.top + window.scrollY;

    if (x + popupWidth > window.innerWidth) {
      x = rect.left + window.scrollX - popupWidth - margin;
    }

    if (y + popupHeight > window.innerHeight + window.scrollY) {
      y = window.innerHeight + window.scrollY - popupHeight - margin;
    }

    return { x, y };
  };

  /**
   * =========================
   * OPEN / EDIT
   * =========================
   */
  const openCreate = (e, date, hour) => {
    e.stopPropagation();
    setPopupPos(calcPopupPos(e));

    setActiveSlot({
      date,
      start_time: `${String(hour).padStart(2, "0")}:00`,
      end_time: `${String(hour + 1).padStart(2, "0")}:00`,
    });
  };

  const openEdit = (e, schedule) => {
    e.stopPropagation();
    setPopupPos(calcPopupPos(e));
    setEditing(schedule);
  };

  /**
   * =========================
   * SAVE / DELETE
   * =========================
   */
  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateSchedule(editing.id, data);
      } else {
        await createSchedule(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }

    setActiveSlot(null);
    setEditing(null);
    setPopupPos(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa lịch này?")) return;
    await deleteSchedule(id);
    setPopupPos(null);
    loadData();
  };

  /**
   * =========================
   * WEEK NAVIGATION
   * =========================
   */
  const changeWeek = (type) => {
    setAnimating(true);

    setTimeout(() => {
      if (type === "prev") {
        setDirection("left");
        setWeekStart(subWeeks(weekStart, 1));
      }

      if (type === "next") {
        setDirection("right");
        setWeekStart(addWeeks(weekStart, 1));
      }

      if (type === "current") {
        setDirection("right");
        setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
      }

      setAnimating(false);
    }, 200);
  };

  /**
   * =========================
   * RENDER
   * =========================
   */
  return (
    <div
      className="p-6"
      onClick={() => {
        setActiveSlot(null);
        setEditing(null);
        setPopupPos(null);
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-700">
            Lịch làm việc PT
          </h1>

          <div className="text-sm text-gray-500 mt-1">
            {format(weekStart, "dd/MM")} –{" "}
            {format(addDays(weekStart, 6), "dd/MM/yyyy")}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => changeWeek("prev")}
            className="border px-4 py-1.5 rounded-lg hover:bg-purple-50 transition"
          >
            ← Tuần trước
          </button>

          <button
            onClick={() => changeWeek("current")}
            className="bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
          >
            Tuần này
          </button>

          <button
            onClick={() => changeWeek("next")}
            className="border px-4 py-1.5 rounded-lg hover:bg-purple-50 transition"
          >
            Tuần sau →
          </button>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="overflow-hidden border rounded-2xl bg-white">
        <div
          className={`
            transition-all duration-200 ease-out
            ${
              animating
                ? direction === "right"
                  ? "translate-x-[-80px] opacity-0"
                  : "translate-x-[80px] opacity-0"
                : "translate-x-0 opacity-100"
            }
          `}
        >
          <div className="grid grid-cols-[80px_repeat(7,1fr)]">
            <div />

            {/* DAYS */}
            {DAYS.map((d, i) => (
              <div key={i} className="text-center py-2 border-b bg-purple-50">
                <div className="font-bold">{d.labelDay}</div>
                <div className="text-xs">{d.labelDate}</div>
              </div>
            ))}

            {/* TIME COLUMN */}
            <div className="bg-purple-50">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="h-14 border-b text-xs text-purple-600 flex items-start justify-end pr-2 pt-1"
                >
                  {h}
                </div>
              ))}
            </div>

            {/* DAY COLUMNS */}
            {DAYS.map((d) => (
              <div
                key={format(d.date, "yyyy-MM-dd")}
                className="relative border-l"
                style={{
                  height: HOURS.length * HOUR_HEIGHT,
                }}
              >
                {/* Hour slots */}
                {HOURS.map((_, i) => (
                  <div
                    key={i}
                    className="h-14 border-b hover:bg-purple-50 cursor-pointer transition"
                    onClick={(e) => openCreate(e, d.date, START_HOUR + i)}
                  />
                ))}

                {/* SCHEDULES */}
                {schedules
                  .filter((s) => s.date === format(d.date, "yyyy-MM-dd"))
                  .map((s) => {
                    const top =
                      (minutesFromStart(s.start_time) / 60) * HOUR_HEIGHT;

                    const height =
                      ((timeToMinutes(s.end_time) -
                        timeToMinutes(s.start_time)) /
                        60) *
                      HOUR_HEIGHT;

                    return (
                      <div
                        key={s.id}
                        onClick={(e) => openEdit(e, s)}
                        style={{ top, height, left: "6px", right: "6px" }}
                        className="absolute group overflow-hidden border-l-4 border-purple-500 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 cursor-pointer rounded-r-lg"
                      >
                        <div className="flex flex-col h-full p-2.5 space-y-1">
                          {/* Time Badge */}
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                              {s.start_time} – {s.end_time}
                            </span>
                          </div>

                          {/* Member Info */}
                          {s.member && (
                            <div className="flex items-center gap-2 mt-auto">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[10px]">
                                {s.member.name.charAt(0)}
                              </div>
                              <div className="text-[12px] font-medium text-slate-700 truncate group-hover:text-purple-700 transition-colors">
                                {s.member.name}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay Effect */}
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {(activeSlot || editing) && popupPos && (
        <CreateEditScheduleModal
          slot={activeSlot}
          schedule={editing}
          position={popupPos}
          onClose={() => {
            setActiveSlot(null);
            setEditing(null);
            setPopupPos(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
