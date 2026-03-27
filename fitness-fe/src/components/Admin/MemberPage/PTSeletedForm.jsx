import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getPTActice } from "../../../services/admin/PersonalTrainerService";
import defaultAvatar from "@/assets/default-avatar.jpg";

export default function PTSelectedForm({ onSubmit }) {
  const [ptList, setPtList] = useState([]);
  const [selectedPT, setSelectedPT] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch PT active
  useEffect(() => {
    const fetchPT = async () => {
      try {
        setLoading(true);
        const res = await getPTActice();
        setPtList(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPT();
  }, []);

    const handleSubmit = () => {
    if (!selectedPT) return;
    onSubmit(selectedPT); // trả pt_id
    };


  return (
    <div className="w-full max-w-4xl bg-white rounded-xl p-6 space-y-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 ">
        Chọn huấn luyện viên
      </h2>

      {/* List */}
      <div className="border rounded-xl p-4 max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : ptList.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Không có huấn luyện viên khả dụng
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ptList.map(pt => {
              const active = selectedPT === pt.id;

              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPT(pt.id)}
                  className={`
                    relative cursor-pointer rounded-xl border p-4
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-md
                    ${
                      active
                        ? "border-purple-500 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-purple-300"
                    }
                  `}
                >
                  {/* Tick */}
                  {active && (
                    <div className="
                      absolute top-2 right-2 size-6
                      rounded-full bg-purple-500 text-white
                      flex items-center justify-center
                    ">
                      <CheckIcon size={14} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <img
                      src={pt.avatar || defaultAvatar}
                      className="size-16 rounded-full object-cover"
                    />
                    <div className="font-semibold text-gray-800">
                      {pt.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pt.email}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          disabled={!selectedPT}
          onClick={handleSubmit}
          className="
            px-5 py-2 rounded-lg
            bg-purple-600 text-white
            hover:bg-purple-700 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Gắn PT
        </button>
      </div>
    </div>
  );
}
