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
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;

    const getCloudinaryThumbnail = (url) => {
        if (!url) return "";
        return url
            .replace("/video/upload/", "/video/upload/so_15/")
            .replace(".mp4", ".jpg");
    };

    const toggleMuscle = (name) => {
        setPage(1);
        if (selectedMuscles.includes(name)) {
            setSelectedMuscles(selectedMuscles.filter((m) => m !== name));
        } else {
            setSelectedMuscles([...selectedMuscles, name]);
        }
    };

    const filteredExercises = useMemo(() => {
        let list = exerciseList;
        if (selectedMuscles.length > 0) {
            list = list.filter((ex) =>
                ex.muscle_groups?.some((m) => selectedMuscles.includes(m.name))
            );
        }
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            list = list.filter((ex) => ex.name.toLowerCase().includes(term));
        }
        return list;
    }, [exerciseList, selectedMuscles, searchTerm]);

    const totalPages = Math.ceil(filteredExercises.length / pageSize);
    const paginatedExercises = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredExercises.slice(start, start + pageSize);
    }, [filteredExercises, page]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                {!loadingMuscle && (
                    <button onClick={() => { setSelectedMuscles([]); fetchAllExercises(); }}
                        className={`px-4 py-2 rounded-full text-sm border ${selectedMuscles.length === 0 ? "bg-purple-600 text-white" : "bg-white text-gray-600"}`} >
                        Tất cả
                    </button>
                )}

                {muscleList.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => toggleMuscle(m.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedMuscles.includes(m.name) ? "bg-purple-600 text-white shadow" : "bg-white border border-gray-300 text-gray-600 hover:bg-purple-50"}`}>
                        {m.name}
                    </button>
                ))}
            </div>
            {/* SEARCH INPUT */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    placeholder="Tìm kiếm bài tập..."
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
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
                paginatedExercises.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6">
                        {/* LEFT */}
                        <div className="flex gap-4 items-start md:items-center flex-1 min-w-0">

                            {/* THUMBNAIL */}
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {item.video ? (
                                    <img
                                        src={getCloudinaryThumbnail(item.video)}
                                        alt={item.name}
                                        onClick={() => {
                                            setVideoUrl(item.video);
                                            setOpenVideo(true);
                                        }}
                                        className="cursor-pointer w-full h-full object-cover group-hover:scale-110 transition"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                        💪
                                    </div>
                                )}
                            </div>

                            {/* INFO */}
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                                    {item.name}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden md:block">
                                    {item.description}
                                </p>

                                {/* MUSCLE TAG */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {item.muscle_groups?.map((m) => (
                                        <span
                                            key={m.id}
                                            className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full"
                                        >
                                            {m.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SET REP TIME */}
                        {/* SET REP TIME */}
                        <div className="grid grid-cols-3 text-center w-full md:w-[200px] justify-items-center bg-gray-50 rounded-xl py-2">
                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-xs">SET</p>
                                <p className="font-semibold text-purple-600 text-lg">{item.set_base}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-xs">REP</p>
                                <p className="font-semibold text-purple-600 text-lg">{item.rep_base}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-xs">TIME</p>
                                <p className="font-semibold text-purple-600 text-lg">{item.time_action}</p>
                            </div>
                        </div>

                        {/* ACTION */}
                        <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                            {/* Video */}
                            <button
                                onClick={() => {
                                    if (!item.video) {
                                        toast.warning("Bài tập này chưa có video");
                                        return;
                                    }
                                    setVideoUrl(item.video);
                                    setOpenVideo(true);
                                }}
                                className="flex items-center justify-center gap-1 h-8 px-3 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl text-xs font-medium transition transform hover:scale-105 flex-1"
                            >
                                <HiEye className="w-4 h-4" />
                                <span className="hidden md:inline">Video</span>
                            </button>

                            {/* Edit */}
                            <button
                                onClick={() => {
                                    setItem(item);
                                    setOpenForm(true);
                                }}
                                className="flex items-center justify-center gap-1 h-8 px-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl text-xs font-medium transition transform hover:scale-105 flex-1"
                            >
                                <HiPencil className="w-4 h-4" />
                                <span className="hidden md:inline">Sửa</span>
                            </button>

                            {/* Delete */}
                            <button
                                onClick={() => {
                                    toast.warning("Chưa implement xóa");
                                }}
                                className="flex items-center justify-center gap-1 h-8 px-3 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white rounded-xl text-xs font-medium transition transform hover:scale-105 flex-1"
                            >
                                <HiTrash className="w-4 h-4" />
                                <span className="hidden md:inline">Xóa</span>
                            </button>
                        </div>
                    </div>
                ))
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">

                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded border disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded border text-sm ${page === i + 1
                                ? "bg-purple-600 text-white"
                                : "bg-white"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>
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