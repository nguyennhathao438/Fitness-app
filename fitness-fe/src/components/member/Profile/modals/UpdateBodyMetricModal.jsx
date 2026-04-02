import Modal from "@/components/ui/modal";
import { createBodyMetric } from "@/services/member/MemberService";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
export default function UpdateBodyMetricModal({ open, onClose, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false)
    const bodyMetricSchema = z.object({
        height: z.coerce
        .number({ required_error: "Vui lòng nhập chiều cao" })
        .min(100, "Chiều cao > 100cm")
        .max(250, "Chiều cao < 250cm"),

    weight: z.coerce
        .number({ required_error: "Vui lòng nhập cân nặng" })
        .min(30, "Cân nặng > 30kg")
        .max(300, "Cân nặng < 300 kg"),

    muscle: z.coerce
        .number({ required_error: "Vui lòng nhập tỷ lệ cơ" })
        .min(10, "Tỷ lệ cơ > 10%")
        .max(100, "Tỷ lệ cơ < 100%"),

    body_fat: z.coerce
        .number({ required_error: "Vui lòng nhập tỷ lệ mỡ" })
        .min(3, "Tỷ lệ mỡ > 3%")
        .max(60, "Tỷ lệ mỡ < 60%"),

    visceral_fat: z.coerce
        .number({ required_error: "Vui lòng nhập mỡ nội tạng" })
        .min(1, "Mỡ nội tạng > 1")
        .max(30, "Mỡ nội tạng < 30"),

    body_water: z.coerce
        .number({ required_error: "Vui lòng nhập nước cơ thể" })
        .min(20, "Nước cơ thể > 20%")
        .max(80, "Nước cơ thể < 80%"),
    })
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
        } finally {
            setIsLoading(false)
        }
    };

    const onError = (err) => {
        const errors = Object.values(err);

        if (errors.length > 1) {
            toast.error("Vui lòng nhập đủ thông tin và đảm bảo các giá trị hợp lệ");
            return;
        }

        if (errors.length === 1) {
            toast.error(errors[0].message);
        }
    };
    return (
        <Modal open={open} border={"border-yellow-400 border-2 border"} onClose={onClose} title={"Cập nhật chỉ số cơ thể"} txtColor={"text-white"} bgColor={"bg-gray-900"}>
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
                                className={`w-full p-3 rounded-lg bg-[#6f5fb5] border text-white placeholder-[#e9e5ff]
                                ${errors.height ? "border-red-500" : "border-[#8a7ed0]"}`}
                            />
                            {errors.height && (
                                <p className="text-red-400 text-sm">
                                    {errors.height.message}
                                </p>
                            )}
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
                                className={`w-full p-3 rounded-lg bg-[#6f5fb5] border text-white placeholder-[#e9e5ff]
                                ${errors.weight ? "border-red-500" : "border-[#8a7ed0]"}`}
                            />
                            {errors.weight && (
                                <p className="text-red-400 text-sm">
                                    {errors.weight.message}
                                </p>
                            )}
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
                                className={`w-full p-3 rounded-lg bg-[#6f5fb5] border text-white placeholder-[#e9e5ff]
                                ${errors.muscle ? "border-red-500" : "border-[#8a7ed0]"}`}
                            />
                            {errors.muscle && (
                                <p className="text-red-400 text-sm">
                                    {errors.muscle.message}
                                </p>
                            )}
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
                                className={`w-full p-3 rounded-lg bg-[#6f5fb5] border text-white placeholder-[#e9e5ff]
                                ${errors.body_fat ? "border-red-500" : "border-[#8a7ed0]"}`}
                            />
                            {errors.body_fat && (
                                <p className="text-red-400 text-sm">
                                    {errors.body_fat.message}
                                </p>
                            )}
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
                                className={`w-full p-3 rounded-lg bg-[#6f5fb5] border text-white placeholder-[#e9e5ff]
                                ${errors.visceral_fat ? "border-red-500" : "border-[#8a7ed0]"}`}
                            />
                            {errors.visceral_fat && (
                                <p className="text-red-400 text-sm">
                                    {errors.visceral_fat.message}
                                </p>
                            )}
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
                                className={`w-full p-3 rounded-lg bg-[#6f5fb5] border text-white placeholder-[#e9e5ff]
                                ${errors.body_water ? "border-red-500" : "border-[#8a7ed0]"}`}
                            />
                            {errors.body_water && (
                                <p className="text-red-400 text-sm">
                                    {errors.body_water.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                        <button type="button" onClick={() => { onClose(), handleResetBodyMetricForm() }} className="bg-gray-300 cursor-pointer px-4 py-2 rounded-md hover:shadow-lg hover:shadow-gray-400/30 hover:scale-110">
                            Hủy
                        </button>
                        <button type="submit" className=" bg-yellow-300 text-purple-900 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-110 cursor-pointer px-4 py-2 rounded-md ">
                            {isLoading ? "Đang lưu ..." : "Xác nhận"}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}