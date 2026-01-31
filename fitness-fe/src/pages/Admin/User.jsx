import { CrownIcon, LayersIcon, PlusIcon, UserCheckIcon, UserLockIcon, UsersIcon, UserXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import StatHeader from "../../components/Admin/StatHeader";
import MemberStatContent from "../../components/Admin/MemberPage/MemberStatContent";
import PT from "./PT";
import Dialog from "../../components/Admin/Dialog";
import PTForm from "../../components/Admin/PTForm";
import { createdUser, getPersonalTrainers } from "../../services/admin/PersonalTrainerService";
import { getAgeUser, getGenderUser } from "../../services/admin/StatUserInformation";
import MemberList from "../../components/Admin/MemberPage/MemberList";
import toast from "react-hot-toast";

export default function User(){
    const [activeTab, setActiveTab] = useState("stats");
    const [openForm, setOpenForm] = useState(false);
    const [full, setFull] = useState(0);
    const [memberGender,setmemberGender] = useState(null);
    const [memberAge,setMemberAge] = useState(null);
    const [refreshPT, setRefreshPT] = useState(0);

    // Tạo PT
    const handleCreatePT= async (data) => {
        try {
            await createdUser(data);
            toast.success("Thêm PT thành công");
            setOpenForm(false);
            getPersonalTrainers().then(res => {
                setFull(res.data.full);
            })
            setRefreshPT(prev => prev + 1); // trigger reload
            setActiveTab("PersonalTrainer");
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;

                Object.values(errors).forEach((messages) => {
                messages.forEach((msg) => toast.error(msg));
                });
            } else {
                toast.error("Có lỗi hệ thống, vui lòng thử lại");
            }
                console.error(error);
        }
    }

    useEffect(() => {
            // Fetch Header data from API
            getPersonalTrainers().then(res => {
                setFull(res.data.full);
            }).catch(err => {
                console.error("Error fetching PT data:", err);
            });
            // fetch stat gender content
            getGenderUser().then(res => {
                setmemberGender(res.data);
            }).catch(err => {
                console.error("Error fetching gender stats:", err);
            });
            // fetch stat age content
            getAgeUser().then(res => {
                setMemberAge(res.data);
            }).catch(err => {
                console.error("Error fetching gender stats:", err);
            });
        }, []);
    return(
        <>
        <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-4 p-2">
                <div >
                    <h1 className="text-lg sm:text-xl font-bold">User Management</h1>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Manage all Users in the system
                    </p>
                </div>
                <button className="flex items-center mr-8 gap-2 bg-purple-600 hover:bg-purple-700 text-white 
                font-medium px-4 py-2 rounded-lg transition-all duration-200"
                onClick={() => setOpenForm(true)}>
                    <PlusIcon className="size-5" />
                    <span className="hidden sm:inline">Add PT</span>
                </button>
            </div>

            {/* StatHeader */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-3 gap-4">
                <StatHeader
                name="Total Users"
                value={full}
                icon={<UsersIcon className="size-5 text-white" />}
                className1="bg-[#A870FF]"
                />

                <StatHeader
                name="Members"
                value={80}
                icon={<UserCheckIcon className="size-5 text-[#16A34A]" />}
                className1="bg-[#DCFCE7]"
                />

                <StatHeader
                name="Personal Trainers"
                value={20}
                icon={<UserXIcon className="size-5 text-[#DC2626]" />}
                className1="bg-[#FF6B73]"
                />

                <StatHeader
                name="VIP Members"
                value={5}
                icon={<CrownIcon className="size-5 text-[#2563EB]" />}
                className1="bg-[#BEE3F8]"
                />

            </div>

            {/* Tabs */}
            <div className="px-7">
                <div className="flex gap-6 border-b border-gray-300">
                    {/* Tab: Thống kê */}
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`
                            flex items-center gap-2 pb-3
                            text-sm font-medium
                            transition-all
                            ${
                                activeTab === "stats"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-500"
                            }
                        `}
                    >
                        <LayersIcon className="size-5" />
                        Thống kê
                    </button>

                    {/* Tab: Danh sách hội viên */}
                    <button
                        onClick={() => setActiveTab("members")}
                        className={`
                            flex items-center gap-2 pb-3
                            text-sm font-medium
                            transition-all
                            ${
                                activeTab === "members"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-500"
                            }
                        `}
                    >
                        <UserLockIcon className="size-5" />
                        Danh sách hội viên
                    </button>
                    <button 
                        onClick={() => setActiveTab("PersonalTrainer")}
                        className={`
                            flex items-center gap-2 pb-3
                            text-sm font-medium
                            transition-all
                            ${
                                activeTab === "PersonalTrainer"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-500"
                            }
                        `}>
                        <UserCheckIcon className="size-5" />
                        Danh sách huấn luyện viên
                    </button>
                </div>

                {/* Content */}
                <div className="mt-2">
                    {activeTab === "stats" && memberGender && memberAge && (<MemberStatContent genderStats={memberGender} ageStats={memberAge} />)}
                    {activeTab === "members" && <MemberList/>}
                    {activeTab === "PersonalTrainer" && <PT refreshKey={refreshPT}/>}
                </div>
            </div>
        </div>
        <Dialog open={openForm} onClose={() => setOpenForm(false)}>
            <PTForm
                mode="add"
                onClose={() => setOpenForm(false)}
                onSubmit={handleCreatePT}                    
            />
        </Dialog>
        </>
    );
}
