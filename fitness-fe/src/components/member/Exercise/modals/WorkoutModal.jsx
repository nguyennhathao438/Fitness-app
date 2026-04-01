import { useEffect, useState } from "react";
import { Play, SkipForward, Check } from "lucide-react";
import Modal from "@/components/ui/modal";
import ConfirmModal from "./ConfirmModal";
import api from "@/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function WorkoutModal({
  exercises = [],
  open,
  onClose,
  workoutToday,
  workoutId,
  reloadWorkout,
}) {
  /* ================= STATE ================= */
  // keep a local copy so we can update percentages without relying solely on props
  const [localExercises, setLocalExercises] = useState(exercises);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSetCount, setCompletedSetCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    localExercises[0]?.execution_time || 0,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [completedExercise, setCompletedExercise] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const currentExercise = localExercises[currentIndex];
  const duration = currentExercise?.execution_time || 0;
  const totalSet = currentExercise?.set_count || 1;
  const [sessionTime, setSessionTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const totalWorkoutTime = totalTime + sessionTime;
  const currentSet = completedSetCount + 1;
  const permissions = useSelector((state) => state.auth.permissions);
  const navigate = useNavigate();
  const handleClose = () => {
    setShowConfirm(true);
  };

  useEffect(() => {
    if (!open) return;
    //eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalTime(workoutToday ? workoutToday.total_time : 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  /* ================= EXERCISE TIMER ================= */
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const finishWorkout = async () => {
    try {
      const percent = Math.floor(
        (completedExercise.size / exercises.length) * 100,
      );
      await api.put(`/workout-history/${workoutId}`, {
        total_time: totalWorkoutTime,
        completion_percentage: percent,
      });
      reloadWorkout?.();
    } catch (err) {
      console.error(err);
    }
    setShowConfirm(false);
    onClose();
  };

  useEffect(() => {
    if (!open || exercises.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalExercises([...exercises]);
    let newCompleted = new Set();
    let startIndex = 0;
    let startSet = 0;
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const percent = ex.completion_percentage || 0;
      const totalSet = ex.set_count || 1;
      if (percent === 100) {
        newCompleted.add(i);
        continue;
      }
      startIndex = i;
      startSet = Math.round((percent / 100) * totalSet);
      break;
    }
    setCompletedExercise(newCompleted);
    setCurrentIndex(startIndex);
    setCompletedSetCount(startSet);
    setTimeLeft(exercises[startIndex]?.execution_time || 0);
    setSessionTime(0);
    setIsRunning(false);
  }, [open, exercises]);

  const completeSet = async () => {
    if (completedSetCount >= totalSet) return;
    const newCompletedCount = completedSetCount + 1;
    const percent = Math.round((newCompletedCount / totalSet) * 100);
    setCompletedSetCount(newCompletedCount);
    setIsRunning(false);
    setTimeLeft(duration);
    setLocalExercises((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        completion_percentage: percent,
      };
      return copy;
    });
    try {
      await api.put(`/workout-history-details/${currentExercise.detail_id}`, {
        completion_percentage: percent,
        status: percent === 100 ? "completed" : "in_progress",
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HẾT GIỜ → HOÀN THÀNH 1 SET ================= */
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      //eslint-disable-next-line react-hooks/set-state-in-effect
      completeSet();
    }
  }, [timeLeft, isRunning]);

  /* ================= ĐỦ SET → SANG BÀI MỚI ================= */
  // useEffect(() => {
  //     if (completedSetCount === totalSet && totalSet > 0) {
  //         // eslint-disable-next-line react-hooks/set-state-in-effect
  //         setCompletedExercise((prev) => {
  //             const next = new Set(prev);
  //             next.add(currentIndex);
  //             return next;
  //         });
  //         const t = setTimeout(() => {
  //             if (currentIndex < localExercises.length - 1) {
  //                 const nextIndex = currentIndex + 1;
  //                 setCurrentIndex(nextIndex);
  //                 setCompletedSetCount(0); //currentSet tự reset về 1
  //                 setTimeLeft(localExercises[nextIndex].execution_time || 0);
  //                 setIsRunning(false);
  //             }
  //         }, 300);
  //         return () => clearTimeout(t);
  //     }
  // }, [completedSetCount, totalSet]);

  useEffect(() => {
    if (completedSetCount === totalSet && totalSet > 0) {
      // Chỉ tự chuyển nếu bài tập hiện tại chưa nằm trong completedExercise
      if (!completedExercise.has(currentIndex)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompletedExercise((prev) => {
          const next = new Set(prev);
          next.add(currentIndex);
          return next;
        });
        const t = setTimeout(() => {
          if (currentIndex < localExercises.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCompletedSetCount(0);
            setTimeLeft(localExercises[nextIndex].execution_time || 0);
            setIsRunning(false);
          }
        }, 300);
        return () => clearTimeout(t);
      }
    }
  }, [completedSetCount, totalSet]);

  const selectExercise = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setCompletedSetCount(
      Math.round(
        ((localExercises[index]?.completion_percentage || 0) / 100) *
          (localExercises[index]?.set_count || 1),
      ),
    );
    setTimeLeft(localExercises[index]?.execution_time || 0);
    setIsRunning(false);
  };

  const toggleRunning = () => {
    if (isRunning) {
      completeSet();
    } else {
      if (timeLeft === 0) setTimeLeft(duration);
      setIsRunning(true);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /* ================= UI VALUES ================= */
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = duration ? timeLeft / duration : 0;
  const setProgress =
    completedSetCount > 0
      ? completedSetCount / totalSet
      : (currentExercise?.completion_percentage || 0) / 100;

  /* ================= UI ================= */
  return (
    <Modal
      open={open}
      title={"Tập luyện"}
      onClose={handleClose}
      bgColor={"bg-gray-900"}
      width="max-w-6xl"
    >
      <div className="w-full rounded-3xl flex">
        {/* LEFT */}
        <div className="w-1/4 border-r border-gray-700 p-4 space-y-3 h-[80vh] overflow-y-auto custom-scroll">
          <h3 className="font-bold">DANH SÁCH</h3>
          {localExercises.map((ex, i) => (
            <div
              key={ex.id}
              onClick={() => selectExercise(i)}
              className={`flex items-center p-3 rounded-xl border ${i === currentIndex ? "bg-purple-600/30 border-purple-500" : "border-gray-700"}`}
            >
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center relative mr-3">
                {i + 1}
                {completedExercise.has(i) && (
                  <span className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Check size={12} />
                  </span>
                )}
              </div>
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-semibold">{ex.exercise.name}</p>
                  <p className="text-xs text-gray-400">
                    {ex.completion_percentage || 0}%
                  </p>
                </div>
                <p className="text-sm text-gray-400">{ex.execution_time}s</p>
                {/* progress bar */}
                <div className="h-1 bg-gray-700 rounded mt-1 overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${ex.completion_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CENTER */}
        <div className="w-2/4 flex flex-col items-center justify-center gap-6">
          {/* STOPWATCH */}
          <div className="flex gap-10">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Thời gian buổi tập hiện tại
              </p>
              <p className="text-3xl font-bold text-green-400">
                {formatTime(sessionTime)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">Tổng thời tập hôm nay</p>
              <p className="text-3xl font-bold text-purple-400">
                {formatTime(totalWorkoutTime)}
              </p>
            </div>
          </div>

          {/* TIMER */}
          <div className="relative w-72 h-72">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="144"
                cy="144"
                r={radius}
                stroke="#333"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="144"
                cy="144"
                r={radius}
                stroke="#a855f7"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold">{timeLeft}</span>
              <span className="text-gray-400">giây</span>
            </div>
          </div>

          {/* SET PROGRESS */}
          {currentExercise?.set_count > 0 && currentExercise?.rep > 0 && (
            <div className="w-64">
              <div className="flex justify-between text-sm mb-1">
                <span>
                  Set {Math.min(currentSet, totalSet)}/{totalSet}
                </span>
                <span>{Math.round(setProgress * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${setProgress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* CONTROLS */}
          <button
            onClick={toggleRunning}
            className={`px-6 py-3 rounded-xl font-semibold flex gap-2 items-center ${timeLeft === 0 ? "bg-green-600 hover:bg-green-700" : isRunning ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {timeLeft === 0 ? (
              <>
                <Check size={18} />
                HOÀN THÀNH
              </>
            ) : isRunning ? (
              <>
                <Check size={18} />
                HOÀN THÀNH
              </>
            ) : (
              <>
                <Play size={18} />
                BẮT ĐẦU
              </>
            )}
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-2/4 border-l border-gray-700 p-4 space-y-4">
          <div className="space-y-2 text-sm text-gray-300">
            <div className="w-100 h-55">
              {permissions.includes("workout.create") ? (
                <iframe
                  className="w-full h-full rounded"
                  src={currentExercise?.exercise?.video?.replace(
                    "watch?v=",
                    "embed/",
                  )}
                  title="Exercise Video"
                  allowFullScreen
                />
              ) : (
                <div className="text-center text-white space-y-2">
                  <p>Chỉ hội viên nâng cao và vip mới được xem video</p>
                  <button
                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 hover:shadow-lg transition-colors duration-200"
                    onClick={() => navigate("/upgrade")}
                  >
                    Nâng cấp ngay
                  </button>
                </div>
              )}
            </div>
            <h3 className="font-bold text-xl text-center">
              {currentExercise?.exercise?.name}
            </h3>
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center p-2">
                <span>Sets</span>
                <span className="font-bold text-purple-500">
                  {currentExercise?.set_count}
                </span>
              </div>
              <div className="flex flex-col items-center p-2">
                <span>Reps</span>
                <span className="font-bold text-purple-500">
                  {currentExercise?.rep}
                </span>
              </div>
              <div className="flex flex-col items-center p-2">
                <span>Thời gian</span>
                <span className="font-bold text-purple-500">
                  {currentExercise?.execution_time}s
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gray-800/60 p-4 text-sm">
            <b>Hướng dẫn tập luyện</b>
            <p className="mt-1 text-gray-400">
              {currentExercise?.description || "Chưa có hướng dẫn tập luyện"}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowConfirm(true)}
              className="font-xl bg-red-500 cursor-pointer rounded-md px-4 py-2 mt-5 text-white font-bold hover:bg-red-600 hover:shadow-lg transition-colors duration-200"
            >
              Kết thúc buổi tập
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={finishWorkout}
        title="Xác nhận kết thúc"
        message="Bạn có chắc muốn kết thúc buổi tập?"
        confirmText="Có"
        cancelText="Không"
      />
    </Modal>
  );
}
