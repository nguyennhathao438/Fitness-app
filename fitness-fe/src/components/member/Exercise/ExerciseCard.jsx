import { Timer, Repeat, Dumbbell, Plus } from "lucide-react";

export default function ExerciseGridCard({ exercise, onSelectExercise }) {
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

  const thumbnail = getYoutubeThumbnail(exercise.video);

  return (
    <div
      onClick={() => onSelectExercise(exercise)}
      className="cursor-pointer overflow-hidden rounded-2xl bg-gray-900/90 border-2 border-yellow-400 text-white shadow-lg hover:shadow-xl transition-all"
    >
      {/* image */}
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={exercise.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold">{exercise.name}</h3>

        {/* stats */}
        <div className="flex flex-wrap gap-2 text-xs">
          {exercise.set_base && (
            <span className="flex items-center gap-1 rounded-full bg-purple-800/60 px-3 py-1">
              <Repeat size={14} />
              {exercise.set_base} sets
            </span>
          )}

          {exercise.rep_base && (
            <span className="flex items-center gap-1 rounded-full bg-purple-800/60 px-3 py-1">
              <Dumbbell size={14} />
              {exercise.rep_base} reps
            </span>
          )}

          {exercise.time_action && (
            <span className="flex items-center gap-1 rounded-full bg-purple-800/60 px-3 py-1">
              <Timer size={14} />
              {exercise.time_action}s
            </span>
          )}
        </div>

        {/* button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 👈 tránh click mở overlay
            console.log("Add exercise");
          }}
          className="w-full py-3 rounded-full font-bold text-sm transition-all
          bg-yellow-400 text-purple-900
          hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30
          flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Thêm bài tập
        </button>
      </div>
    </div>
  );
}
