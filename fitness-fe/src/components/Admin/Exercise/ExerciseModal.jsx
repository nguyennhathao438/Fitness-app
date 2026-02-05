import React from "react";
import { HiX, HiPlus } from "react-icons/hi";

export default function ExerciseModal({
    title,
    setOpenForm,
    register,
    handleSubmit,
    watch,
    errors,
    reset,
    onSubmit,
    isLoading,
    muscleList,
}) {
    const [openMuscleSelect, setOpenMuscleSelect] = React.useState(false);
    const selectedMuscleIds = watch("muscle") || [];

    const addMuscle = (id) => {
        if (selectedMuscleIds.includes(id)) return;
        reset({ ...watch(), muscle: [...selectedMuscleIds, id] }, { keepErrors: true });
    };

    const removeMuscle = (id) => {
        reset({ ...watch(), muscle: selectedMuscleIds.filter(m => m !== id) }, { keepErrors: true });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-[920px] p-6 rounded-xl relative max-h-[90vh] overflow-y-auto">
                {/* CLOSE BUTTON */}
                <button
                    onClick={() => setOpenForm(false)}
                    className="absolute top-3 right-3"
                >
                    <HiX size={22} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{title}</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                    {/* COLUMN 1: INFO */}
                    <div className="flex flex-col gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Tên bài tập</label>
                            <input
                                {...register("name")}
                                placeholder="VD: Shoulder Press"
                                className="w-full border px-3 py-2 rounded"
                            />
                            <p className="text-red-500 text-sm">{errors.name?.message}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Mô tả bài tập</label>
                            <textarea
                                {...register("description")}
                                placeholder="Mô tả cách thực hiện bài tập"
                                className="w-full border px-3 py-2 rounded"
                                rows={4}
                            />
                            <p className="text-red-500 text-sm">{errors.description?.message}</p>
                        </div>

                        {/* Rep & Set */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Số Rep</label>
                                <input
                                    type="number"
                                    {...register("rep_base", { valueAsNumber: true })}
                                    placeholder="VD: 12"
                                    className="border px-3 py-2 rounded w-full"
                                />
                                <p className="text-red-500 text-sm">{errors.rep_base?.message}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Số Set</label>
                                <input
                                    type="number"
                                    {...register("set_base", { valueAsNumber: true })}
                                    placeholder="VD: 4"
                                    className="border px-3 py-2 rounded w-full"
                                />
                                <p className="text-red-500 text-sm">{errors.set_base?.message}</p>
                            </div>
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Thời gian thực hiện (giây)</label>
                            <input
                                type="number"
                                {...register("time_action", { valueAsNumber: true })}
                                placeholder="VD: 60"
                                className="w-full border px-3 py-2 rounded"
                            />
                            <p className="text-red-500 text-sm">{errors.time_action?.message}</p>
                        </div>
                    </div>

                    {/* COLUMN 2: MUSCLE & VIDEO */}
                    <div className="flex flex-col gap-4">
                        {/* Muscle */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nhóm cơ</label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Dropdown */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setOpenMuscleSelect(!openMuscleSelect)}
                                        className="w-full flex justify-between items-center border rounded px-3 py-2 bg-white"
                                    >
                                        <span className="text-sm text-gray-600">Chọn nhóm cơ</span>
                                        <HiPlus className={`transition ${openMuscleSelect ? "rotate-45" : ""}`} />
                                    </button>
                                    {openMuscleSelect && (
                                        <div className="absolute z-20 mt-2 w-full bg-white border rounded shadow max-h-56 overflow-y-auto">
                                            {muscleList.map((m) => {
                                                const isSelected = selectedMuscleIds.includes(m.id);
                                                return (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        disabled={isSelected}
                                                        onClick={() => addMuscle(m.id)}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${isSelected ? "text-gray-400 cursor-not-allowed" : ""}`}
                                                    >
                                                        {m.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Tags */}
                                <div className="min-h-[42px] border rounded p-2 flex flex-wrap gap-2">
                                    {selectedMuscleIds.length === 0 && (
                                        <span className="text-sm text-gray-400">Chưa chọn nhóm cơ</span>
                                    )}
                                    {muscleList
                                        .filter(m => selectedMuscleIds.includes(m.id))
                                        .map(m => (
                                            <span key={m.id} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                                                {m.name}
                                                <button type="button" onClick={() => removeMuscle(m.id)}>
                                                    <HiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                </div>
                            </div>
                            <p className="text-red-500 text-sm mt-1">{errors.muscle?.message}</p>
                        </div>

                        {/* Video */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-semibold">Upload Video</label>
                            <input
                                {...register("video")}
                                placeholder="https://youtube.com/..."
                                className="w-full border px-3 py-2 rounded mb-2"
                            />
                            {watch("video") && (
                                <iframe
                                    className="w-full h-48"
                                    src={watch("video").replace("watch?v=", "embed/")}
                                    title="Video bài tập"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="col-span-2 flex justify-center gap-3 pt-3">
                        <button type="button" onClick={() => setOpenForm(false)} className="px-4 py-2 border rounded">
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">
                            {isLoading ? "Đang lưu ..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
