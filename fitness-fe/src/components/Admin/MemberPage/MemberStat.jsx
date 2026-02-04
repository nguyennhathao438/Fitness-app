export default function MemberStat({ title, items ,icon}) {
  const total = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="p-4 rounded-xl bg-white shadow-sm">
      {/* Title */}
      <div className="font-medium mb-3 gap-2 flex">
        <p>{icon}</p>
        <span>{title}</span>
      </div>

      {/* Progress bar */}
      <div className="h-5 w-full bg-gray-200 rounded-full overflow-hidden flex">
        {items.map((item, idx) => {
          const percent = Math.round((item.value / total) * 100);

          return (
            <div
              key={idx}
              className={`h-full ${item.color} transition-all duration-500`}
              style={{ width: `${percent}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 space-y-1 text-sm">
        {items.map((item, idx) => {
          const percent = Math.round((item.value / total) * 100);

          return (
            <div
              key={idx}
              className="flex justify-between"
            >
              <span className="flex items-center gap-2">
                <span className={`size-4 rounded-full ${item.color}`} />
                {item.label}
              </span>
              <span>
                {item.value} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
