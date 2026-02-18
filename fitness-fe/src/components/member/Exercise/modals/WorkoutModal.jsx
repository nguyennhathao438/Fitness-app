import { useEffect, useState } from "react";
import { Play, Pause, SkipForward, Check } from "lucide-react";
import Modal from "@/components/ui/modal";
export default function WorkoutModal({ exercises = [], open, onClose }) {
    /* ================= STATE ================= */
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [completedSetCount, setCompletedSetCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(exercises[0]?.time_action || 0);
    const [isRunning, setIsRunning] = useState(false);
    const [completedExercise, setCompletedExercise] = useState(new Set());

    const currentExercise = exercises[currentIndex];
    const duration = currentExercise?.time_action || 0;
    const totalSet = currentExercise?.set_base || 1;

    /* ================= TIMER ================= */
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((t) => Math.max(t - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    /* ================= HẾT GIỜ → HOÀN THÀNH 1 SET ================= */
    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsRunning(false);
            setCompletedSetCount((c) => c + 1);
        }
    }, [timeLeft]);

    /* ================= ĐỦ SET → SANG BÀI MỚI ================= */
    useEffect(() => {
        if (completedSetCount === totalSet && totalSet > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCompletedExercise((prev) => {
                const next = new Set(prev);
                next.add(currentIndex);
                return next;
            });

            // sang bài tiếp
            const t = setTimeout(() => {
                if (currentIndex < exercises.length - 1) {
                    const nextIndex = currentIndex + 1;
                    setCurrentIndex(nextIndex);
                    setCurrentSet(1);
                    setCompletedSetCount(0);
                    setTimeLeft(exercises[nextIndex].time_action || 0);
                    setIsRunning(false);
                } else {
                    onClose();
                }
            }, 300);
            return () => clearTimeout(t);
        }
    }, [completedSetCount]);

    /* ================= CONTROLS ================= */
    const toggleRunning = () => {
        // chuẩn bị chạy set mới
        if (!isRunning && timeLeft === 0 && completedSetCount < totalSet) {
            setCurrentSet(completedSetCount + 1);
            setTimeLeft(duration);
        }
        setIsRunning((p) => !p);
    };

    const skipExercise = () => {
        setCompletedExercise((prev) => {
            const next = new Set(prev);
            next.add(currentIndex);
            return next;
        });
        if (currentIndex < exercises.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentSet(1);
            setCompletedSetCount(0);
            setTimeLeft(exercises[nextIndex].time_action || 0);
            setIsRunning(false);
        } else {
            onClose();
        }
    };

    /* ================= UI VALUES ================= */
    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    const progress = duration ? timeLeft / duration : 0;
    const setProgress = completedSetCount / totalSet;

    /* ================= UI ================= */
    return (
        <Modal open={open} onClose={onClose} title="Bắt đầu buổi tập" bgColor={"bg-gray-900"} width="max-w-6xl">
            <div className="w-full rounded-3xl flex">

                {/* LEFT */}
                <div className="w-1/4 border-r border-gray-700 p-4 space-y-3">
                    <h3 className="font-bold">DANH SÁCH</h3>
                    {exercises.map((ex, i) => (
                        <div key={ex.id} className={`flex items-center p-3 rounded-xl border ${i === currentIndex ? "bg-purple-600/30 border-purple-500" : "border-gray-700"}`}>
                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center relative mr-3">
                                {i + 1}
                                {completedExercise.has(i) && (
                                    <span className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                        <Check size={12} />
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{ex.name}</p>
                                <p className="text-sm text-gray-400">{ex.time_action}s</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CENTER */}
                <div className="w-2/4 flex flex-col items-center justify-center gap-6">
                    {/* TIMER */}
                    <div className="relative w-72 h-72">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="144" cy="144" r={radius} stroke="#333" strokeWidth="12" fill="none" />
                            <circle cx="144" cy="144" r={radius} stroke="#a855f7" strokeWidth="12" fill="none"
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
                    <div className="w-64">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Set {currentSet}/{totalSet}</span>
                            <span>{Math.round(setProgress * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${setProgress * 100}%` }} />
                        </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex gap-4">
                        <button onClick={toggleRunning}
                            className={`px-6 py-3 rounded-xl font-semibold flex gap-2
                ${isRunning ? "bg-yellow-500 text-black" : "bg-purple-600"}
              `}>
                            {isRunning ? <Pause size={18} /> : <Play size={18} />}
                            {isRunning ? "TẠM DỪNG" : "BẮT ĐẦU"}
                        </button>

                        <button onClick={skipExercise} className="px-6 py-3 rounded-xl bg-gray-700 flex gap-2">
                            <SkipForward size={18} /> BỎ QUA
                        </button>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-2/4 border-l border-gray-700 p-4 space-y-4">
                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="w-100 h-55">
                            <iframe
                                className="w-full h-full rounded"
                                src={currentExercise?.video?.replace("watch?v=", "embed/")}
                                title="Exercise Video"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="font-bold text-xl text-center">{currentExercise?.name}</h3>
                        <div className="flex justify-center gap-6">
                            <div className="flex flex-col items-center p-2">
                                <span>Sets </span>
                                <span className="font-bold text-purple-500">{currentExercise?.set_base}</span> </div>
                            <div className="flex flex-col items-center p-2">
                                <span>Reps</span>
                                <span className="font-bold text-purple-500">{currentExercise?.rep_base}</span> </div>
                            <div className="flex flex-col items-center p-2">
                                <span>Thời gian</span>
                                <span className="font-bold text-purple-500">{currentExercise?.time_action}s</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-gray-800/60 p-4 text-sm">
                        <b>Hướng dẫn tập luyện</b>
                        <p className="mt-1 text-gray-400"> {currentExercise?.description || "Chưa có hướng dẫn tập luyện"} </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
