import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const AGE_COLORS = {
  "< 18": "#7C3AED",
  "18 - 24": "#2563EB",
  "25 - 34": "#059669",
  "≥ 35": "#D97706",
};

export default function AgePieChart({ data }) {
  if (!Array.isArray(data)) return null;

  const chartData = {
    labels: data.map(i => i.label),
    datasets: [
      {
        data: data.map(i => i.value),
        backgroundColor: data.map(i => AGE_COLORS[i.label]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-[210px] md:w-[260px] h-[260px]">
      <Pie data={chartData} options={options} />
    </div>
  );
}
