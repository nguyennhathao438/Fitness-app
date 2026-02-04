export default function ProgressBarStat({ title, items = [], icon }) {
  const total = items.reduce((sum, i) => sum + i.value, 0);

  if (items.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-white shadow-sm text-gray-400 text-sm">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span>{title}</span>
        </div>
        No data available
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white shadow-sm">
      {/* Title */}
      <div className="font-medium mb-3 gap-2 flex">
        <span>{icon}</span>
        <span>{title}</span>
      </div>

      {/* Progress bar */}
      <div className="h-5 w-full bg-gray-200 rounded-full overflow-hidden flex">
        {items.map((item, idx) => {
        const percent = total === 0 ? 0 : ((item.value / total) * 100).toFixed(1);

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
         const percent = total === 0 ? 0 : ((item.value / total) * 100).toFixed(1);

          return (
            <div key={idx} className="flex justify-between">
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
