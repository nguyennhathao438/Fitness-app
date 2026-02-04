import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus, HiOutlineSearch, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { toast } from "react-toastify";
import { z } from "zod"
import { createMuscleGroup, getAllMuscleGroup, updateMuscleGroup } from "../../services/admin/MuscleGroup";
export default function MuscleGroup() {
    const muscleSchema = z.object({
        muscleName: z.string().min(2, "Tên nhóm cơ tối thiểu 2 ký tự"),
        muscleNameMain: z.boolean(),
    });
    const [openMuscleForm, setOpenMuscleForm] = useState(false)
    const [titleForm, setTitleForm] = useState("")
    const [listMuscle, setListMuscle] = useState([])
    const [muscle, setMuscle] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    console.log("danh sach nhom co", listMuscle)
    const fetchListMuscle = async () => {
        try {
            const response = await getAllMuscleGroup()
            setListMuscle(response.data)
        } catch (error) {
            toast.error("Lỗi không thể lấy danh sách nhóm cơ", error)
        }
    }
    useEffect(() => {
        const fetchListMuscle = async () => {
            try {
                const response = await getAllMuscleGroup()
                setListMuscle(response.data)
            } catch (error) {
                toast.error("Lỗi không thể lấy danh sách nhóm cơ", error)
            }
        }
        fetchListMuscle()
    }, [])
    const { register, handleSubmit, reset, formState: { errors: muscleErrors } } = useForm({
        resolver: zodResolver(muscleSchema),
    });
    const handleResetForm = () => {
        reset({
            muscleName: "",
            muscleNameMain: false
        })
    }
    const handleDefaultValues = (item) => {
        reset({
            muscleName: item.name,
            muscleNameMain: item.is_main
        });
    }
    const onSubmit = async (data) => {
        console.log("hahahah")
        setIsLoading(true)
        if (listMuscle.includes(data.muscleName)) {
            toast.error("Nhóm cơ đã tồn tại");
            return;
        }
        // setListMuscle((prev) => [...prev, data.muscleName]);
        const dataObject = {
            id: muscle?.id,
            name: data?.muscleName,
            is_main: data?.muscleNameMain
        }
        try {
            console.log("hoàng anh huy")
            if (titleForm === "Thêm nhóm cơ") {
                await createMuscleGroup(dataObject)
                toast.success("Thêm nhóm cơ thành công")
            }
            else {
                await updateMuscleGroup(dataObject)
                toast.success("Cập nhật nhóm cơ thành công")
            }
            fetchListMuscle()
            handleResetForm();
            setOpenMuscleForm(false);
        } catch (error) {
            toast.error("Lỗi không thể thêm", error)
        } finally {
            setIsLoading(false)
        }
    };
    return (
        <div className="p-6 bg-gradient-to-br from-purple-50 to-white min-h-screen">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
                <div>
                    <h2 className="font-bold text-2xl text-gray-800">
                        QUẢN LÝ NHÓM CƠ
                    </h2>
                    <p className="text-sm text-gray-500">
                        Quản lý danh sách các nhóm cơ trong hệ thống
                    </p>
                </div>
            </div>

            {/* Add button */}
            <button onClick={() => { setOpenMuscleForm(true), handleResetForm(), setTitleForm("Thêm nhóm cơ") }} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mb-6 shadow">
                <HiPlus />
                Thêm nhóm cơ
            </button>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow p-5">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">
                        Danh sách nhóm cơ
                    </h3>

                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-center px-4 py-3">
                                    TÊN NHÓM CƠ
                                </th>
                                <th className="text-center px-4 py-3">
                                    NHÓM CƠ CHÍNH
                                </th>
                                <th className="text-center px-4 py-3">
                                    HÀNH ĐỘNG
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {listMuscle.map((item) => (
                                <tr>
                                    <td
                                        className="py-3 text-center text-md"
                                    >
                                        {/* <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải dữ liệu...
                                        </div> */}
                                        {item.name}
                                    </td>
                                    <td className="py-3 text-center text-md">
                                        {item.is_main ? "True" : "False"}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => { setOpenMuscleForm(true), setTitleForm("Chỉnh sửa nhóm cơ"), handleDefaultValues(item), setMuscle(item) }} className="text-blue-500 hover:text-blue-700">
                                                <HiPencil />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700">
                                                <HiTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            {openMuscleForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-[400px] p-6 rounded-xl relative">
                        <button
                            onClick={() => setOpenMuscleForm(false)}
                            className="absolute top-3 right-3"
                        >
                            <HiX size={22} />
                        </button>

                        <h2 className="text-lg text-center font-semibold mb-4">
                            {titleForm}
                        </h2>


                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="mb-5">
                                <label htmlFor="">
                                    Tên nhóm cơ
                                </label>
                                <input
                                    {...register("muscleName")}
                                    placeholder="Tên nhóm cơ"
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register("muscleNameMain")}
                                    className="w-4 h-4"
                                />
                                <span>Nhóm cơ chính</span>
                            </label>
                            <p className="text-red-500 text-sm">
                                {muscleErrors.muscleName?.message}
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setOpenMuscleForm(false), handleResetForm() }}
                                    className="px-4 py-2 border rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-purple-600 text-white rounded"
                                >
                                    {isLoading
                                        ? "Đang xử lý..."
                                        : titleForm === "Thêm nhóm cơ"
                                            ? "Thêm"
                                            : "Cập nhật"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
