import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import gymImg from "../../../assets/gym.jpg"
import { Link } from "react-router-dom";
import { Dumbbell,Apple,Droplet,ClipboardList,Activity,Salad, Lock,ShowerHead,Scale,Shirt} from "lucide-react";
import { getAllTrainingPackages } from "../../../services/member/TraningPakageService";
export default function InfoPackage() {
    const benefits = [
        { name: "Khăn tập", icon: Shirt },
        { name: "Dụng cụ tập", icon: Dumbbell },
        { name: "Thức ăn nhẹ", icon: Apple },
        { name: "Nước uống", icon: Droplet },
        { name: "Lộ trình tập", icon: ClipboardList },
        { name: "Phân tích thể trạng", icon: Activity },
        { name: "Tư vấn dinh dưỡng", icon: Salad },
        { name: "Tủ locker", icon: Lock },
        { name: "Nhà tắm", icon: ShowerHead },
        { name: "Máy inbody", icon: Scale },
    ];
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
                        <li key={item.id} className="group shrink-0 w-[220px] h-[220px] px-2">
                            <div className="w-full h-full [perspective:1000px]">
                                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                    {/* Front */}
                                    <div className="absolute inset-0 rounded-xl bg-[#474274] flex flex-col items-center justify-center text-center p-4 shadow-sm border border-gray-400 [backface-visibility:hidden]">
                                        <h3 className="text-center text-white text-lg font-semibold">{item.name}</h3>
                                        <p className="text-center text-amber-400 my-2 font-bold text-2xl">{formatVND(item.price)}</p>
                                        <p className="text-center text-white text-sm">{item.duration_days} ngày</p>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute inset-0 rounded-xl bg-white p-4 flex flex-col gap-3 items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                        <span className="font-bold text-xl">Chi tiết gói tập</span>
                                        <p className="text-gray-700 text-sm font-bold">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Nút phải */}
                <button onClick={() => scroll("right")} className={`absolute -right-5 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow z-10 ${!canScrollRight ? "opacity-0 pointer-events-none" : "hover:bg-gray-100"}`}>
                    <IoIosArrowForward size={22} />
                </button>
            </div>


            <div className="relative mt-20">
                <img src={gymImg} className="w-full h-[450px] object-cover" />
                <div className="absolute inset-0 bg-[#474274]/70 flex flex-col items-center justify-center px-6">
                    <h2 className="text-white text-2xl font-bold mb-10 text-center">
                        LOẠT TIỆN ÍCH ĐI KÈM MIỄN PHÍ
                    </h2>

                    {/* GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-white text-center">
                        {benefits.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 hover:scale-105 transition">
                                <item.icon size={30} className="text-amber-400" />
                                <p>{item.name}</p>
                            </div>
                        ))}
                    </div>

                    <Link to="/pricing-packages">
                        <button className="mt-10 px-8 py-3 bg-white text-[#474274] font-semibold rounded-lg hover:bg-gray-100 transition">
                            Đăng ký tập ngay
                        </button>
                    </Link>

                </div>

            </div>
        </div>
    );
}
