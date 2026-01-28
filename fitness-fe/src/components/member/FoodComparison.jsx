const foodsGood = [
    { name: "Chuối", icon: "🍌" },
    { name: "Trứng luộc", icon: "🥚" },
    { name: "Bông cải", icon: "🥦" },
    { name: "Ức gà", icon: "🍗" },
    { name: "Khoai lang", icon: "🍠" },
    { name: "Sữa tươi", icon: "🥛" },
];

const foodsBad = [
    { name: "Hamburger", icon: "🍔" },
    { name: "Khoai tây chiên", icon: "🍟" },
    { name: "Pizza", icon: "🍕" },
    { name: "Bánh ngọt", icon: "🍩" },
    { name: "Gà rán", icon: "🍗" },
    { name: "Nước ngọt", icon: "🥤" },
];

export default function FoodComparison() {
    return (
        <div className="w-full px-6 py-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
                THỰC PHẨM NÊN ĂN VÀ NÊN TRÁNH VỚI NGƯỜI TẬP GYM
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Thực phẩm phù hợp */}
                <FoodBox
                    title="THỨC ĂN PHÙ HỢP"
                    foods={foodsGood}
                    bg="bg-purple-100"
                    card="bg-white border-purple-300"
                    note="💪 Giàu protein, ít chất béo xấu, nhiều dưỡng chất!"
                />

                {/* Thực phẩm không phù hợp */}
                <FoodBox
                    title="THỨC ĂN KHÔNG PHÙ HỢP"
                    foods={foodsBad}
                    bg="bg-slate-900"
                    card="bg-slate-800 border-yellow-400 text-white"
                    note="⚠️ Nhiều calo rỗng, ít dinh dưỡng, gây tích mỡ!"
                />
            </div>
        </div>
    );
}

function FoodBox({ title, foods, bg, card, note }) {
    return (
        <div className={`rounded-2xl p-6 ${bg}`}>
            {title === "THỨC ĂN PHÙ HỢP" && (
                <h2 className="text-xl text-black font-semibold text-center mb-6">{title}</h2>
            )}
            {title === "THỨC ĂN KHÔNG PHÙ HỢP" && (
                <h2 className="text-xl text-white font-semibold text-center mb-6">{title}</h2>
            )}

            <div className="grid grid-cols-2 gap-4">
                {foods.map((item, index) => (
                    <div
                        key={index}
                        className={`border rounded-xl p-4 flex flex-col items-center gap-2 ${card}`}
                    >
                        <div className="text-3xl">{item.icon}</div>
                        <p className="font-medium">{item.name}</p>
                        <span className="text-sm opacity-70">89 kcal / 100g</span>
                        <span className="text-xs opacity-60">Kali & năng lượng</span>
                    </div>
                ))}
            </div>

            {
                title === "THỨC ĂN PHÙ HỢP" && (
                    <p className="mt-6 text-black text-sm text-center opacity-80">{note}</p>
                )
            }
            {
                title === "THỨC ĂN KHÔNG PHÙ HỢP" && (
                    <p className="mt-6 text-white text-sm text-center opacity-80">{note}</p>
                )
            }
        </div>
    );
}
