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
    const dateVN = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
    useEffect(() => {
        const config = listExerciseAdd.map(ex => ({
            ...ex,
            set_count: ex.set_base || "",
            rep: ex.rep_base || "",
            time_action: ex.time_action || ""
        }));
        setExerciseConfig(config);
    }, [listExerciseAdd]);

    const updateExercise = (index, field, value) => {
        setExerciseConfig(prev => {
            const newData = [...prev];
            newData[index][field] = value === "" ? "" : Number(value);
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
                    date: dateVN,
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
        <div className="rounded-xl bg-[#1f1b2e] border border-purple-500/40 shadow-md p-6 text-white space-y-4">

            {/* header */}
            <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-3">
                    <Dumbbell className="text-purple-400" size={25} />
                    <h2 className="text-2xl font-bold tracking-wide">
                        Bài tập hôm nay
                    </h2>
                    <span className="text-purple-300 text-sm font-semibold bg-purple-500/20 px-2 py-0.5 rounded-md">
                        {listExerciseAdd.length} bài
                    </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                    <span>Mức độ hoàn thành</span>
                    <span className="text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-md">
                        {workoutToday?.completion_percentage || 0}%
                    </span>
                </div>

            </div>

            {/* list */}
            <div className="space-y-3">
                {exerciseConfig.map((exercise, index) => (
                    <div key={exercise.id || index} className="flex items-center justify-between rounded-lg bg-[#2a2440] px-4 py-3 border border-purple-500/20 hover:border-purple-500 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500">
                                <img className="w-full h-full object-cover" src={getYoutubeThumbnail(exercise.video)} alt="" />
                            </div>
                            <div>
                                <p className="font-semibold">{exercise.name}</p>
                                <div className="mt-1 flex gap-4 text-xs text-gray-300">
                                    {exercise.set_count !== null && exercise.set_count !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <Repeat size={12} />
                                            <input
                                                type="number"
                                                min="1"
                                                value={exercise.set_count}
                                                onChange={(e) =>
                                                    updateExercise(index, "set_count", e.target.value)
                                                }
                                                className="w-12 h-6 text-xs bg-gray-700 border border-gray-600 rounded text-center focus:outline-none focus:border-yellow-400"
                                            />
                                            sets
                                        </div>
                                    )}

                                    {exercise.rep !== null && exercise.rep !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <Dumbbell size={12} />
                                            <input
                                                type="number"
                                                min="1"
                                                value={exercise.rep}
                                                onChange={(e) =>
                                                    updateExercise(index, "rep", e.target.value)
                                                }
                                                className="w-12 h-6 text-xs bg-gray-700 border border-gray-600 rounded text-center focus:outline-none focus:border-yellow-400"
                                            />
                                            reps
                                        </div>
                                    )}

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
                            <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-1 rounded-md">
                                {workoutToday?.details.find(d => d.exercise_id === exercise.id)?.completion_percentage || 0}%
                            </span>
                            {!workoutToday?.details.find(d => d.exercise_id === exercise.id) && (
                                <button onClick={() => onRemove?.(exercise)} className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/40 transition">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* start button */}
            <div className="flex justify-center">
                <button onClick={handleStartWorkout} disabled={!listExerciseAdd.length} className="mt-2 px-5 rounded-md bg-purple-500 hover:bg-purple-600 py-3 font-semibold text-white shadow-md transition">
                    {loading ? "Đang khởi tạo ... " : "Bắt đầu tập"}
                </button>
            </div>

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