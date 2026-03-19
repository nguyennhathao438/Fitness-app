function SuggestionBox({ title, group, muscles, onSelectGroup }) {
    return (
        <div
            onClick={() => onSelectGroup(group)}
            className="cursor-pointer p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center w-full max-w-xs"
        >
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {muscles.map((muscle) => (
                    <span
                        key={muscle}
                        className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                    >
                        {muscle}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function WorkoutSuggestion({ onSelectGroup }) {
    return (
        <div className="py-10 rounded-2xl px-4 bg-gray-50 flex justify-center">
            <div className="w-full max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">
                    Thêm bài tập từ danh sách yêu thích
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                    <SuggestionBox
                        title="Thân trên"
                        group="upper"
                        muscles={["Ngực", "Lưng", "Vai", "Tay trước", "Vai giữa", "Tay sau", "Cẳng tay"]}
                        onSelectGroup={onSelectGroup}
                    />
                    <SuggestionBox
                        title="Cơ bụng"
                        group="core"
                        muscles={["Cơ xiên bụng", "Lưng dưới"]}
                        onSelectGroup={onSelectGroup}
                    />
                    <SuggestionBox
                        title="Thân dưới"
                        group="lower"
                        muscles={["Đùi trước", "Đùi sau", "Mông", "Bắp chân"]}
                        onSelectGroup={onSelectGroup}
                    />
                </div>
            </div>
        </div>
    );
}