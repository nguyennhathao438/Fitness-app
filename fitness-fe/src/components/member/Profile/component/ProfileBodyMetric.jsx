import { useEffect, useState } from "react";
import { getBodyMetric, getLatestBodyMetric, createBodyMetric } from "../../../../services/member/MemberService";
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
import { Activity, PersonStanding } from "lucide-react";
import UpdateBodyMetricModal from "../modals/UpdateBodyMetricModal";
import { useBodyMetric } from "../hooks/useBodyMetric";
export default function ProfileBodyMetric() {
    const [showUpdateBodyMetric, setShowUpdateBodyMetric] = useState(false)

    const {
        bodyMetricList,
        bodyMetricNew,
        refetch
    } = useBodyMetric();

    // Format dữ liệu cho biểu đồ
    const chartData = [...bodyMetricList]
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((item) => ({
            date: item.created_at?.split("T")[0],
            weight: item.weight,
            muscle: item.muscle,
            body_fat: item.body_fat,
        }));

    return (
        <div>
            <h2 className="flex items-center justify-center gap-2 text-center text-[#5a548c] font-bold text-2xl py-4">
                <Activity className="w-6 h-6 text-[#5a548c]" />
                CHỈ SỐ CƠ THỂ CỦA BẠN
            </h2>
            <div className="flex flex-col md:flex-row">
                <div className="flex-1 flex flex-col">
                    <h2 className="text-center font-bold text-xl py-4">Chỉ số cơ thể lần gần nhất</h2>
                    <div className="grid grid-cols-2 gap-4 lg:px-20 md:px-10">
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span className="font-bold">Chiều cao</span>
                            <span>{bodyMetricNew?.height} cm</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span className="font-bold">Cân nặng</span>
                            <span>{bodyMetricNew?.weight} kg</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span className="font-bold">Tỉ lệ cơ</span>
                            <span>{bodyMetricNew?.muscle} kg</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span className="font-bold">Mỡ cơ thể</span>
                            <span>{bodyMetricNew?.body_fat} %</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span className="font-bold">Mỡ nội tạng</span>
                            <span>mức {bodyMetricNew?.visceral_fat}</span>
                        </div>
                        <div className="border border-gray-300 rounded-md flex flex-col p-2 items-center">
                            <span className="font-bold">Nước cơ thể</span>
                            <span>{bodyMetricNew?.body_water} %</span>
                        </div>
                    </div>
                    <div className="flex mt-5 justify-center">
                        <button onClick={() => { setShowUpdateBodyMetric(true) }} className="flex bg-violet-600 hover:bg-violet-700 rounded-md px-5 py-2 gap-2 cursor-pointer text-white"><PersonStanding />Cập nhật chỉ số cơ thể</button>
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
                                <th className="border border-gray-300 p-2">Mỡ cơ thể</th>
                                <th className="border border-gray-300 p-2">Mỡ nội tạng</th>
                                <th className="border border-gray-300 p-2">Nước cơ thể</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bodyMetricList.map((item) => (
                                <tr className="border border-gray-300 text-center">
                                    <td>{item.created_at?.split("T")[0]}</td>
                                    <td>{item.height} CM</td>
                                    <td>{item.weight} KG</td>
                                    <td>{item.muscle} KG</td>
                                    <td>{item.body_fat} %</td>
                                    <td>mức {item.visceral_fat}</td>
                                    <td>{item.body_water} %</td>
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
            <UpdateBodyMetricModal
                open={showUpdateBodyMetric}
                onClose={() => setShowUpdateBodyMetric(false)}
                onSuccess={() => {
                    refetch(); 
                }}
            />
        </div>
    );
}