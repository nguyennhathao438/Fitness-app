import { HiHeart, HiUser, HiLightningBolt } from "react-icons/hi";


export default function BenefitsSection() {
    const benefits = [
        { title: "SỨC KHỎE TIM MẠCH", icon: <HiHeart className="w-12 h-12 text-red-500" /> },
        { title: "CƠ THỂ VỮNG CHẮC", icon: <HiUser className="w-12 h-12 text-blue-500" /> },
        { title: "CƠ BẮP DẺO DAI", icon: <HiLightningBolt className="w-12 h-12 text-yellow-500" /> },
        { title: "TĂNG CƯỜNG SỨC MẠNH", icon: <HiLightningBolt className="w-12 h-12 text-purple-500" /> },
    ];

    return (
        <section className="bg-gray-100 py-16 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    LỢI ÍCH CỦA VIỆC TẬP LUYỆN
                </h2>
                <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
                    Khác với tập một mình, huấn luyện viên sẽ giúp bạn mang lại những kết
                    quả tối ưu nhất cho các mục tiêu hình thể cá nhân, đảm bảo những giờ
                    tập luyện thể thao an toàn, đúng cách và hiệu quả. Ngoài ra huấn luyện
                    viên còn gợi ý chế độ ăn uống kết hợp với tập luyện dựa theo mục tiêu
                    khách hàng để khách hàng đạt kết quả nhanh nhất.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {benefits.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-4">
                            {item.icon}
                            <p className="text-sm font-semibold text-gray-700 text-center">
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
