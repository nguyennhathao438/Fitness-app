const ranges = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Annually", value: "yearly" },
];

export default function TimeRangeTabs({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      {ranges.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`
            px-4 py-1.5 text-sm font-medium rounded-md transition-all
            ${
              value === item.value
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
