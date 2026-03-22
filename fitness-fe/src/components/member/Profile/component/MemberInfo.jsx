import { User, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import ResetPassModal from "../modals/ResetPassModal";
import EditProfileModal from "../modals/EditProfile";

export default function MemberInfo() {
    const { member } = useSelector((state) => state.auth);
    const [openResetPass, setOpenResetPass] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    console.log("member hiện tại là",member)
    return (
        <div>
            <div className="flex flex-col md:flex-row py-5 bg-[#1f1b2e] rounded-xl shadow-md">
                {/* Avatar */}
                <div className="flex flex-1 justify-center items-center">
                    {member?.avatar ? (
                        <img
                            className="w-48 h-48 p-2 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                            src={member?.avatar || "/placeholder.svg"}
                            alt="avatar"
                        />
                    ) : (
                        <div className="w-48 h-48 flex justify-center items-center rounded-full bg-purple-600 border-4 border-purple-500 shadow-lg">
                            <User className="w-20 h-20 text-white" />
                        </div>
                    )}
                </div>

                {/* Form hiển thị thông tin (disabled) */}
                <div className="flex flex-col lg:flex-row items-center flex-2 mt-4 md:mt-0 md:ml-10">
                    <div className="flex-2 flex flex-col space-y-3">
                        <label className="p-2 text-white">
                            Họ tên :
                            <input
                                disabled
                                value={member?.name || ""}
                                className="text-black bg-white rounded-2xl ml-1 px-2"
                                type="text"
                            />
                        </label>

                        <label className="p-2 text-white">
                            Email :
                            <input
                                disabled
                                value={member?.email || ""}
                                className="text-black bg-white rounded-2xl ml-3 px-2"
                                type="text"
                            />
                        </label>

                        <label className="p-2 text-white">
                            Phone :
                            <input
                                disabled
                                value={member?.phone || ""}
                                className="text-black bg-white rounded-2xl ml-1.5 px-2"
                                type="text"
                            />
                        </label>

                        <label className="p-2 text-white">
                            Gender:
                            <input
                                disabled
                                value={member?.gender === "male" ? "Nam" : member?.gender === "female" ? "Nữ" : member?.gender === "other" ? "Khác": ""}
                                className="text-black bg-white rounded-2xl ml-1 px-2"
                                type="text"
                            />
                        </label>

                    </div>

                    {/* Buttons */}
                    <div className="flex-1 flex flex-col mt-4 lg:mt-0 lg:ml-8">
                        <button type="button" onClick={() => setOpenResetPass(true)} className="flex mx-5 my-2 justify-center px-4 py-1 text-white bg-purple-500 hover:bg-purple-600 rounded-md cursor-pointer">
                            <CheckCircle className="w-5 mr-2" />
                            Đổi mật khẩu
                        </button>
                        <button onClick={() => setOpenEditModal(true)} className="flex mx-5 my-2 justify-center px-4 py-1 text-white bg-purple-500 hover:bg-purple-600 rounded-md cursor-pointer">
                            <User className="w-5 mr-2" />
                            Chỉnh sửa thông tin
                        </button>

                    </div>

                </div>
            </div>

            {/* Modals */}
            <ResetPassModal
                open={openResetPass}
                onClose={() => setOpenResetPass(false)}
            />

            <EditProfileModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                member={member}
            />
        </div>
    );
}