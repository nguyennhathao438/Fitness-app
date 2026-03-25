import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Trophy, Users, TrendingUp } from "lucide-react";
import { getPackageStat } from "../../../services/admin/Package"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function PackageStatContent() {
  const [chartData, setChartData] = useState(null);
  const [topPackages, setTopPackages] = useState([]);

  useEffect(() => {
    getPackageStat()
      .then((res) => {
        const { labels, data } = res.data.data;

        const combinedData = labels.map((label, index) => ({
          name: label,
          count: data.registered[index],
        }));
        
        const sortedTop5 = combinedData
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setTopPackages(sortedTop5);

        setChartData({
          labels,
          datasets: [
            {
              label: "Số lượt đăng ký",
              data: data.registered,
              backgroundColor: "#8b5cf6", 
              hoverBackgroundColor: "#7c3aed", 
              borderRadius: 6, 
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu thống kê gói tập:", error);
      });
  }, []);

  const getMedalColor = (index) => {
    switch (index) {
      case 0: return "bg-yellow-100 text-yellow-600 border-yellow-200"; 
      case 1: return "bg-gray-100 text-gray-500 border-gray-200";      
      case 2: return "bg-orange-100 text-orange-500 border-orange-200"; 
      default: return "bg-purple-50 text-purple-600 border-purple-100"; 
    }
  };

  if (!chartData) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* TOP 5 GÓI TẬP */}
      <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
        {/* Header Left */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <span className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
            <Trophy className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-gray-800">
            Top 5 Gói Phổ Biến
          </h3>
        </div>

        {/* List Top 5 */}
        <div className="flex-1 flex flex-col gap-4">
          {topPackages.map((pkg, index) => (
            <div 
              key={index} 
              className="flex items-center p-3 rounded-xl border border-gray-50 hover:bg-gray-50 hover:border-gray-200 transition-colors group"
            >
              {/* Thứ hạng */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-sm mr-4 shrink-0 transition-transform group-hover:scale-110 ${getMedalColor(index)}`}>
                #{index + 1}
              </div>
              
              {/* Tên & Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate" title={pkg.name}>
                  {pkg.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Users className="w-3 h-3" />
                  <span>Lượt đăng ký</span>
                </div>
              </div>
              
              {/* Số lượng */}
              <div className="text-right pl-3">
                <span className="font-bold text-lg text-violet-600">{pkg.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* BIỂU ĐỒ CỘT */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
        {/* Header Right */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <span className="p-2 rounded-lg bg-violet-100 text-violet-600">
            <TrendingUp className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-gray-800">
            Thống Kê Tổng Đăng Ký Theo Gói
          </h3>
        </div>

        {/* Biểu đồ */}
        <div className="flex-1 min-h-[300px] w-full">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  align: "end",
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: { size: 14 },
                  bodyFont: { size: 14 },
                  callbacks: {
                    label: function(context) {
                      return ` ${context.raw} lượt đăng ký`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 12 } }
                },
                y: {
                  beginAtZero: true,
                  border: { dash: [4, 4] },
                  grid: { color: '#f3f4f6' },
                  ticks: { precision: 0 }, 
                },
              },
            }}
          />
        </div>
      </div>

    </div>
  );
}