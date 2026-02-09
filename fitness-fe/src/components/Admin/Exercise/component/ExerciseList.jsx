import useExercise from "@/hooks/useExercise";
import { useState } from "react";
import { toast } from "react-toastify";
import OpenVideoModal from "../modals/ExerciseVideoModal";
import ExerciseModal from "../modals/ExerciseModal";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

export default function ExerciseList() {
    const { exerciseList,
        muscleList,
        loading,
        loadingMuscle,
        fetchAllExercises,
        fetchByMuscle,
    } = useExercise();

    const [openVideo, setOpenVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [openForm, setOpenForm] = useState(false)
    const [item, setItem] = useState(null)
    const [activeTab, setActiveTab] = useState("Tất cả")

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
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
                {!loadingMuscle && (<button onClick={() => { fetchAllExercises(), setActiveTab("Tất cả") }} className={`px-4 py-2 rounded-full text-sm border ${activeTab === "Tất cả" ? "bg-purple-600 text white" : "bg-white text-gray-600"}`}>Tất cả</button>
                )}
                {muscleList.map((m, i) => (
                    <button
                        onClick={() => { fetchByMuscle(m.id), setActiveTab(m.name) }}
                        key={i}
                        className={`px-4 py-2 rounded-full text-sm border ${activeTab === m.name
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-600"
                            }`}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            {/* ===== MOCK CARD (UI DEMO) ===== */}
            {loading ? (
                <div className="w-full flex items-center justify-center border border-gray-200 rounded-xl h-[50vh] text-center text-xl">{"Đang tải dữ liệu ..."}</div>
            ) : exerciseList.length === 0 ? (
                <div className="w-full flex items-center justify-center border border-gray-200 rounded-xl h-[50vh] text-center text-xl">
                    Không có bài tập
                </div>
            ) : (
                exerciseList.map((item) => (
                    <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                                {item.video ? (
                                    <img
                                        src={getYoutubeThumbnail(item.video)}
                                        onClick={() => {
                                            setVideoUrl(item.video);
                                            setOpenVideo(true);
                                        }}
                                        className="cursor-pointer hover:scale-105 transition"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl">
                                        💪
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">TÊN BÀI TẬP</p>
                                <h3 className="font-semibold">{item.name}</h3>

                                <p className="text-xs hidden md:block text-gray-400 mt-2">MÔ TẢ</p>
                                <p className="text-sm hidden md:block text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5 md:gap-10 text-center">
                            <div>
                                <p className="text-xs text-gray-400 md:text-lg">SỐ SET</p>
                                <p className="text-xs md:text-lg font-semibold text-purple-600">{item.set_base}</p>
                            </div>
                            <div>
                                <p className=" text-xs md:text-lg text-gray-400">SỐ REP</p>
                                <p className="text-xs md:text-lg font-semibold text-purple-600">{item.rep_base}</p>
                            </div>
                            <div>
                                <p className=" text-xs md:text-lg text-gray-400">THỜI GIAN</p>
                                <p className="text-xs md:text-lg font-semibold">{item.time_action}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    if (!item.video) {
                                        toast.warning("Bài tập này chưa có video");
                                        return;
                                    }
                                    setVideoUrl(item.video);
                                    setOpenVideo(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1 bg-[#BEE3F8] text-[#2563EB] rounded"
                            >
                                <HiEye /> Video
                            </button>

                            <button onClick={() => { setItem(item), setOpenForm(true) }} className="flex justify-center items-center gap-2 px-3 py-1 bg-[#DCFCE7] text-[#16A34A] rounded">
                                <HiPencil /> Sửa
                            </button>

                            <button className="flex justify-center items-center gap-2 px-3 py-1 bg-[#FF6B73] text-[#DC2626] rounded">
                                <HiTrash /> Xóa
                            </button>
                        </div>
                    </div>
                ))
            )}
            <OpenVideoModal open={openVideo} onClose={()=>setOpenVideo(false)} videoUrl={videoUrl}/>
            <ExerciseModal open={openForm} onClose={()=>setOpenForm(false)} title={"Cập nhật bài tập"} item={item} onSuccess={fetchAllExercises}/>
        </div>
    );
}