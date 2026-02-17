import { Timer, Repeat, Dumbbell, X } from "lucide-react";

export default function ExerciseCart({ listExerciseAdd = [], onRemove }) {

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
    return (
        <div className="rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950 p-6 text-white space-y-4">

            {/* header */}
            <div className="flex items-center gap-2 text-sm font-semibold">
                🎯 <span className="uppercase">Bài tập đã chọn</span>
                <span className="text-gray-400">
                    ({listExerciseAdd.length} bài)
                </span>
            </div>

            {/* list */}
            <div className="space-y-3">
                {listExerciseAdd.map((exercise, index) => (
                    <div
                        key={exercise.id || index}
                        className="flex items-center justify-between rounded-xl bg-gray-800/60 px-4 py-3 border border-gray-700"
                    >
                        {/* left */}
                        <div className="flex items-center gap-4">
                            {/* index */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold">
                                {index + 1}
                            </div>

                            {/* info */}
                            <div>
                                <p className="font-semibold">{exercise.name}</p>

                                <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-300">
                                    {exercise.set_base && (
                                        <span className="flex items-center gap-1">
                                            <Repeat size={12} />
                                            {exercise.set_base} sets
                                        </span>
                                    )}

                                    {exercise.rep_base && (
                                        <span className="flex items-center gap-1">
                                            <Dumbbell size={12} />
                                            {exercise.rep_base} reps
                                        </span>
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

                        {/* right */}
                        <div className="flex items-center gap-3">
                            {/* status */}
                            <span className="flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-400">
                                ⏳ Chờ
                            </span>

                            {/* remove */}
                            <button
                                onClick={() => onRemove?.(exercise)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* start button */}
            <button
                disabled={!listExerciseAdd.length}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 py-4 font-bold text-purple-900
        hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-400/30 transition
        disabled:opacity-50 disabled:cursor-not-allowed"
            >
                🚀 BẮT ĐẦU BUỔI TẬP
            </button>
        </div>
    );
}
