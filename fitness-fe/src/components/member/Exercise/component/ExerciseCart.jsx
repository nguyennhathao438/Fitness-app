import { Timer, Repeat, Dumbbell, X } from "lucide-react";
import WorkoutModal from "../modals/WorkoutModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createWorkoutHistory } from "@/services/member/WorkoutHistory";
import { createWorkoutHistoryDetail, getWorkoutHistoryDetails } from "@/services/member/WorkoutHistoryDetail";

export default function ExerciseCart({ listExerciseAdd = [], onRemove, workoutToday, refetch }) {
    const { member } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false)
    const [openWorkout, setOpenWorkout] = useState(false);
    const [details, setDetails] = useState([]);
    const [workoutId, setWorkoutId] = useState(null);
    const [exerciseConfig, setExerciseConfig] = useState([]);

    useEffect(() => {
        const config = listExerciseAdd.map(ex => ({
            ...ex,
            set_count: ex.set_base || 0,
            rep: ex.rep_base || 0
        }));
        setExerciseConfig(config);
    }, [listExerciseAdd]);

    const updateExercise = (index, field, value) => {
        setExerciseConfig(prev => {
            const newData = [...prev];
            newData[index][field] = Number(value);
            return newData;
        });
    };

    const getYoutubeThumbnail = (url) => {
        if (!url) return "/placeholder.jpg";
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = match && match[2].length === 11 ? match[2] : null;

        return videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : "/placeholder.jpg";
    };

    const addWorkoutHistory = async () => {
        try {
            setLoading(true);
            let workoutId;
            if (workoutToday) {
                workoutId = workoutToday.id;
            } else {
                const workout = {
                    member_id: member.id,
                    total_time: 0,
                    date: new Date().toISOString().split("T")[0],
                    day_of_week: new Date().getDay() + 1,
                    completion_percentage: 0,
                };
                const response = await createWorkoutHistory(workout)
                workoutId = response.data.data.id;
            }
            setWorkoutId(workoutId);
            // lấy danh sách detail đã có
            const detailRes = await getWorkoutHistoryDetails(workoutId)
            const existingDetails = detailRes.data.data;
            const existingExerciseIds = existingDetails.map(
                (d) => d.exercise_id
            );
            const tempDetails = [];
            for (const exercise of exerciseConfig) {
                if (existingExerciseIds.includes(exercise.id)) {
                    const oldDetail = existingDetails.find(
                        (d) => d.exercise_id === exercise.id
                    );
                    tempDetails.push({
                        ...oldDetail,
                        detail_id: oldDetail.id
                    });
                    continue;
                }
                const workOutDetail = {
                    workout_history_id: workoutId,
                    exercise_id: exercise.id,
                    set_count: exercise.set_count,
                    rep: exercise.rep,
                    execution_time: exercise.time_action,
                    estimated_time: 0,
                    status: "pending",
                    completion_percentage: 0,
                };
                const res = await createWorkoutHistoryDetail(workOutDetail);
                tempDetails.push({
                    ...res.data.data,
                    detail_id: res.data.data.id
                });
            }
            setDetails(tempDetails);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartWorkout = async () => {
        await addWorkoutHistory(); // chờ tạo xong
        setOpenWorkout(true); // rồi mới mở modal
    };

    return (
        <div className="rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950 p-6 text-white space-y-4">

            {/* header */}
            <div className="flex justify-center items-center gap-2 text-sm font-semibold">
                <span className="uppercase font-bold text-2xl text-center">
                    Bài tập hôm nay
                </span>
                <span className="text-gray-400 text-xl">
                    ({listExerciseAdd.length} bài)
                </span>
            </div>
            <div className="flex justify-center items-center gap-2 text-sm font-semibold">
                <span className="uppercase font-bold text-2xl text-center">
                    Mức độ hoàn thành
                </span>
                <span className="text-gray-400 text-xl">
                    ({workoutToday?.completion_percentage || 0}%)
                </span>
            </div>

            {/* list */}
            <div className="space-y-3">
                {exerciseConfig.map((exercise, index) => (
                    <div key={exercise.id || index}
                        className="flex items-center justify-between rounded-xl bg-gray-800/60 px-4 py-2 border border-gray-700"
                    >

                        <div className="flex items-center gap-4">
                            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-purple-600 text-sm font-bold">
                                <img className="w-full h-full object-cover" src={getYoutubeThumbnail(exercise.video)} alt="" />
                            </div>

                            <div>
                                <p className="font-semibold">{exercise.name}</p>
                                <div className="mt-1 flex gap-4 text-xs text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <Repeat size={12} />
                                        <input
                                            type="number"
                                            min="1"
                                            value={exercise.set_count}
                                            onChange={(e) =>
                                                updateExercise(index, "set_count", e.target.value)
                                            }
                                            className="w-12 bg-gray-700 rounded px-1 text-center"
                                        />
                                        sets
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Dumbbell size={12} />
                                        <input
                                            type="number"
                                            min="1"
                                            value={exercise.rep}
                                            onChange={(e) =>
                                                updateExercise(index, "rep", e.target.value)
                                            }
                                            className="w-12 bg-gray-700 rounded px-1 text-center"
                                        />
                                        reps
                                    </div>

                                    {exercise.time_action && (
                                        <span className="flex items-center gap-1">
                                            <Timer size={12} />
                                            {exercise.time_action}s
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-green-500">
                                {workoutToday?.details.find(d => d.exercise_id === exercise.id)?.completion_percentage || 0}%
                            </span>
                            {!workoutToday?.details.find(d => d.exercise_id === exercise.id) && (
                                <button onClick={() => onRemove?.(exercise)} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* start button */}
            <button onClick={handleStartWorkout} disabled={!listExerciseAdd.length} className="mt-4 w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-4 font-bold text-purple-900">
                {loading ? "Đang khởi tạo ... " : "Bắt đầu tập"}
            </button>

            {openWorkout && (
                <WorkoutModal
                    exercises={details}
                    open={openWorkout}
                    onClose={() => setOpenWorkout(false)}
                    workoutId={workoutId}
                    workoutToday={workoutToday}
                    reloadWorkout={refetch}
                />
            )}

        </div>
    );
}