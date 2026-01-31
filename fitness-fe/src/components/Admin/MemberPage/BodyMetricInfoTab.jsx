import { useEffect, useState } from "react";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Tooltip,Legend,} from "chart.js";
import { Line } from "react-chartjs-2";
import {ScaleIcon,RulerIcon,ActivityIcon,FlameIcon,HeartPulseIcon,DropletIcon,} from "lucide-react";
import {getAllBodyMetric,getBodyMetricLatest,} from "../../../services/admin/BodyMetricInformation";
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Tooltip,Legend);

export default function BodyMetricInfoTab({ member }) {
  const [metrics, setMetrics] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  // filter
  const [range, setRange] = useState("month"); // month | year
  const now = new Date();
  const filteredMetrics = metrics.filter((m) => {
  const date = new Date(m.created_at);

  if (range === "month") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  if (range === "year") {
    return date.getFullYear() === now.getFullYear();
  }

  return true;
  });

  useEffect(() => {
    if (!member?.id) return;

    setLoading(true);

    Promise.all([
      getAllBodyMetric(member.id),
      getBodyMetricLatest(member.id),
    ])
      .then(([allRes, latestRes]) => {
        setMetrics(allRes.data.data || []);
        setLatest(latestRes.data.data || null);
      })
      .finally(() => setLoading(false));
  }, [member?.id]);

  if (loading) {
    return <p className="text-center">Đang tải chỉ số cơ thể...</p>;
  }

  /* ===== Chart ===== */
  const chartData = {
  labels: filteredMetrics.map((m) =>
    new Date(m.created_at).toLocaleDateString("vi-VN")
  ),
  datasets: [
    {
      label: "Cân nặng (kg)",
      data: filteredMetrics.map((m) => m.weight),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.2)",
      pointBackgroundColor: "#6366f1",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Cơ bắp (%)",
      data: filteredMetrics.map((m) => m.muscle),
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.2)",
      pointBackgroundColor: "#22c55e",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Body Fat (%)",
      data: filteredMetrics.map((m) => m.body_fat),
      borderColor: "#ef4444",
      backgroundColor: "rgba(239,68,68,0.2)",
      pointBackgroundColor: "#ef4444",
      tension: 0.4,
      fill: true,
    },
  ],
};
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: "#e5e7eb",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};


  return (
    <div className="space-y-6">
      {/* ===== 6 chỉ số ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard icon={<ScaleIcon />} label="Cân nặng (kg)" value={latest?.weight} />
        <MetricCard icon={<RulerIcon />} label="Chiều cao (cm)" value={latest?.height} />
        <MetricCard icon={<ActivityIcon />} label="Cơ bắp (%)" value={latest?.muscle} />
        <MetricCard icon={<FlameIcon />} label="Body Fat (%)" value={latest?.body_fat} />
        <MetricCard icon={<HeartPulseIcon />} label="Mỡ nội tạng" value={latest?.visceral_fat} />
        <MetricCard icon={<DropletIcon />} label="Nước cơ thể (%)" value={latest?.body_water} />
      </div>

      {/* ===== Biểu đồ ===== */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between">
          <h3 className="font-semibold mb-4">
          Biểu đồ thay đổi chỉ số cơ thể
          </h3>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-2 py-1 border rounded-lg text-sm bg-gray-100 shadow-md"
          >
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        <div className="h-[320px]">
          <Line data={chartData} options={chartOptions}/>
        </div>
      </div>
    </div>
  );
}

/* ===== Card ===== */
function MetricCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
      <div className="p-2 bg-gray-100 rounded-lg text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">
          {value ?? "--"}
        </p>
      </div>
    </div>
  );
}
