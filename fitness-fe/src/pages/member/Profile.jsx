import { User, Save, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
import { updateMember } from "../../storages/authSlice";
import { updateProfile } from "../../services/member/MemberService";
import ProfileTabBar from "../../components/member/ProfileTabbar";
import { changePassword } from "../../services/member/MemberService";
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
    gender: z.string().optional(),
})
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
export default function Profile() {
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openResetPass, setOpenResetPass] = useState(false)
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

    const { register: registerPass, handleSubmit: handleSubmitPass, reset: resetPassForm } = useForm({
        resolver: zodResolver(updatePassSchema)
    })
    const handleResetPassForm = () => {
        resetPassForm ({
            passNew : "",
            passPresent: "",
            rePassNew: ""
        })
    }
    const onSubmitPass = async (data) => {
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
            setOpenResetPass(false)
            console.log("res",res)
        } catch (error) {
            toast.error("Lỗi không thể đổi mật khẩu", error)
        }
    }
    const onErrorPass = (err) => {
        const firstErr = Object.values(err)[0]
        if (firstErr)
            toast.error(firstErr.message)
    }
    const resetPassUI = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Đổi mật khẩu</h2>
                <form onSubmit={handleSubmitPass(onSubmitPass, onErrorPass)} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="">Mật khẩu hiện tại</label>
                        <input
                            {...registerPass("passPresent")}
                            type="password"
                            placeholder="Mật khẩu hiện tại"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="">Mật khẩu mới</label>
                        <input
                            {...registerPass("passNew")}
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="">Nhập lại mật khẩu mới</label>
                        <input
                            {...registerPass("rePassNew")}
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                        <button
                            onClick={() => {setOpenResetPass(false),handleResetPassForm()}}
                            type="button"
                            className="px-4 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

    console.log("member la", member)
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
                        {/* <label className="p-2 text-white">Ngày sinh : <input disabled={!isEdit} {...register("birthday")} className="text-black bg-white rounded-2xl px-2" type="text" /></label> */}
                        <label className="p-2 text-white">Giới tính :
                            <select disabled={!isEdit} {...register("gender")} className="bg-white border border-gray-300 text-black rounded-2xl ml-2 w-40 text-center">
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <button type="button" onClick={() => setOpenResetPass(true)} className="flex mx-10 my-2 justify-center px-4 py-1 text-white bg-[#A49BEF] hover:bg-[#5a548c] rounded-md cursor-pointer"><CheckCircle className="w-5 mr-2" />Đổi mật khẩu</button>
                        {!isEdit && (
                            <button onClick={() => setIsEdit(true)} className="flex mx-10 my-2 justify-center px-4 py-1 text-white bg-[#A49BEF] hover:bg-[#5a548c] rounded-md cursor-pointer "><User className="w-5 mr-2" />Chỉnh sửa thông tin</button>
                        )}
                        {isEdit && (
                            <div className="border mx-10">
                                <button type="button" onClick={() => setIsEdit(false)} className="flex w-full justify-center px-4 py-1 text-white bg-[#A49BEF] hover:bg-[#5a548c] rounded-md cursor-pointer"><Save className="w-5 mr-2" />Hủy</button>
                                <button type="submit" className="flex w-full my-2 justify-center px-4 py-1 text-white bg-[#A49BEF] hover:bg-[#5a548c] rounded-md cursor-pointer"><Save className="w-5 mr-2" />
                                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            <ProfileTabBar />
            {openResetPass && (resetPassUI)}
        </div>
    );
}