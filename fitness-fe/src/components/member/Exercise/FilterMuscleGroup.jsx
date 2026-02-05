export default function FilterMuscleGroup({
  muscleList = [],
  selectedMuscles = [],
  setSelectedMuscles,
}) {
  const toggle = (name) => {
    if (selectedMuscles.includes(name)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== name));
    } else {
      setSelectedMuscles([...selectedMuscles, name]);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white shadow-lg">
      <h1 className="text-2xl font-bold">Hôm nay bạn tập gì?</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        {muscleList.map((g) => (
          <button
            key={g.id}
            onClick={() => toggle(g.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                selectedMuscles.includes(g.name)
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-slate-700/60 hover:bg-slate-600"
              }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
