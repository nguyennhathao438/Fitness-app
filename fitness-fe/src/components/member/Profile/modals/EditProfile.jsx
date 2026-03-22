import Modal from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateMember } from "@/storages/authSlice";
import { updateProfile } from "@/services/member/MemberService";

const memberSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Họ và tên phải ít nhất 3 ký tự")
        .max(100, "Tên quá dài"),

    email: z.string()
        .trim()
        .email("Email không hợp lệ"),

    phone: z.string()
        .regex(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ"),

    gender: z.enum(["male", "female", "other"]).optional(),
});

export default function EditProfileModal({ open, onClose, member }) {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        resolver: zodResolver(memberSchema)
    });

    const handleResetForm = () => {
        reset({
            name: "",
            email: "",
            phone: "",
            gender: "male"
        });
    };

    // load data khi mở modal
    useEffect(() => {
        if (open && member) {
            reset({
                name: member.name || "",
                email: member.email || "",
                phone: member.phone || "",
                gender: member.gender || "male"
            });
        }
    }, [open, member]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const res = await updateProfile(data);
            dispatch(updateMember(res.data.member));
            toast.success(res.data.message || "Cập nhật thông tin thành công");
            handleResetForm();
            onClose();
        } catch (error) {
            toast.error("Cập nhật thất bại",error);
        } finally {
            setIsLoading(false);
        }
    };

    const onError = (err) => {
        const firstErr = Object.values(err)[0];
        if (firstErr) toast.error(firstErr.message);
    };

    return (
        <Modal
            title={"Chỉnh sửa thông tin"}
            bgColor={"bg-gray-900"}
            border={"border-yellow-400 border-2 border"}
            txtColor={"text-white"}
            open={open}
            onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4" >
                <div>
                    <label className="text-white">Họ và tên</label>
                    <input
                        {...register("name")}
                        type="text"
                        placeholder="Họ và tên"
                        className="border bg-white px-3 py-2 rounded-md w-full"
                    />
                </div>

                <div>
                    <label className="text-white">Email</label>
                    <input
                        {...register("email")}
                        type="text"
                        placeholder="Email"
                        className="border bg-white px-3 py-2 rounded-md w-full"
                    />
                </div>

                <div>
                    <label className="text-white">Số điện thoại</label>
                    <input
                        {...register("phone")}
                        type="text"
                        placeholder="Số điện thoại"
                        className="border bg-white px-3 py-2 rounded-md w-full"
                    />
                </div>

                <div>
                    <label className="text-white">Giới tính</label>
                    <select {...register("gender")} className="border bg-white px-3 py-2 rounded-md w-full">
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>

                <div className="flex justify-center gap-4 mt-2">
                    <button type="button" className="px-6 py-1 bg-gray-300 rounded-md hover:shadow-lg hover:shadow-gray-400/30 hover:scale-110 hover:bg-gray-400" onClick={() => { onClose();handleResetForm();}}>
                        Hủy
                    </button>
                    <button type="submit" className="px-6 py-2 bg-yellow-300 text-purple-900 hover:shadow-lg hover:shadow-yellow-400/30 rounded-md hover:scale-110">
                        {isLoading ? "Đang lưu ..." : "Lưu"}
                    </button>
                </div>

            </form>
        </Modal>
    );
}