import { useEffect, useState } from "react";
import { getWorkoutHistories } from "../../../../services/member/WorkoutHistory";
import { getWorkoutHistoryDetails } from "../../../../services/member/WorkoutHistoryDetail";

const useWorkoutHistory = () => {
  const [workoutHistories, setWorkoutHistories] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      setLoading(true);

      try {
        const historiesRes = await getWorkoutHistories();
        const histories = historiesRes.data.data || historiesRes.data || [];

        setWorkoutHistories(histories);

        const detailRequests = histories.map((history) =>
          getWorkoutHistoryDetails(history.id)
            .then((res) => ({
              id: history.id,
              data: res.data.data || res.data || [],
            }))
            .catch((err) => {
              console.error(`Lỗi lấy chi tiết workout ${history.id}`, err);
              return { id: history.id, data: [] };
            })
        );

        const results = await Promise.all(detailRequests);

        const detailsMap = {};

        results.forEach((r) => {
          detailsMap[r.id] = r.data;
        });

        setWorkoutDetails(detailsMap);
      } catch (err) {
        console.error("Lỗi load workout history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, []);

  function formatDateLocal(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const getWorkoutByDate = (date) => {
    const dateString = formatDateLocal(date);

    return workoutHistories.filter((w) => {
      const workoutDate = formatDateLocal(w.created_at);
      return workoutDate === dateString;
    });
  };

  const getDetailsForWorkout = (workoutId) => {
    return workoutDetails[workoutId] || [];
  };

  return {
    workoutHistories,
    workoutDetails,
    loading,
    getWorkoutByDate,
    getDetailsForWorkout,
  };
};

export default useWorkoutHistory;