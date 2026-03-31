import FilterMuscleGroup from "../../components/member/Exercise/component/FilterMuscleGroup";
import ExerciseCard from "../../components/member/Exercise/component/ExerciseCard";
import useExercise from "../../hooks/useExercise";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import ExerciseDetailModal from "@/components/member/Exercise/component/ExerciseDetailModal";
import ExerciseCart from "@/components/member/Exercise/component/ExerciseCart";
import { toast } from "react-toastify";
import { useWorkoutHistory } from "@/components/member/Exercise/hooks/useWorkoutHistory";
import WorkoutSuggestion from "@/components/member/Exercise/component/WorkoutSuggestion"
import useFavoriteExercise from "@/components/member/Exercise/hooks/useFavoriteExercise";
export default function WorkoutPage() {
  const { exerciseList, muscleList, loading } = useExercise();
  const { workoutToday, refetch } = useWorkoutHistory();
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseAdd, setExerciseAdd] = useState([])
  const [openFavorite, setOpenFavorite] = useState(false);

  const { favoriteIds, favoriteExercises, toggleFavorite } = useFavoriteExercise();

  const muscleGroupMap = {
    upper: ["Ngực", "Lưng", "Vai", "Tay trước", "Vai giữa", "Tay sau", "Cẳng tay"],
    core: ["Cơ xiên bụng", "Lưng dưới"],
    lower: ["Đùi trước", "Đùi sau", "Mông", "Bắp chân"],
  }

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const addSuggestedExercises = (group) => {
    const muscles = muscleGroupMap[group];
    const filtered = favoriteExercises
      .map(fav => exerciseList.find(ex => ex.id === fav.id))
      .filter(Boolean)
      .filter(ex =>
        ex.muscle_groups?.some(m =>
          muscles.some(ms => normalize(ms) === normalize(m.name))
        )
      );
    const newExercises = filtered.filter(
      (ex) => !exerciseAdd.some((e) => e.id === ex.id)
    );
    if (filtered.length === 0) {
      toast.warning("Không có bài tập phù hợp nhóm cơ");
      return;
    }
    if (newExercises.length === 0) {
      toast.info("Các bài này đã có trong danh sách hôm nay");
      return;
    }
    setExerciseAdd((prev) => [...prev, ...newExercises]);
    toast.success(`Đã thêm ${newExercises.length} bài tập`);
  };

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
    // lọc favorite
    if (openFavorite) {
      data = data.filter((ex) => favoriteIds.includes(ex.id));
    }
    // lọc nhóm cơ
    if (selectedMuscles.length > 0) {
      data = data.filter((ex) =>
        ex.muscle_groups?.some((m) => selectedMuscles.includes(m.name))
      );
    }
    // tìm kiếm
    if (search.trim() !== "") {
      data = data.filter((ex) =>
        ex.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [exerciseList, selectedMuscles, search, openFavorite, favoriteIds]);

  // nguồn dữ liệu
  const sourceExercises = filteredExercises;

  // tổng số trang
  const totalPages = Math.ceil(sourceExercises.length / PER_PAGE);

  // phân trang
  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return sourceExercises.slice(start, start + PER_PAGE);
  }, [sourceExercises, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col text-gray-500 items-center justify-center">
        <div className="w-10 h-10 mb-3 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        Loading ...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <FilterMuscleGroup
          muscleList={muscleList}
          selectedMuscles={selectedMuscles}
          setSelectedMuscles={(v) => {
            setSelectedMuscles(v);
            setPage(1);
          }}
        />

        {/* search */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="w-full max-w-md relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500"
              size={18}
            />
            <input type="text" placeholder="Tìm bài tập..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-5 py-2.5 rounded-full bg-white border-2 border-purple-600 text-gray-800 outline-none focus:ring-2 focus:ring-purple-300/40 transition-all"
            />
          </div>

          {/* favorite button */}
          <button onClick={() => setOpenFavorite(!openFavorite)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${openFavorite ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white ring-2 ring-blue-300" : "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"}`}>
            <span>
              {openFavorite ? "Tất cả bài tập" : "Bài tập yêu thích"}
            </span>
            {!openFavorite && favoriteExercises.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {favoriteExercises.length}
              </span>
            )}
          </button>
        </div>



        {/* grid */}
        {paginatedExercises.length === 0 ? (
          <div className="text-center text-gray-500">
            {openFavorite
              ? "Bạn chưa có bài tập yêu thích"
              : "Không có bài tập phù hợp"}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedExercises.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} onSelectExercise={setSelectedExercise} onAddExercise={handleAddExercise} isFavorite={favoriteIds.includes(ex.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-4 py-2 rounded-lg font-semibold ${page === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}

        <WorkoutSuggestion onSelectGroup={addSuggestedExercises} />

        {selectedExercise && (<ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />)}

        {exerciseAdd.length > 0 && (
          <ExerciseCart listExerciseAdd={exerciseAdd} workoutToday={workoutToday} refetch={refetch}
            onRemove={(exercise) => setExerciseAdd((prev) => prev.filter((e) => e.id != exercise.id))}
          />
        )}
      </div>
    </div>
  );
}
