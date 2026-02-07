import Modal from "@/components/ui/modal";
import { changePassword } from "@/services/member/MemberService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod"
export default function ResetPassModal({ open, onClose }) {
    const passwordRegex = /^[a-zA-Z0-9]+$/;
    const updatePassSchema = z
        .object({
            passPresent: z
                .string()
                .trim()
                .min(1, "Vui lòng nhập mật khẩu hiện tại")
                .regex(passwordRegex, "Mật khẩu chỉ được chứa chữ và số"),

            passNew: z
                .string()
                .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
                .regex(passwordRegex, "Mật khẩu chỉ được chứa chữ và số"),

            rePassNew: z
                .string()
                .min(1, "Vui lòng nhập lại mật khẩu mới"),
        })
        .refine((data) => data.passNew === data.rePassNew, {
            message: "Mật khẩu nhập lại không khớp",
            path: ["rePassNew"],
        });
    const [isLoading, setIsLoading] = useState(false)
    const { register: registerPass, handleSubmit: handleSubmitPass, reset: resetPassForm } = useForm({
        resolver: zodResolver(updatePassSchema)
    })

    const handleResetPassForm = () => {
        resetPassForm({
            passNew: "",
            passPresent: "",
            rePassNew: ""
        })
    }
    
    const onSubmitPass = async (data) => {
        setIsLoading(true)
        try {
            const passNew = data.passNew;
            const rePassNew = data.rePassNew;
            const passPresent = data.passPresent
            if (passNew != rePassNew) {
                toast.error("Mật khẩu mới không khớp")
                return
            }
            if (passPresent === passNew) {
                toast.error("Mật khẩu mới không được trùng mật khẩu cũ");
                return;
            }
            console.log("data", data);
            const res = await changePassword({
                current_password: passPresent,
                new_password: passNew,
                new_password_confirmation: rePassNew,
            });

            toast.success(res.data.message || "Đổi mật khẩu thành công");
            handleResetPassForm()
            onClose()
            console.log("res", res)
        } catch (error) {
            toast.error("Lỗi không thể đổi mật khẩu", error)
        } finally {
            setIsLoading(false)
        }
    }

    const onErrorPass = (err) => {
        const firstErr = Object.values(err)[0]
        if (firstErr)
            toast.error(firstErr.message)
    }

    return (
        <Modal title={"Đổi mật khẩu"} bgColor={"bg-gray-900"} open={open} onClose={onClose}>
            <form onSubmit={handleSubmitPass(onSubmitPass, onErrorPass)} className="flex flex-col gap-4">
                <div>
                    <label className="text-white" >Mật khẩu hiện tại</label>
                    <input
                        {...registerPass("passPresent")}
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        className="border bg-white px-3 py-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="text-white">Mật khẩu mới</label>
                    <input
                        {...registerPass("passNew")}
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="border bg-white px-3 py-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="text-white">Nhập lại mật khẩu mới</label>
                    <input
                        {...registerPass("rePassNew")}
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        className="border bg-white px-3 py-2 rounded-md w-full"
                    />
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    <button type="button" className="px-4 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                        onClick={() => { onClose(), handleResetPassForm() }}>
                        Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
                        {isLoading ? "Đang lưu ..." : "Lưu"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}