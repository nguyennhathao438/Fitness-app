import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getInvoiceMoney } from "@/services/admin/Invoice";
import { DollarSignIcon } from "lucide-react";
import TimeRangeTabs from "../dashboard/TimeRangeTabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function InvoiceLineChart() {
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState("yearly");

  useEffect(() => {
    const now = new Date();

    getInvoiceMoney({
      type: range,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    })
      .then((res) => {
        const { labels, data } = res.data;

        setChartData({
          labels,
          datasets: [
        {
            label: "Revenue",
            data: data.money,
            borderColor: "#22c55e",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return null;

            const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
            );

            gradient.addColorStop(0, "rgba(34,197,94,0.35)");
            gradient.addColorStop(1, "rgba(34,197,94,0.05)");

            return gradient;
            },
        },
        ],
        });
      })
      .catch(console.error);
  }, [range]);

  if (!chartData) {
    return (
      <div className="h-[350px] flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    );
  }

  return (
    <div className=" rounded-xl sm:p-9">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-sm:p-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100">
            <DollarSignIcon className="size-5 text-emerald-600" />
          </div>
          <h3 className="text-sm max-md:hidden font-semibold text-gray-700">
            Invoice Revenue Statistics
          </h3>
        </div>

        {/* Filter */}
      <TimeRangeTabs value={range} onChange={setRange} /> 
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                grid: { display: false },
              },
              y: {
                ticks: {
                  callback: (value) =>
                    value.toLocaleString("en-US") + "vnđ",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
