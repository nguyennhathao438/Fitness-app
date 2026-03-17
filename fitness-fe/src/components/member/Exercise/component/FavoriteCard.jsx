import { Heart, X } from "lucide-react";

export default function FavoriteCart({ favorites, onRemove }) {
  return (
    <div className="fixed bottom-24 right-5 w-72 bg-white shadow-xl rounded-xl border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="text-red-500" size={18} />
        <h3 className="font-semibold">Bài tập yêu thích</h3>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {favorites.map((ex) => (
          <div
            key={ex.id}
            className="flex justify-between items-center bg-gray-100 rounded p-2"
          >
            <span className="text-sm">{ex.name}</span>

            <button
              onClick={() => onRemove(ex)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}