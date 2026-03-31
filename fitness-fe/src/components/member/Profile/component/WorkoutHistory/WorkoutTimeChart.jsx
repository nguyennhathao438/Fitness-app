import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useWorkoutHistory from '../../hooks/useWorkoutHistory';

function formatDateShort(date) {
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit"
    });
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    if (day !== 1) d.setHours(-24 * (day - 1));
    return d;
}

export default function WorkoutTimeChart({ currentWeek = new Date() }) {
    const { workoutHistories, loading } = useWorkoutHistory();
    const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];


    // Tính các ngày trong tuần
    const startOfWeek = getStartOfWeek(currentWeek);
    const weekDates = [...Array(7)].map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    // Tính toán tổng thời gian cho mỗi ngày
    const chartData = weekDates.map((date, index) => {
        const dateString = date.toISOString().split("T")[0];
        const workoutsForDate = workoutHistories.filter(w => {
            const workoutDate = new Date(w.created_at).toISOString().split("T")[0];
            return workoutDate === dateString;
        });

        let totalTime = 0;
        workoutsForDate.forEach(workout => {
            // Sử dụng total_time từ workout history (đã tính sẵn, đơn vị giây)
            const timeInSeconds = workout.total_time || 0;
            totalTime += Math.round(timeInSeconds / 60); // Chuyển từ giây sang phút
        });

        return {
            date: formatDateShort(date),
            day: weekDays[index],
            time: totalTime,
            fullDate: date
        };
    });

    const totalTimeWeek = chartData.reduce((sum, d) => sum + d.time, 0);
    const avgTimePerDay = totalTimeWeek > 0 ? Math.round(totalTimeWeek / 7) : 0;
    const maxTime = Math.max(...chartData.map(d => d.time), 0);

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thống Kê Thời Gian Tập</h2>
                <p className="text-gray-600">Tổng thời gian tập hàng ngày (phút)</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-96 text-gray-500">
                    Đang tải dữ liệu...
                </div>
            ) : (
                <>
                    <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="day" 
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                    stroke="#9ca3af"
                                    label={{ value: 'Phút', angle: -90, position: 'insideLeft' }}
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    labelFormatter={(label) => `${label}`}
                                    formatter={(value) => [`${value} phút`, 'Thời gian']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="time" 
                                    stroke="#a855f7" 
                                    strokeWidth={3}
                                    dot={{ fill: '#a855f7', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    isAnimationActive
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Tổng thời gian tuần</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {totalTimeWeek} 
                                <span className="text-lg text-gray-600"> phút</span>
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Trung bình/ngày</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {avgTimePerDay}
                                <span className="text-lg text-gray-600"> phút</span>
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Ngày tập nhiều nhất</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {maxTime}
                                <span className="text-lg text-gray-600"> phút</span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
