import Modal from "@/components/ui/modal";
import { createBodyMetric } from "@/services/member/MemberService";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
export default function UpdateBodyMetricModal({open,onClose,onSuccess}) {
    const [isLoading, setIsLoading] = useState(false)
    const bodyMetricSchema = z.object({
        height: z.
            string()
            .min(1, "Vui lòng nhập chiều cao")
            .min(2, "Chiều cao phải nhập 3 số (VD: 175)")
            .max(4, "Chiều cao phải nhập 3 số (VD: 175)"),
        weight: z.
            string()
            .min(1, "Vui lòng nhập cân nặng")
            .max(4, "Cân nặng không hợp lý"),
        muscle: z.
            string()
            .min(1, "Vui lòng nhập tỷ lệ cơ")
            .max(4, "Tỷ lệ cơ không hợp lý"),
        body_fat: z
            .string()
            .min(1, "Vui lòng nhập tỷ lệ mỡ cơ thể")
            .max(4, "Tỷ lệ mỡ cơ thể không hợp lệ"),
        visceral_fat: z
            .string()
            .min(1, "Vui lòng nhập mỡ nội tạng")
            .max(4, "Giá trị mỡ nội tạng không hợp lệ"),
        body_water: z
            .string()
            .min(1, "Vui lòng nhập tỷ lệ nước trong cơ thể")
            .max(4, "Tỷ lệ nước trong cơ thể không hợp lệ"),
    })
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(bodyMetricSchema),
    });

    const handleResetBodyMetricForm = () => {
        reset({
            height: "",
            weight: "",
            body_water: "",
            visceral_fat: "",
            body_fat: "",
            muscle: ""
        })
    }


    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            await createBodyMetric(data);
            onSuccess?.();
            handleResetBodyMetricForm()
            toast.success("Cập nhật chỉ số cơ thể thành công")
            onClose()
        } catch (error) {
            console.error("Error creating body metric:", error);
        }finally{
            setIsLoading(false)
        }
    };

    const onError = (err) => {
        const firstErr = Object.values(err)[0]
        if (firstErr)
            toast.error(firstErr.message)
    };
    return (
        <Modal open={open} onClose={onClose} title={"Cập nhật chỉ số cơ thể"} bgColor={"bg-gray-900"}>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="space-y-8 text-center">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">

                        {/* Chiều cao */}
                        <div className="space-y-1">
                            <label className="text-sm text-violet-200">
                                Chiều cao (cm)
                            </label>
                            <input
                                {...register("height")}
                                type="number"
                                placeholder="VD: 175"
                                className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                            />
                        </div>

                        {/* Cân nặng */}
                        <div className="space-y-1">
                            <label className="text-sm text-violet-200">
                                Cân nặng (kg)
                            </label>
                            <input
                                {...register("weight")}
                                type="number"
                                placeholder="VD: 65"
                                className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                            />
                        </div>

                        {/* Tỷ lệ cơ */}
                        <div className="space-y-1">
                            <label className="text-sm text-violet-200">
                                Tỷ lệ cơ (kg)
                            </label>
                            <input
                                {...register("muscle")}
                                type="number"
                                step="0.1"
                                placeholder="VD: 42.5"
                                className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                            />
                        </div>

                        {/* Mỡ cơ thể */}
                        <div className="space-y-1">
                            <label className="text-sm text-violet-200">
                                Mỡ cơ thể (%)
                            </label>
                            <input
                                {...register("body_fat")}
                                type="number"
                                step="0.1"
                                placeholder="VD: 18.3"
                                className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                            />
                        </div>

                        {/* Mỡ nội tạng */}
                        <div className="space-y-1">
                            <label className="text-sm text-violet-200">
                                Mỡ nội tạng (level)
                            </label>
                            <input
                                {...register("visceral_fat")}
                                type="number"
                                placeholder="VD: 8"
                                className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                            />
                        </div>

                        {/* Nước cơ thể */}
                        <div className="space-y-1">
                            <label className="text-sm text-violet-200">
                                Nước cơ thể (%)
                            </label>
                            <input
                                {...register("body_water")}
                                type="number"
                                step="0.1"
                                placeholder="VD: 55.2"
                                className="w-full p-3 rounded-lg bg-[#6f5fb5] border border-[#8a7ed0] text-white placeholder-[#e9e5ff]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                        <button
                            type="submit"
                            className=" border border-white/30 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-white/20"
                        >
                            {isLoading ? "Đang lưu ..." : "Xác nhận"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { onClose(), handleResetBodyMetricForm() }}
                            className="bg-transparent border border-white/30 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-white/10"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}