import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import gymImg from "../../assets/img/gym.jpg"
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllTrainingPackages } from "../../services/member/TraningPakageService";
export default function InfoPackage() {
    const [packages, setPackages] = useState([]);
    useEffect(() => {
        getAllTrainingPackages().then((res) => {
            setPackages(res.data.data);
        })
    }, [])

    const formatVND = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const checkScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);

        };
        // đợi DOM render xong
        requestAnimationFrame(checkScroll);
        el.addEventListener("scroll", checkScroll);
        return () => el.removeEventListener("scroll", checkScroll);
    }, [packages]);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const { scrollLeft, clientWidth } = scrollRef.current;
        scrollRef.current.scrollTo({
            left:
                direction === "left"
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth,
            behavior: "smooth",
        });
    };

    return (
        <div className="mt-10">
            <h2 className="text-center font-bold text-3xl text-[#5E5E5E]"> CÁC GÓI TẬP CỦA CHÚNG TÔI</h2>
            <p className="text-center font-medium my-3 text-xl">Các gói tập được thiết kế khoa học và phù hợp từ chuyên gia</p>
            {/* Slider */}
            <div className="relative w-[1000px] mx-auto">
                {/* Nút trái */}
                <button onClick={() => scroll("left")} className={`absolute -left-5 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow z-10 ${!canScrollLeft ? "opacity-0 pointer-events-none" : "hover:bg-gray-100"}`}>
                    <IoIosArrowBack size={22} />
                </button>

                {/* Viewport: chỉ rộng 4 gói */}
                <ul
                    ref={scrollRef}
                    className="flex gap-10 overflow-x-auto scroll-smooth md:overflow-hidden ">
                    {packages.map((item) => (
                        <li key={item.id} className="group relative shrink-0 w-[220px] py-6 px-4 rounded-xl border border-gray-400 bg-[#474274] shadow hover:shadow-lg transition-shadow">
                            <h3 className="text-center text-white text-lg font-semibold">{item.name}</h3>
                            <p className="text-center text-amber-400 my-2 font-bold text-2xl">{formatVND(item.price)}</p>
                            <p className="text-center text-white text-sm">{item.duration_days} ngày</p>

                            {/* Description hover */}
                            <div className="absolute top-0 left-0 w-full h-full bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-gray-700 text-sm">{item.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Nút phải */}
                <button onClick={() => scroll("right")} className={`absolute -right-5 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow z-10 ${!canScrollRight ? "opacity-0 pointer-events-none" : "hover:bg-gray-100"}`}>
                    <IoIosArrowForward size={22} />
                </button>
            </div>


            <div className="relative h-[60vh] my-5 overflow-hidden">
                <img src={gymImg} alt="" className="object-cover h-full w-full " />
                <div className="absolute inset-0  bg-[#474274]/50"></div>
                <h2 className="absolute top-10 text-center text-white font-bold text-2xl left-1/2 -translate-x-1/2">LOẠT TIỆN ÍCH ĐI KÈM MIỄN PHÍ</h2>
                <div className="flex flex-row justify-around absolute top-25 left-5 right-5 md:right-25 md:left-25">
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Khăn tập</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Dụng cụ tập</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Thức ăn nhẹ</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Nước uống</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Xây dựng lộ trình</p>
                    </div>
                </div>
                <div className="flex flex-row justify-around absolute right-5 left-5 md:right-25 md:left-25 top-50 ">
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Phân tích thể trạng</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Tư vấn dinh dưỡng</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Tủ locker</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Nhà tắm</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="text-white" />
                        <p className="text-white">Máy inbody</p>
                    </div>
                </div>
                <Link to="/pricing-packages">
                    <button className="absolute left-1/2 -translate-x-1/2 top-75 rounded-xl cursor-pointer px-7 py-2 bg-white">Đăng ký tập ngay</button>
                </Link>
            </div>
        </div>
    );
}
