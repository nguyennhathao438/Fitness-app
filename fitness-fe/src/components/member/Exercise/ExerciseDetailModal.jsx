import { X } from "lucide-react";

export default function ExerciseDetailModal({ exercise, onClose }) {
  if (!exercise) return null;

  const getYoutubeId = (url) => {
    return url?.split("v=")[1]?.split("&")[0];
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-5xl
          bg-white rounded-2xl
          shadow-2xl
          overflow-hidden
          relative
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="
    absolute top-3 right-3
    bg-purple-950 text-white
    p-2 rounded-full
    transition-all duration-200
    hover:bg-yellow-400
    hover:text-purple-900
    hover:scale-110
    hover:shadow-lg hover:shadow-yellow-400/40
  "
        >
          <X size={18} />
        </button>

        {/* content grid */}
        <div className="grid md:grid-cols-2">
          {/* LEFT - video */}
          <div className="bg-black flex items-center justify-center p-4">
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${getYoutubeId(
                  exercise.video,
                )}`}
                title="video"
                allowFullScreen
              />
            </div>
          </div>

          {/* RIGHT - info */}
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">{exercise.name}</h2>

            {/* stats */}
            <div className="flex flex-wrap gap-2">
              {exercise.set_base && (
                <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm">
                  {exercise.set_base} sets
                </span>
              )}
              {exercise.rep_base && (
                <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm">
                  {exercise.rep_base} reps
                </span>
              )}
            </div>

            {/* muscle groups */}
            <div className="flex flex-wrap gap-2">
              {exercise.muscle_groups?.map((m) => (
                <span
                  key={m.id}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {m.name}
                </span>
              ))}
            </div>

            {/* description */}
            <div>
              <h4 className="font-semibold mb-1">Mô tả</h4>
              <p className="text-gray-600 leading-relaxed">
                {exercise.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
