import { AGE_COLORS } from "./AgePieChart";

export default function AgeStatCards({ data = [] }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((item) => (
        <div
          key={item.label}
          className="rounded-xl p-4 shadow-sm bg-white"
          style={{
            borderLeft: `6px solid ${AGE_COLORS[item.label]}`
          }}
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p
            className="text-2xl font-bold"
            style={{ color: AGE_COLORS[item.label] }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
