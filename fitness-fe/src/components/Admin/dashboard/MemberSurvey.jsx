import { getSurveyMember } from "@/services/admin/Survey";
import { useEffect, useState, Fragment } from "react";

export default function MemberSurvey() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const slots = ["earlymorning", "morning", "afternoon", "evening", "all_time"];

  const getColor = (count) => {
    if (count < 3) return "bg-purple-200";
    if (count <= 5) return "bg-purple-400";
    return "bg-purple-700";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSurveyMember();
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 rounded-xl">
      {/* Header */}
      <div className="mb-4 max-sm:-ml-3">
        <h3 className="font-semibold text-lg">
          Member Training Time Destiny
        </h3>
        <p className="text-sm text-gray-500">
          Analyze popular training days and time slots
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 text-sm">
        {/* Empty corner */}
        <div></div>

        {/* Days header */}
        {days.map((day) => (
          <div
            key={day}
            className="text-center font-semibold uppercase text-gray-600 max-sm:ml-3"
          >
            {day}
          </div>
        ))}

        {/* Slots + cells */}
        {slots.map((slot) => (
          <Fragment key={slot}>
            {/* Slot name */}
            <div className="font-semibold capitalize text-gray-600 max-sm:-ml-10">
              {slot}
            </div>

            {/* Cells */}
            {days.map((day) => {
              const value = data?.[day]?.[slot] ?? 0;

              return (
                <div
                  key={`${day}-${slot}`}
                  className={`h-10 flex items-center justify-center font-bold 
                    ${
                      loading
                        ? "bg-gray-200 animate-pulse"
                        : getColor(value)
                    }
                  `}
                >
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-purple-200"></span>
          <span>0-3 members</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-purple-400"></span>
          <span>4-5 members</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-purple-700"></span>
          <span>5+ members</span>
        </div>
      </div>
    </div>
  );
}
