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
        // Lấy tất cả workout histories
        const historiesRes = await getWorkoutHistories();
        const histories = historiesRes.data.data || historiesRes.data || [];
        setWorkoutHistories(histories);
        // Lấy chi tiết cho mỗi workout
        const detailsMap = {};
        for (const history of histories) {
          try {
            const detailRes = await getWorkoutHistoryDetails(history.id);
            detailsMap[history.id] = detailRes.data.data || detailRes.data || [];
          } catch (err) {
            console.error(`Lỗi lấy chi tiết workout ${history.id}:`, err);
            detailsMap[history.id] = [];
          }
        }
        setWorkoutDetails(detailsMap);
      } catch (err) {
        console.error("Lỗi load workout history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutData();
  }, []);

  // Lấy workout cho ngày cụ thể
  const getWorkoutByDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return workoutHistories.filter((w) => {
      const workoutDate = new Date(w.created_at).toISOString().split("T")[0];
      return workoutDate === dateString;
    });
  };

  // Lấy chi tiết bài tập cho workout cụ thể
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
