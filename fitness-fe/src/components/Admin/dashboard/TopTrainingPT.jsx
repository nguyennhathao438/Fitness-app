import { useEffect, useState } from "react";
import { TrophyIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { getTopPT } from "@/services/admin/PersonalTrainerService";

export default function TopTraingPT() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
  const fetchPT = async () => {
    try {
      setLoading(true);
      const res = await getTopPT();
      setData(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  fetchPT();
}, []);

  return (
    <div className="bg-white rounded-xl p-1 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="p-2 rounded-lg bg-orange-100">
          <TrophyIcon className="size-5 text-orange-600" />
        </div>
        <h3 className="font-semibold max-sm:text-md md:text-xl text-gray-700">
            Top 5 PT dạy nhiều học viên nhất
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading
          ? [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))
          : data.map((item, index) => (
              <div
                key={item.pt_id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
              >
                {/* Left: rank + avatar + info */}
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`w-8 text-center font-bold ${
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                        ? "text-gray-400"
                        : index === 2
                        ? "text-amber-600"
                        : "text-gray-500"
                    }`}
                  >
                    #{index + 1}
                  </div>

                  {/* Avatar */}
                  <img
                    src={item.pt.avatar || defaultAvatar}
                    alt={item.pt.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Name + age */}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.pt.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tuổi: {item.pt.age}
                    </p>
                  </div>
                </div>

                {/* Right: active days */}
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">
                    {item.total_sessions}
                  </p>
                  <p className="text-xs text-gray-500">hội viên</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
