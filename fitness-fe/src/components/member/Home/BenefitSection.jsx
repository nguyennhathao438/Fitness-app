import { HiHeart, HiUser, HiLightningBolt } from "react-icons/hi";

export default function BenefitsSection() {
    const benefits = [
        {
            title: "SỨC KHỎE TIM MẠCH",
            icon: <HiHeart className="w-12 h-12 text-red-500 group-hover:scale-110 transition-transform duration-300" />,
        },
        {
            title: "CƠ THỂ VỮNG CHẮC",
            icon: <HiUser className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform duration-300" />,
        },
        {
            title: "CƠ BẮP DẺO DAI",
            icon: <HiLightningBolt className="w-12 h-12 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />,
        },
        {
            title: "TĂNG CƯỜNG SỨC MẠNH",
            icon: <HiLightningBolt className="w-12 h-12 text-purple-500 group-hover:scale-110 transition-transform duration-300" />,
        },
    ];

    return (
        <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">

                {/* title */}
                <h2 className="text-4xl font-bold mb-4 text-gray-800">
                    LỢI ÍCH CỦA VIỆC TẬP LUYỆN
                </h2>

                <p className="text-gray-600 mb-14 max-w-3xl mx-auto">
                    Khác với tập một mình, huấn luyện viên sẽ giúp bạn mang lại những kết
                    quả tối ưu nhất cho các mục tiêu hình thể cá nhân, đảm bảo những giờ
                    tập luyện thể thao an toàn, đúng cách và hiệu quả.
                </p>

                {/* grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {benefits.map((item, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center gap-4 cursor-pointer"
                        >
                            <div className="bg-gray-100 p-4 rounded-full">
                                {item.icon}
                            </div>

                            <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-purple-600 transition">
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}