import { useEffect, useState } from "react";
import { getExercises } from "../services/admin/Exercise";
import { getAllMuscleGroup } from "../services/admin/MuscleGroup";

const useExercise = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [muscleList, setMuscleList] = useState([]);
  const [loading, setLoading] = useState(true);

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
      }
    };

    fetchAll();
  }, []);

  return {
    exerciseList,
    muscleList,
    loading,
  };
};

export default useExercise;
