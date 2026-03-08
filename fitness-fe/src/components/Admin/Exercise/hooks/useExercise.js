import { useEffect, useState } from "react";
import { getExercises } from "../../../../services/admin/Exercise";
import { getAllMuscleGroup } from "../../../../services/admin/MuscleGroup";
import { getExercisesByMuscleGroup } from "../../../../services/admin/Exercise"
const useExercise = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [muscleList, setMuscleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMuscle, setLoadingMuscle] = useState(true);

  const fetchAllExercises = async () => {
    setLoading(true);
    try {
      const res = await getExercises({ per_page: 999 });
      setExerciseList(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchByMuscle = async (muscleId) => {
    setLoading(true);
    try {
      const res = await getExercisesByMuscleGroup(muscleId);
      setExerciseList(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [exRes, muscleRes] = await Promise.all([
          getExercises({ per_page: 999 }),
          getAllMuscleGroup(),
        ]);

        setExerciseList(exRes.data.data);
        setMuscleList(muscleRes.data);
      } catch (err) {
        console.error("Lỗi load data:", err);
      } finally {
        setLoading(false);
        setLoadingMuscle(false)
      }
    };

    fetchAll();
  }, []);

  return {
    exerciseList,
    muscleList,
    loading,
    loadingMuscle,
    setLoading,
    fetchAllExercises,
    fetchByMuscle,
  };
};

export default useExercise;
