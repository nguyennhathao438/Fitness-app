import { HiPlus, HiX, HiPencil, HiTrash, HiEye } from "react-icons/hi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExercise, updateExercise } from "../../services/admin/Exercise";
import { toast } from "react-toastify";
import useExercise from "@/hooks/useExercise";
import ExerciseModal from "@/components/Admin/Exercise/ExerciseModal";
export default function Exercise() {
    /* ================= ZOD (GIỮ NGUYÊN) ================= */
    const exerciseSchema = z.object({
        name: z.string().min(2),
        muscle: z.array(z.coerce.number()).min(1, "Vui lòng chọn ít nhất 1 nhóm cơ"),
        description: z.string().min(5),
        rep_base: z.number().min(1),
        set_base: z.number().min(1),
        time_action: z.number().min(1),
        video: z.string().url().optional().or(z.literal("")),
    });

    const {
        exerciseList,
        muscleList,
        loading,
        loadingMuscle,
        fetchAllExercises,
        fetchByMuscle
    } = useExercise();

    const [openForm, setOpenForm] = useState(false);

    const [openVideo, setOpenVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const [activeTab, setActiveTab] = useState("Tất cả")

    const [exercise, setExercise] = useState(null)
    const [title, setTitle] = useState("")

    const { register, handleSubmit, reset, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(exerciseSchema),
        defaultValues: {
            muscle: [],
        },
    });

    /* ================= SUBMIT (GIỮ NGUYÊN) ================= */
    const onSubmit = async (data) => {
        setIsLoading(true);
        const dataObject = {
            ...data,
            muscle_group_ids: data.muscle,
        };
        try {
            if (title === "Thêm bài tập") {
                await createExercise(dataObject);
                toast.success("Thêm bài tập thành công");
            } else {
                await updateExercise(exercise.id, dataObject);
                toast.success("Cập nhật bài tập thành công ");
            }
            fetchAllExercises();
            handleReset()
            setOpenForm(false);
        } catch (e) {
            toast.error("Lỗi không thể thêm bài tập", e);
        } finally {
            setIsLoading(false);
        }
    };

    const getYoutubeThumbnail = (url) => {
        if (!url) return "";
        const regExp =
            /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regExp);
        return match
            ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
            : "";
    };

    const handleReset = () => {
        reset({
            name: "",
            muscle: "",
            description: "",
            rep_base: "",
            set_base: "",
            time_action: "",
            video: ""
        });
    }
    const handleDefaultValue = (item) => {
        reset({
            name: item.name,
            muscle: item.muscle_groups.map(m => m.id),
            description: item.description,
            rep_base: item.rep_base,
            set_base: item.set_base,
            time_action: item.time_action,
            video: item.video
        });
    }
    return (
        <div className="p-6 bg-purple-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl text-purple-800 font-bold">Exercise Management</h1>
                    <p className="text-md text-purple-500">
                        Manage exercises and workout details
                    </p>
                </div>

                <button
                    onClick={() => { setOpenForm(true), setTitle("Thêm bài tập"), handleReset() }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                    <HiPlus /> Thêm bài tập mới
                </button>
            </div>

            {/* TAB MUSCLE */}
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

                            <button onClick={() => { setTitle("Sửa bài tập"), setOpenForm(true), handleDefaultValue(item), setExercise(item) }} className="flex justify-center items-center gap-2 px-3 py-1 bg-[#DCFCE7] text-[#16A34A] rounded">
                                <HiPencil /> Sửa
                            </button>

                            <button className="flex justify-center items-center gap-2 px-3 py-1 bg-[#FF6B73] text-[#DC2626] rounded">
                                <HiTrash /> Xóa
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* ===== MODAL THÊM BÀI TẬP (FORM GIỮ NGUYÊN) ===== */}
            {openForm && (
                <ExerciseModal
                    title={title}
                    setOpenForm={setOpenForm}
                    register={register}
                    handleSubmit={handleSubmit}
                    watch={watch}
                    errors={errors}
                    reset={reset}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    muscleList={muscleList}
                />
            )}

            {openVideo && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <div className="bg-white w-[720px] rounded-xl p-4 relative">
                        <button
                            onClick={() => setOpenVideo(false)}
                            className="absolute top-3 right-3"
                        >
                            <HiX size={22} />
                        </button>

                        <h3 className="text-lg font-semibold mb-3">
                            Video hướng dẫn
                        </h3>

                        <iframe
                            className="w-full h-[400px] rounded"
                            src={videoUrl.replace("watch?v=", "embed/")}
                            title="Exercise Video"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
