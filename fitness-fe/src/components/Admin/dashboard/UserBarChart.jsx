import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import TimeRangeTabs from "./TimeRangeTabs";
import { getUserChart } from "@/services/admin/StatUserInformation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function UserBarChart() {
  const [range, setRange] = useState("yearly");
  const [chartData, setChartData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const now = new Date();

    getUserChart({
      type: range,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }).then((res) => {
      const { labels, data } = res.data;

      setChartData({
        labels,
        datasets: [
        {
          label: "Member",
          data: data.member,
          backgroundColor: "#6366f1",
          stack: "user",
          categoryPercentage: isMobile ? 0.75 : 0.85,
          barPercentage: isMobile ? 0.85 : 0.9,
        },
        {
          label: "PT",
          data: data.pt,
          backgroundColor: "#a5b4fc",
          stack: "user",
          categoryPercentage: isMobile ? 0.75 : 0.85,
          barPercentage: isMobile ? 0.85 : 0.9,
        },
        {
          label: "All User",
          data: data.all,
          backgroundColor: "#22c55e",
          categoryPercentage: isMobile ? 0.75 : 0.85,
          barPercentage: isMobile ? 0.85 : 0.9,
        },
      ],

      });
    });
  }, [range]);

  if (!chartData) {
    return (
      <div className="h-[280px] flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 max-md:hidden">
          User Registration Statistics
        </h3>

        {/* Filter*/}
        <TimeRangeTabs value={range} onChange={setRange} />
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                left: 10,
                right: 20,
              },
            },
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 12,
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
                ticks: {
                autoSkip: isMobile,
                maxTicksLimit: isMobile ? 5 : 12,
                maxRotation: isMobile ? 45 : 0,
                }
              },
              y: {
                stacked: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
