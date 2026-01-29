import { useEffect, useState } from "react";
import { getBodyMetric, getLatestBodyMetric } from "../../services/member/MemberService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MemberBMI() {
    const [bodyMetric, setBodyMetric] = useState([]);
    useEffect(() => {
        const fetchBodyMetric = async () => {
            try {
                const response = await getBodyMetric();
                setBodyMetric(response.data.data);
            } catch (error) {
                console.log("Error", error)
            }
        }
        fetchBodyMetric()
    }, [])
    const [bodyMetricNew, setBodyMetricNew] = useState({})
    useEffect(() => {
        const fetcha = async () => {
            try {
                const response = await getLatestBodyMetric();
                setBodyMetricNew(response.data.data);
            } catch (error) {
                console.log("Error", error)
            }
        }
        fetcha()
    }, [])
    console.log("Body Metric:", bodyMetric)
    
    // Format dữ liệu cho biểu đồ
    const chartData = [...bodyMetric]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((item) => ({
        date: item.created_at.split("T")[0],
        weight: item.weight,
        muscle: item.muscle,
        body_fat: item.body_fat,
    }));

    return (
        <div>
            <h2 className="text-center font-bold text-2xl py-4">Chỉ số cơ thể của bạn</h2>
            <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                    <h2 className="text-center font-bold text-xl py-4">Chỉ số cơ thể hiện tại</h2>
                    <div className="grid grid-cols-2 gap-4 lg:px-20 md:px-10">
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span>Chiều cao</span>
                            <span>{bodyMetricNew?.height} cm</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span>Cân nặng</span>
                            <span>{bodyMetricNew?.weight} kg</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span>Tỉ lệ cơ</span>
                            <span>{bodyMetricNew?.muscle} kg</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span>Tỉ lệ mỡ</span>
                            <span>{bodyMetricNew?.body_fat} %</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-center font-bold text-xl py-4">Lịch sử chỉ số cơ thể</h2>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Ngày</th>
                                <th className="border border-gray-300 p-2">Chiều cao</th>
                                <th className="border border-gray-300 p-2">Cân nặng</th>
                                <th className="border border-gray-300 p-2">Tỉ lệ cơ</th>
                                <th className="border border-gray-300 p-2">Tỉ lệ mỡ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bodyMetric.map((item) => (
                                <tr className="border border-gray-300 text-center">
                                    <td>{item.created_at.split("T")[0]}</td>
                                    <td>{item.height} CM</td>
                                    <td>{item.weight} KG</td>
                                    <td>{item.muscle} KG</td>
                                    <td>{item.body_fat} %</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Biểu đồ dưới cùng */}
            <div className="mt-8 border border-gray-300 p-4">
                <h2 className="text-center font-bold text-xl py-4">Biểu đồ so sánh</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis />
                            <Tooltip 
                                formatter={(value) => value?.toFixed(1)}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#ef4444"
                                name="Cân nặng (kg)"
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="muscle"
                                stroke="#3b82f6"
                                name="Tỉ lệ cơ (%)"
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="body_fat"
                                stroke="#f59e0b"
                                name="Tỉ lệ mỡ (%)"
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có dữ liệu để hiển thị biểu đồ
                    </div>
                )}
            </div>
        </div>
    );
}