import FilterMuscleGroup from "../../components/member/Exercise/component/FilterMuscleGroup";
import ExerciseCard from "../../components/member/Exercise/component/ExerciseCard";
import useExercise from "../../hooks/useExercise";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import ExerciseDetailModal from "@/components/member/Exercise/component/ExerciseDetailModal";
import ExerciseCart from "@/components/member/Exercise/component/ExerciseCart";
import { toast } from "react-toastify";
import { useWorkoutHistory } from "@/components/member/Exercise/hooks/useWorkoutHistory";
import useFavoriteExercise from "@/components/member/Exercise/hooks/useFavoriteExercise";
import FavoriteCart from "@/components/member/Exercise/component/FavoriteCard";
export default function WorkoutPage() {
  const { exerciseList, muscleList, loading } = useExercise();
  const { workoutToday, refetch } = useWorkoutHistory();
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseAdd, setExerciseAdd] = useState([])

  const {
    favoriteIds,
    favoriteExercises,
    toggleFavorite
  } = useFavoriteExercise();

  const handleAddExercise = (item) => {
    if (exerciseAdd.some(ex => ex.id == item.id)) {
      toast.error("Bài tập đã được thêm")
      return
    }
    setExerciseAdd([...exerciseAdd, item])
  }

  const PER_PAGE = 8;

  useEffect(() => {
    if (workoutToday?.details) {
      const exercises = workoutToday.details.map((detail) => ({
        ...detail.exercise,
        detail_id: detail.id,
        set_base: detail.set_count,
        rep_base: detail.rep,
        time_action: detail.execution_time,
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExerciseAdd(exercises)
    }
  }, [workoutToday]);

  const filteredExercises = useMemo(() => {
    if (!exerciseList) return [];
    let data = [...exerciseList];
    if (selectedMuscles.length > 0) {
      data = data.filter((ex) =>
        ex.muscle_groups?.some((m) => selectedMuscles.includes(m.name)),
      );
    }
    if (search.trim() !== "") {
      data = data.filter((ex) =>
        ex.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return data;
  }, [exerciseList, selectedMuscles, search]);

  const totalPages = Math.ceil(filteredExercises.length / PER_PAGE);

  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredExercises.slice(start, start + PER_PAGE);
  }, [filteredExercises, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      <FilterMuscleGroup
        muscleList={muscleList}
        selectedMuscles={selectedMuscles}
        setSelectedMuscles={(v) => {
          setSelectedMuscles(v);
          setPage(1);
        }}
      />

      {/* search */}
      <div className="flex justify-center">
        <div className="w-full max-w-md relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm bài tập..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-5 py-2.5 rounded-full bg-white border-2 border-purple-600 text-gray-800 outline-none focus:ring-2 focus:ring-purple-300/40 transition-all"
          />
        </div>
      </div>

      {/* grid */}
      {paginatedExercises.length === 0 ? (
        <div className="text-center text-gray-500">
          Không có bài tập phù hợp
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedExercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onSelectExercise={setSelectedExercise}
              onAddExercise={handleAddExercise}
              isFavorite={favoriteIds.includes(ex.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
      {favoriteExercises.length > 0 && (
        <FavoriteCart
          favorites={favoriteExercises}
          onRemove={toggleFavorite}
        />
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-semibold ${page === i + 1
                ? "bg-purple-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {exerciseAdd.length > 0 && (
        <ExerciseCart
          listExerciseAdd={exerciseAdd}
          workoutToday={workoutToday}
          refetch={refetch}
          onRemove={(exercise) =>
            setExerciseAdd((prev) =>
              prev.filter((e) => e.id != exercise.id)
            )
          }
        />
      )}
    </div>
  );
}
