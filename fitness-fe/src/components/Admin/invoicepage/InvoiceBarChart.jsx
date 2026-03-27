import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getInvoicePerMonth } from "@/services/admin/Invoice";
import { FileBarChartIcon } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function InvoiceBarChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getInvoicePerMonth({
      type: "yearly",
      year: new Date().getFullYear(),
    }).then((res) => {
      const { labels, data } = res.data;

      setChartData({
        labels,
        datasets: [
          {
            label: "Đã Thanh toán",
            data: data.paid,
            backgroundColor: "#22c55e",
          },
          {
            label: "Từ chối",
            data: data.reject,
            backgroundColor: "#ef4444",
          },
        ],
      });
    })
    .catch(console.error);;
  }, []);

  if (!chartData) {
    return (
      <div className="h-[260px] flex items-center justify-center text-gray-400">
        Đang tải biểu đồ...
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full">
        {/* Header */}
        <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <FileBarChartIcon className="size-5 text-indigo-600" />
            </span>
            <h3 className="text-xl font-semibold text-gray-700">
            Thống kê hóa đơn theo tháng
            </h3>
        </div>
        <div className="h-11/12">
        <Bar
            data={chartData}
            options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                position: "top",
                },
            },
            scales: {
                x: {
                grid: { display: false },
                },
                y: {
                ticks: { precision: 0 },
                },
            },
            }}
        />
        </div>
    </div>
  );
}
