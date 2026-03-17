import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import OpenVideoModal from "../modals/ExerciseVideoModal";
import ExerciseModal from "../modals/ExerciseModal";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function ExerciseList({
    muscleList,
    exerciseList,
    loadingMuscle,
    loading,
    fetchAllExercises,
}) {
    const [openVideo, setOpenVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [item, setItem] = useState(null);
    const [selectedMuscles, setSelectedMuscles] = useState([]);

    const toggleMuscle = (name) => {
        if (selectedMuscles.includes(name)) {
            setSelectedMuscles(selectedMuscles.filter((m) => m !== name));
        } else {
            setSelectedMuscles([...selectedMuscles, name]);
        }
    };

    const filteredExercises = useMemo(() => {
        if (selectedMuscles.length === 0) return exerciseList;
        return exerciseList.filter((ex) =>
            ex.muscle_groups?.some((m) => selectedMuscles.includes(m.name))
        );
    }, [exerciseList, selectedMuscles]);

    const getYoutubeThumbnail = (url) => {
        if (!url) return "";
        const regExp =
            /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regExp);
        return match
            ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
            : "";
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-6">
                {!loadingMuscle && (
                    <button
                        onClick={() => {
                            setSelectedMuscles([]);
                            fetchAllExercises();
                        }}
                        className={`px-4 py-2 rounded-full text-sm border ${selectedMuscles.length === 0
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-600"
                            }`}
                    >
                        Tất cả
                    </button>
                )}

                {muscleList.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => toggleMuscle(m.name)}
                        className={`px-4 py-2 rounded-full text-sm border ${selectedMuscles.includes(m.name)
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-600"
                            }`}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="w-full flex flex-col items-center justify-center rounded-xl h-[50vh] gap-4">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm">Loading ...</p>
                </div>
            ) : filteredExercises.length === 0 ? (
                <div className="w-full flex items-center justify-center border border-gray-200 rounded-xl h-[50vh] text-center text-xl">
                    Không có bài tập
                </div>
            ) : (
                filteredExercises.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        {/* LEFT */}
                        <div className="flex gap-3">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {item.video ? (
                                    <img
                                        src={getYoutubeThumbnail(item.video)}
                                        alt={item.name}
                                        onClick={() => {
                                            setVideoUrl(item.video);
                                            setOpenVideo(true);
                                        }}
                                        className="cursor-pointer w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg">
                                        💪
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">TÊN BÀI TẬP</p>
                                <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>

                                <p className="text-xs text-gray-400 mt-1 hidden md:block">
                                    MÔ TẢ
                                </p>
                                <p className="text-sm text-gray-600 hidden md:block">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {/* SET REP TIME */}
                        <div className="grid grid-cols-3 text-center text-xs md:text-base">
                            <div>
                                <p className="text-gray-400">SET</p>
                                <p className="font-semibold text-purple-600">{item.set_base}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">REP</p>
                                <p className="font-semibold text-purple-600">{item.rep_base}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">TIME</p>
                                <p className="font-semibold">{item.time_action}</p>
                            </div>
                        </div>

                        {/* ACTION */}
                        <div className="flex md:flex-col gap-2 md:gap-2">
                            <button
                                onClick={() => {
                                    if (!item.video) {
                                        toast.warning("Bài tập này chưa có video");
                                        return;
                                    }
                                    setVideoUrl(item.video);
                                    setOpenVideo(true);
                                }}
                                className="flex-1 md:flex-none flex justify-center items-center gap-1 px-3 py-1 bg-[#BEE3F8] text-[#2563EB] rounded text-sm"
                            >
                                <HiEye />
                                <span className="hidden md:inline">Video</span>
                            </button>

                            <button
                                onClick={() => {
                                    setItem(item);
                                    setOpenForm(true);
                                }}
                                className="flex-1 md:flex-none flex justify-center items-center gap-1 px-3 py-1 bg-[#DCFCE7] text-[#16A34A] rounded text-sm"
                            >
                                <HiPencil />
                                <span className="hidden md:inline">Sửa</span>
                            </button>

                            <button className="flex-1 md:flex-none flex justify-center items-center gap-1 px-3 py-1 bg-[#FFE4E6] text-[#DC2626] rounded text-sm">
                                <HiTrash />
                                <span className="hidden md:inline">Xóa</span>
                            </button>
                        </div>
                    </div>
                ))
            )}

            <OpenVideoModal
                open={openVideo}
                onClose={() => setOpenVideo(false)}
                videoUrl={videoUrl}
            />

            <ExerciseModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                title={"Cập nhật bài tập"}
                item={item}
                onSuccess={fetchAllExercises}
            />
        </div>
    );
}