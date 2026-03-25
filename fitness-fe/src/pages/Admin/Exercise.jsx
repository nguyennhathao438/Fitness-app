import Header from "@/components/Admin/Exercise/component/Header";
import ExerciseList from "@/components/Admin/Exercise/component/ExerciseList";
import useExercise from "@/hooks/useExercise";
export default function Exercise() {
    const {
        exerciseList,
        muscleList,
        loading,
        loadingMuscle,
        fetchAllExercises,
        fetchByMuscle,
    } = useExercise();
    return (
        <div className="p-4">
            <Header />
            <ExerciseList
                exerciseList={exerciseList}
                muscleList={muscleList}
                loading={loading}
                loadingMuscle={loadingMuscle}
                fetchAllExercises={fetchAllExercises}
                fetchByMuscle={fetchByMuscle} />
        </div>
    );
}
