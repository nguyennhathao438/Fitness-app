import { useEffect, useState } from "react";
import { getBodyMetric, getLatestBodyMetric, createBodyMetric } from "../../services/member/MemberService";
import { useForm } from "react-hook-form";
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
const bodyMetricSchema = z.object({
    height: z.
        string()
        .min(1, "Vui lòng nhập chiều cao")
        .min(2, "Chiều cao phải nhập 3 số (VD: 175)")
        .max(4, "Chiều cao phải nhập 3 số (VD: 175)"),
    weight: z.
        string()
        .min(1, "Vui lòng nhập cân nặng")
        .max(4, "Cân nặng không hợp lý"),
    muscle: z.
        string()
        .min(1, "Vui lòng nhập tỷ lệ cơ")
        .max(4, "Tỷ lệ cơ không hợp lý"),
    body_fat: z
        .string()
        .min(1, "Vui lòng nhập tỷ lệ mỡ cơ thể")
        .max(4, "Tỷ lệ mỡ cơ thể không hợp lệ"),
    visceral_fat: z
        .string()
        .min(1, "Vui lòng nhập mỡ nội tạng")
        .max(4, "Giá trị mỡ nội tạng không hợp lệ"),
    body_water: z
        .string()
        .min(1, "Vui lòng nhập tỷ lệ nước trong cơ thể")
        .max(4, "Tỷ lệ nước trong cơ thể không hợp lệ"),
})

export default function ProfileBMI() {
    const [bodyMetricNew, setBodyMetricNew] = useState({})
    const [bodyMetric, setBodyMetric] = useState([]);
    const [showUpdateBodyMetric, setShowUpdateBodyMetric] = useState(false)
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(bodyMetricSchema),
    });

    const handleResetBodyMetricForm = () => {
        reset({
            height: "",
            weight: "",
            body_water: "",
            visceral_fat: "",
            body_fat: "",
            muscle: ""
        })
    }


    const onSubmit = async (data) => {
        try {
            console.log("data", data)
            await createBodyMetric(data);
            const resp = await getBodyMetric();
            setBodyMetric(resp.data.data);
            const latest = await getLatestBodyMetric();
            setBodyMetricNew(latest.data.data);
            handleResetBodyMetricForm()
            setShowUpdateBodyMetric(false);
        } catch (error) {
            console.error("Error creating body metric:", error);
        }
    };

    const onError = (err) => {
        const firstErr = Object.values(err)[0]
        if (firstErr)
            toast.error(firstErr.message)
    };

    const updateBodyMetricJSX = (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="space-y-8 text-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Đo chỉ số cơ thể
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">

                    {/* Chiều cao */}
                    <div className="space-y-1">
                        <label className="text-sm text-violet-200">
                            Chiều cao (cm)
                        </label>
                        <input
                            {...register("height")}
                            type="number"
                            placeholder="VD: 175"
                            className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                        />
                    </div>

                    {/* Cân nặng */}
                    <div className="space-y-1">
                        <label className="text-sm text-violet-200">
                            Cân nặng (kg)
                        </label>
                        <input
                            {...register("weight")}
                            type="number"
                            placeholder="VD: 65"
                            className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                        />
                    </div>

                    {/* Tỷ lệ cơ */}
                    <div className="space-y-1">
                        <label className="text-sm text-violet-200">
                            Tỷ lệ cơ (kg)
                        </label>
                        <input
                            {...register("muscle")}
                            type="number"
                            step="0.1"
                            placeholder="VD: 42.5"
                            className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                        />
                    </div>

                    {/* Mỡ cơ thể */}
                    <div className="space-y-1">
                        <label className="text-sm text-violet-200">
                            Mỡ cơ thể (%)
                        </label>
                        <input
                            {...register("body_fat")}
                            type="number"
                            step="0.1"
                            placeholder="VD: 18.3"
                            className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                        />
                    </div>

                    {/* Mỡ nội tạng */}
                    <div className="space-y-1">
                        <label className="text-sm text-violet-200">
                            Mỡ nội tạng (level)
                        </label>
                        <input
                            {...register("visceral_fat")}
                            type="number"
                            placeholder="VD: 8"
                            className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                        />
                    </div>

                    {/* Nước cơ thể */}
                    <div className="space-y-1">
                        <label className="text-sm text-violet-200">
                            Nước cơ thể (%)
                        </label>
                        <input
                            {...register("body_water")}
                            type="number"
                            step="0.1"
                            placeholder="VD: 55.2"
                            className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                        />
                    </div>

                </div>

                <div className="flex justify-center space-x-3">
                    <button
                        type="submit"
                        className=" border border-white/30 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-white/20"
                    >
                        Xác nhận
                    </button>
                    <button
                        type="button"
                        onClick={() => {setShowUpdateBodyMetric(false),handleResetBodyMetricForm()}}
                        className="bg-transparent border border-white/30 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-white/10"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </form>

    );


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
                            {bodyMetric.map((item) => (
                                <tr className="border border-gray-300 text-center">
                                    <td>{item.created_at.split("T")[0]}</td>
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
                {showUpdateBodyMetric && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="bg-gradient-to-br from-[#5a548c] to-[#6f5fb5] p-6 rounded-lg w-full max-w-2xl relative text-white shadow-lg border border-[#6f5fb5]/30">
                            <button
                                onClick={() => setShowUpdateBodyMetric(false)}
                                className="absolute top-3 right-3 text-white hover:text-gray-100"
                            >
                                ✕
                            </button>
                            {updateBodyMetricJSX}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}