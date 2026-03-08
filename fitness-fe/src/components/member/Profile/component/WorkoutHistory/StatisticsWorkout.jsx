import { useState } from "react";
import useWorkoutHistory from "../../hooks/useWorkoutHistory";
import useExercise from "../../../../../hooks/useExercise";
import WorkoutTimeChart from "./WorkoutTimeChart";

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDate(date) {
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit"
    });
}

export default function StatisticsWorkout() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const {loading: workoutLoading, getWorkoutByDate, getDetailsForWorkout } = useWorkoutHistory();
    const { exerciseList, muscleList, loading: exerciseLoading } = useExercise();

    const startOfWeek = getStartOfWeek(currentWeek);

    const weekDates = [...Array(7)].map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const prevWeek = () => {
        const d = new Date(currentWeek);
        d.setDate(d.getDate() - 7);
        setCurrentWeek(d);
    };

    const nextWeek = () => {
        const d = new Date(currentWeek);
        d.setDate(d.getDate() + 7);
        setCurrentWeek(d);
    };

    const muscleGroupMap = {};
    muscleList.forEach(m => {
        muscleGroupMap[m.id] = m;
    });

    const exerciseMap = {};
    exerciseList.forEach(ex => {
        exerciseMap[ex.id] = ex;
    });

    const getWorkoutDataForDate = (date) => {
        const workoutsForDate = getWorkoutByDate(date);
        if (workoutsForDate.length === 0) return null;

        const allExercisesForDay = [];
        const muscleGroupsForDay = new Set();

        workoutsForDate.forEach(workout => {
            const details = getDetailsForWorkout(workout.id);
            details.forEach(detail => {
                const exercise = exerciseMap[detail.exercise_id];
                if (exercise) {
                    allExercisesForDay.push(exercise.name);
                    
                    // Thử lấy muscle groups từ relationship
                    if (exercise.muscle_groups && Array.isArray(exercise.muscle_groups)) {
                        exercise.muscle_groups.forEach(muscle => {
                            muscleGroupsForDay.add(muscle.name);
                        });
                    }
                    // Nếu không có, thử từ pivot table hoặc muscleGroupId
                    else if (exercise.muscleGroupId) {
                        const muscle = muscleGroupMap[exercise.muscleGroupId];
                        if (muscle) {
                            muscleGroupsForDay.add(muscle.name);
                        }
                    }
                }
            });
        });

        return {
            muscle: muscleGroupsForDay.size > 0 
                ? Array.from(muscleGroupsForDay).join(", ")
                : "Chưa xác định",
            exercises: allExercisesForDay
        };
    };

    const today = new Date().toDateString();
    const isLoading = workoutLoading || exerciseLoading;
    const workoutDaysCount = weekDates.filter(date => getWorkoutDataForDate(date)).length;

    return (
        <div className="bg-gray-50 p-6 md:p-8 min-h-screen">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Lịch Tập Tuần</h1>
                <p className="text-gray-600">Tuần: {formatDate(weekDates[0])} - {formatDate(weekDates[6])}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
                <button
                    onClick={prevWeek}
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    ← Tuần trước
                </button>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-center text-gray-600">
                        <span className="font-semibold text-lg text-gray-900">{workoutDaysCount}</span>
                        <span> ngày tập / 7 ngày</span>
                    </div>
                    <input
                        type="date"
                        value={currentWeek.toISOString().split("T")[0]}
                        onChange={(e) => setCurrentWeek(new Date(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                    />
                </div>

                <button
                    onClick={nextWeek}
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Tuần sau →
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="font-bold text-2xl">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Biểu đồ thống kê */}
                    <WorkoutTimeChart currentWeek={currentWeek} />

                    {/* Lịch tập tuần */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                    {weekDays.map((day, index) => {
                        const date = weekDates[index];
                        const isToday = date.toDateString() === today;
                        const data = getWorkoutDataForDate(date);

                        return (
                            <div
                                key={day}
                                className={`border rounded-lg p-4 min-h-64 flex flex-col ${
                                    isToday
                                        ? "border-purple-500 bg-purple-50"
                                        : data
                                        ? "border-gray-200 bg-white"
                                        : "border-gray-100 bg-gray-50"
                                }`}
                            >
                                {/* Day Header */}
                                <div className="mb-4 pb-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg text-gray-900">{day}</h3>
                                        {isToday && <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">Today</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(date)}</p>
                                </div>

                                {/* Content */}
                                {data ? (
                                    <>
                                        {/* Muscle Groups */}
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Nhóm cơ</p>
                                            <div className="flex flex-wrap gap-2">
                                                {data.muscle.split(", ").map((muscle, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                                        {muscle}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Exercises */}
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                                                Bài tập ({data.exercises.length})
                                            </p>
                                            <div className="space-y-1">
                                                {data.exercises.map((ex, i) => (
                                                    <div key={i} className="text-xs text-gray-700 flex items-start">
                                                        <span className="mr-2 text-purple-600">•</span>
                                                        <span>{ex}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center">
                                        <p className="text-sm text-gray-400">Ngày nghỉ</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    </div>
                </>
            )}
        </div>
    );
}