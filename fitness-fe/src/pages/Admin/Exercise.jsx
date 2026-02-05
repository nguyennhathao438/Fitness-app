import { HiPlus, HiX, HiPencil, HiTrash, HiEye } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExercise, getAllExcercise, getExercisesByMuscleGroup, updateExercise } from "../../services/admin/Exercise";
import { getAllMuscleGroup } from "@/services/admin/MuscleGroup";
import { toast } from "react-toastify";

export default function TabbarExercise() {
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

    /* ================= STATE ================= */
    const [openForm, setOpenForm] = useState(false);

    const [listMuscle, setListMuscle] = useState([]);
    const [listExercise, setListExercise] = useState([])

    const [openVideo, setOpenVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const [activeTab, setActiveTab] = useState("Tất cả")

    const [exercise, setExercise] = useState(null)
    const [title, setTitle] = useState("")
    const [isLoadingMuscle, setIsLoadingMuscle] = useState(false)
    const fetchAllExercise = async () => {
        setIsLoading(true)
        try {
            const response = await getAllExcercise();
            setListExercise(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi không thể lấy dữ liệu bài tập");
        } finally {
            setIsLoading(false)
        }
    };


    const fetchExerciseByMuscleGroupId = async (muscleGroupId) => {
        setIsLoading(true)
        try {
            const response = await getExercisesByMuscleGroup(muscleGroupId);
            setListExercise(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi không thể lấy dữ liệu bài tập theo nhóm cơ");
        } finally {
            setIsLoading(false)
        }
    };


    const fetchMusleGroups = async () => {
        setIsLoadingMuscle(true)
        try {
            const reponse = await getAllMuscleGroup()
            setListMuscle(reponse.data)
        } catch (error) {
            toast.error("Lỗi không thể lấy dữ liệu", error)
        } finally {
            setIsLoadingMuscle(false)
        }
    }

    const { register, handleSubmit, reset, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(exerciseSchema),
        defaultValues: {
            muscle: [],
        },
    });

    useEffect(() => {
        fetchAllExercise();
        fetchMusleGroups()
    }, []);

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
            fetchAllExercise();
            handleReset()
            setOpenForm(false);
        } catch (e) {
            toast.error("Lỗi không thể thêm bài tập", e);
        } finally {
            setIsLoading(false);
        }
    };

    const [openMuscleSelect, setOpenMuscleSelect] = useState(false);

    const selectedMuscleIds = watch("muscle") || [];

    const addMuscle = (id) => {
        if (selectedMuscleIds.includes(id)) return;
        reset(
            { ...watch(), muscle: [...selectedMuscleIds, id] },
            { keepErrors: true }
        );
    };

    const removeMuscle = (id) => {
        reset(
            { ...watch(), muscle: selectedMuscleIds.filter(m => m !== id) },
            { keepErrors: true }
        );
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
            <div className="flex gap-3 mb-6">
                {!isLoadingMuscle && (<button onClick={() => { fetchAllExercise(), setActiveTab("Tất cả") }} className={`px-4 py-2 rounded-full text-sm border ${activeTab === "Tất cả" ? "bg-purple-600 text white" : "bg-white text-gray-600"}`}>Tất cả</button>
                )}
                {listMuscle.map((m, i) => (
                    <button
                        onClick={() => { fetchExerciseByMuscleGroupId(m.id), setActiveTab(m.name) }}
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
            {isLoading ? (
                <div className="w-full flex items-center justify-center border border-gray-200 rounded-xl h-[50vh] text-center text-xl">{"Đang tải dữ liệu ..."}</div>
            ) : listExercise.length === 0 ? (
                <div className="w-full flex items-center justify-center border border-gray-200 rounded-xl h-[50vh] text-center text-xl">
                    Không có bài tập
                </div>
            ) : (
                listExercise.map((item) => (
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

                                <p className="text-xs text-gray-400 mt-2">MÔ TẢ</p>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-10 text-center">
                            <div>
                                <p className="text-xs text-gray-400">SỐ SET</p>
                                <p className="font-semibold text-purple-600">{item.set_base}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">SỐ REP</p>
                                <p className="font-semibold text-purple-600">{item.rep_base}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">THỜI GIAN</p>
                                <p className="font-semibold">{item.time_action}</p>
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
                                <HiEye /> Xem video
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
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-[920px] p-6 rounded-xl relative">
                        <button
                            onClick={() => setOpenForm(false)}
                            className="absolute top-3 right-3"
                        >
                            <HiX size={22} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4">
                            {title}
                        </h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-2 gap-6 overflow-y-auto pr-1"
                        >
                            {/* Cột 1: Thông tin bài tập */}
                            <div className="flex flex-col gap-4">
                                {/* TÊN BÀI TẬP */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Tên bài tập</label>
                                    <input
                                        {...register("name")}
                                        placeholder="VD: Shoulder Press"
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                    <p className="text-red-500 text-sm">{errors.name?.message}</p>
                                </div>


                                {/* MÔ TẢ */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Mô tả bài tập
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        placeholder="Mô tả cách thực hiện bài tập"
                                        className="w-full border px-3 py-2 rounded"
                                        rows={4}
                                    />
                                    <p className="text-red-500 text-sm">{errors.description?.message}</p>
                                </div>

                                {/* SET & REP */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Số Rep</label>
                                        <input
                                            type="number"
                                            {...register("rep_base", { valueAsNumber: true })}
                                            placeholder="VD: 12"
                                            className="border px-3 py-2 rounded w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Số Set</label>
                                        <input
                                            type="number"
                                            {...register("set_base", { valueAsNumber: true })}
                                            placeholder="VD: 4"
                                            className="border px-3 py-2 rounded w-full"
                                        />
                                    </div>
                                </div>

                                {/* THỜI GIAN */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Thời gian thực hiện (giây)
                                    </label>
                                    <input
                                        type="number"
                                        {...register("time_action", { valueAsNumber: true })}
                                        placeholder="VD: 60"
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            {/* Cột 2: Video */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        Nhóm cơ
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* LEFT: DROPDOWN */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setOpenMuscleSelect(!openMuscleSelect)}
                                                className="w-full flex justify-between items-center border rounded px-3 py-2 bg-white"
                                            >
                                                <span className="text-sm text-gray-600">
                                                    Chọn nhóm cơ
                                                </span>
                                                <HiPlus
                                                    className={`transition ${openMuscleSelect ? "rotate-45" : ""}`}
                                                />
                                            </button>

                                            {openMuscleSelect && (
                                                <div className="absolute z-20 mt-2 w-full bg-white border rounded shadow max-h-56 overflow-y-auto">
                                                    {listMuscle.map((item) => {
                                                        const isSelected = selectedMuscleIds.includes(item.id);
                                                        return (
                                                            <button
                                                                key={item.id}
                                                                type="button"
                                                                disabled={isSelected}
                                                                onClick={() => addMuscle(item.id)}
                                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100
                                    ${isSelected ? "text-gray-400 cursor-not-allowed" : ""}
                                `}
                                                            >
                                                                {item.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* RIGHT: SELECTED TAGS */}
                                        <div className="min-h-[42px] border rounded p-2 flex flex-wrap gap-2">
                                            {selectedMuscleIds.length === 0 && (
                                                <span className="text-sm text-gray-400">
                                                    Chưa chọn nhóm cơ
                                                </span>
                                            )}

                                            {listMuscle
                                                .filter(m => selectedMuscleIds.includes(m.id))
                                                .map(m => (
                                                    <span
                                                        key={m.id}
                                                        className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm"
                                                    >
                                                        {m.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMuscle(m.id)}
                                                        >
                                                            <HiX size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.muscle?.message}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1 font-semibold">
                                        Upload Video
                                    </label>
                                    <input
                                        {...register("video")}
                                        placeholder="https://youtube.com/..."
                                        className="w-full border px-3 py-2 rounded mb-2"
                                    />
                                    {/* Khung hiển thị video */}
                                    {watch("video") && (
                                        <iframe
                                            className="w-full h-48"
                                            src={watch("video").replace("watch?v=", "embed/")}
                                            title="Video bài tập"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            </div>

                            {/* BUTTON: span cả 2 cột */}
                            <div className="col-span-2 flex justify-center gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setOpenForm(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded"
                                >
                                    {isLoading ? "Đang lưu ..." : "Lưu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
