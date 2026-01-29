import { User, Save, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
import { updateMember } from "../../storages/authSlice";
import { updateProfile } from "../../services/member/MemberService";
import TabBar from "../../components/member/TabBar";
const memberSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Họ và tên không được để trống")
        .min("3", "Họ và tên phải có ít nhất 3 ký tự")
        .max("100", "Tên quá dài"),
    email: z.string()
        .trim()
        .min(1, "Email không được để trống")
        .email({ message: "Email không đúng định dạng" }),
    phone: z.string()
        .trim()
        .min(1, "Số điện thoại không được để trống")
        .min(9, "Số điện thoại không hợp lệ")
        .max(11, "Số điện thoại không hợp lệ")
        .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
})

export default function Profile() {
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { member } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: member?.name || "",
            email: member?.email || "",
            phone: member?.phone || "",
            birthday: member?.birthday || "",
            gender: member?.gender || "",
        }
    });

    const onSubmit = async (data) => {
        console.log("data", data)
        setIsLoading(true);
        try {
            const response = await updateProfile(data);
            toast.success(response.data.message || "Cập nhật thông tin thành công");
            setIsEdit(false);
            dispatch(updateMember(response.data.member));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Cập nhật thất bại";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const onError = (err) => {
        const firstErr = Object.values(err)[0];
        if (firstErr)
            toast.error(firstErr.message);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row py-5 bg-[#000000]">
                <div className="flex flex-1 justify-center items-center">
                    {member?.avatar ? (
                        <img className="w-50 h-50 p-5 rounded-md text-white" src={member?.avatar || "/placeholder.svg"} alt="avatar" />
                    ) : (<div className="">
                        <User className="w-50 h-50 p-5 rounded-md text-white" />
                    </div>)}
                </div>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col lg:flex-row items-center flex-2">
                    <div className="flex-2 flex flex-col">
                        <label className="p-2 text-white">Họ và tên : <input disabled={!isEdit} {...register("name")} className="text-black bg-white rounded-2xl px-2" type="text" /> </label>
                        <label className="p-2 text-white">Email : <input disabled={!isEdit} {...register("email")} className="text-black bg-white rounded-2xl px-2" type="text" /></label>
                        <label className="p-2 text-white">Số điện thoại : <input disabled={!isEdit} {...register("phone")} className="text-black bg-white rounded-2xl px-2" type="text" /></label>
                        <label className="p-2 text-white">Ngày sinh : <input disabled={!isEdit} {...register("birthday")} className="text-black bg-white rounded-2xl px-2" type="text" /></label>
                        <label className="p-2 text-white">Giới tính : <input disabled={!isEdit} {...register("gender")} className="text-black bg-white rounded-2xl px-2" type="text" /></label>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <button className="flex mx-10 my-2 justify-center px-4 py-1 text-white bg-[#A49BEF] rounded-md cursor-pointer"><CheckCircle className="w-5 mr-2" />Đổi mật khẩu</button>
                        {!isEdit && (
                            <button onClick={() => setIsEdit(true)} className="flex mx-10 my-2 justify-center px-4 py-1 text-white bg-[#A49BEF] rounded-md cursor-pointer "><User className="w-5 mr-2" />Chỉnh sửa thông tin</button>
                        )}
                        {isEdit && (
                            <div className="border mx-10">
                                <button type="button" onClick={() => setIsEdit(false)} className="flex w-full justify-center px-4 py-1 text-white bg-[#A49BEF] rounded-md cursor-pointer"><Save className="w-5 mr-2" />Hủy</button>
                                <button type="submit" className="flex w-full my-2 justify-center px-4 py-1 text-white bg-[#A49BEF] rounded-md cursor-pointer"><Save className="w-5 mr-2" />
                                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            <TabBar />
        </div>
    );
}