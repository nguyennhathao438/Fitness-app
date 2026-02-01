import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

/* ===== DATA (SVG ICON) ===== */
const foodsGood = [
    { name: "Chuối", icon: "https://api.iconify.design/emojione-v1:banana.svg", kcal: 89 },
    { name: "Trứng luộc", icon: "https://api.iconify.design/twemoji:egg.svg", kcal: 155 },
    { name: "Bông cải", icon: "https://api.iconify.design/twemoji:broccoli.svg", kcal: 34 },
    { name: "Ức gà", icon: "https://api.iconify.design/emojione-v1:poultry-leg.svg", kcal: 165 },
    { name: "Khoai lang", icon: "https://api.iconify.design/emojione-v1:roasted-sweet-potato.svg", kcal: 86 },
    { name: "Sữa tươi", icon: "https://api.iconify.design/twemoji:glass-of-milk.svg", kcal: 42 },
    { name: "Cá hồi", icon: "https://api.iconify.design/emojione-v1:fish.svg", kcal: 208 },
    { name: "Yến mạch", icon: "https://api.iconify.design/emojione-v1:cooked-rice.svg", kcal: 68 },
    { name: "Đậu hũ", icon: "https://api.iconify.design/emojione-v1:package.svg", kcal: 76 },
    { name: "Táo", icon: "https://api.iconify.design/emojione-v1:red-apple.svg", kcal: 52 },
    { name: "Quả bơ", icon: "https://api.iconify.design/twemoji:avocado.svg", kcal: 160 },
    { name: "Cà rốt", icon: "https://api.iconify.design/twemoji:carrot.svg", kcal: 41 },
    { name: "Hạt hạnh nhân", icon: "https://api.iconify.design/twemoji:chestnut.svg", kcal: 579 },
    { name: "Cá thu", icon: "https://api.iconify.design/emojione-v1:fish.svg", kcal: 305 },
    { name: "Sữa chua", icon: "https://api.iconify.design/twemoji:cup-with-straw.svg", kcal: 59 },
    { name: "Dưa leo", icon: "https://api.iconify.design/twemoji:cucumber.svg", kcal: 16 },
];

const foodsBad = [
    { name: "Hamburger", icon: "https://api.iconify.design/emojione-v1:hamburger.svg", kcal: 295 },
    { name: "Khoai tây chiên", icon: "https://api.iconify.design/emojione-v1:french-fries.svg", kcal: 312 },
    { name: "Pizza", icon: "https://api.iconify.design/emojione-v1:pizza.svg", kcal: 266 },
    { name: "Bánh ngọt", icon: "https://api.iconify.design/emojione-v1:doughnut.svg", kcal: 452 },
    { name: "Gà rán", icon: "https://api.iconify.design/emojione-v1:poultry-leg.svg", kcal: 246 },
    { name: "Nước ngọt", icon: "https://api.iconify.design/twemoji:cup-with-straw.svg", kcal: 40 },
    { name: "Xúc xích", icon: "https://api.iconify.design/twemoji:hot-dog.svg", kcal: 290 },
    { name: "Mì gói", icon: "https://api.iconify.design/emojione-v1:steaming-bowl.svg", kcal: 436 },
    { name: "Trà sữa", icon: "https://api.iconify.design/twemoji:cup-with-straw.svg", kcal: 300 },
    { name: "Bánh snack", icon: "https://api.iconify.design/twemoji:pretzel.svg", kcal: 380 },
    { name: "Kem", icon: "https://api.iconify.design/emojione-v1:ice-cream.svg", kcal: 207 },
    { name: "Bánh quy", icon: "https://api.iconify.design/emojione-v1:cookie.svg", kcal: 502 },
    { name: "Soda có gas", icon: "https://api.iconify.design/twemoji:cup-with-straw.svg", kcal: 40 },
    { name: "Kẹo", icon: "https://api.iconify.design/emojione-v1:candy.svg", kcal: 394 },
    { name: "Bánh mì trắng", icon: "https://api.iconify.design/emojione-v1:bread.svg", kcal: 265 },
    { name: "Snack khoai tây", icon: "https://api.iconify.design/emojione-v1:french-fries.svg", kcal: 312 },
];



/* ===== MAIN COMPONENT ===== */
export default function FoodComparison() {
    return (
        <div className="w-full px-6 py-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
                THỰC PHẨM NÊN ĂN & NÊN TRÁNH KHI TẬP GYM
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FoodSlider
                    title="THỨC ĂN PHÙ HỢP"
                    foods={foodsGood}
                    bg="bg-purple-100"
                    card="bg-white border-purple-300"
                    textColor="text-black"
                />

                <FoodSlider
                    title="THỨC ĂN KHÔNG PHÙ HỢP"
                    foods={foodsBad}
                    bg="bg-slate-900"
                    card="bg-slate-800 border-yellow-400 text-white"
                    textColor="text-white"
                />
            </div>
        </div>
    );
}

/* ===== SLIDER COMPONENT ===== */
function FoodSlider({ title, foods, bg, card, textColor }) {
    const ITEMS_PER_PAGE = 4;
    const totalPages = Math.ceil(foods.length / ITEMS_PER_PAGE);

    const [page, setPage] = useState(0);
    const [pause, setPause] = useState(false);

    /* AUTO SLIDE */
    useEffect(() => {
        if (pause) return;

        const timer = setInterval(() => {
            setPage((prev) => (prev + 1) % totalPages);
        }, 3000);

        return () => clearInterval(timer);
    }, [pause, totalPages]);

    return (
        <div
            className={`rounded-2xl p-6 ${bg}`}
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
        >
            <h2 className={`text-xl font-semibold text-center mb-6 ${textColor}`}>
                {title}
            </h2>

            <div className="relative">
                {/* Arrow Left */}
                {page > 0 && (
                    <button
                        onClick={() => setPage(page - 1)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2
                                   z-20 bg-white text-black p-3 rounded-full shadow
                                   hover:scale-110 transition"
                    >
                        <IoIosArrowBack size={22} />
                    </button>
                )}

                {/* Viewport */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${page * 100}%)` }}
                    >
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className="min-w-full grid grid-cols-2 gap-4 px-1"
                            >
                                {foods
                                    .slice(
                                        i * ITEMS_PER_PAGE,
                                        i * ITEMS_PER_PAGE + ITEMS_PER_PAGE
                                    )
                                    .map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`border rounded-xl p-4 flex flex-col items-center gap-2 ${card}`}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                className="w-10 h-10"
                                            />
                                            <p className="font-medium text-center">
                                                {item.name}
                                            </p>
                                            <span className="text-xs opacity-70">
                                                {item.kcal} kcal / 100g
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Arrow Right */}
                {page < totalPages - 1 && (
                    <button
                        onClick={() => setPage(page + 1)}
                        className="absolute -right-6 top-1/2 -translate-y-1/2
                                   z-20 bg-white text-black p-3 rounded-full shadow
                                   hover:scale-110 transition"
                    >
                        <IoIosArrowForward size={22} />
                    </button>
                )}
            </div>
        </div>
    );
}
