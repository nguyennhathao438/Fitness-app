import {
  CrownIcon,
  LayersIcon,
  PlusIcon,
  UserCheckIcon,
  UserLockIcon,
  UsersIcon,
  UserXIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatHeader from "../../components/Admin/StatHeader";
import MemberStatContent from "../../components/Admin/MemberPage/MemberStatContent";
import PT from "./PT";
import Dialog from "../../components/Admin/Dialog";
import PTForm from "../../components/Admin/PTForm";
import {
  createdUser,
  getPersonalTrainers,
} from "../../services/admin/PersonalTrainerService";
import {
  getAgeUser,
  getGenderUser,
  getMemberHavePT,
  getUserStat,
} from "../../services/admin/StatUserInformation";
import MemberList from "../../components/Admin/MemberPage/MemberList";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import NoPermissionModal from "@/components/utils/NoPermissionModel";

export default function User() {
  const [openForm, setOpenForm] = useState(false);
  const [full, setFull] = useState(0);
  const [fullMember, setFullMember] = useState(0);
  const [fullPT, setFullPT] = useState(0);
  const [fullDeleted, setFullDeleted] = useState(0);
  const [memberGender, setmemberGender] = useState(null);
  const [havePT, setHavePT] = useState(null);
  const [memberAge, setMemberAge] = useState(null);
  const [refreshPT, setRefreshPT] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshStats, setRefreshStats] = useState(0);
  const permissions = useSelector((state) => state.auth.permissions);
  const hasPermission = (code) => {
    return permissions?.includes(code);
  }
  const defaultTab = hasPermission("statistic.read") ? "stats" : "members";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [openNoPermission, setOpenNoPermission] = useState(false);
  const canCreateRole = permissions.includes("user.create");
  const [loading,setLoading] = useState(true);

  // Tạo PT
  const handleCreatePT = async (data) => {
    if (isSubmitting) return;
    else if (!canCreateRole) {
      setOpenNoPermission(true);
      return;
    }
    try {
      setIsSubmitting(true);
      await createdUser(data);
      toast.success("Thêm PT thành công");
      setOpenForm(false);
      setRefreshStats((prev) => prev + 1);
      getUserStat().then((res) => {
          setFull(res.data.full);
          setFullMember(res.data.fullMember);
          setFullPT(res.data.fullPT);
          setFullDeleted(res.data.fullDeleted);
      });
      setRefreshPT((prev) => prev + 1); // trigger reload
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
    } finally {
      setIsSubmitting(false);
        }
  };

  useEffect(() => {
  getUserStat()
    .then((res) => {
      setFull(res.data.full);
      setFullMember(res.data.fullMember);
      setFullPT(res.data.fullPT);
      setFullDeleted(res.data.fullDeleted);
    }).finally(() => setLoading(false));

  getGenderUser()
    .then((res) => {
      setmemberGender(res.data);
    });
  getMemberHavePT()
    .then((res) => {
      setHavePT(res.data);
    })
  getAgeUser()
    .then((res) => {
      setMemberAge(res.data);
    });
  }, [refreshStats]);

  return (
    <>
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-2">
          <div className="">
            <h1 className="text-lg sm:text-3xl font-bold ml-4 mt-3">User Management</h1>
            <p className="text-gray-500 text-sm sm:text-base ml-5">
              Manage all Users in the system
            </p>
          </div>
          <button
            className="
              relative flex items-center gap-2 rounded-xl
              px-5 py-2.5 font-semibold text-white transition-all duration-200 ease-out bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              hover:scale-105 hover:-translate-y-[1px]
              hover:shadow-xl hover:shadow-purple-300/40
              active:scale-95 active:translate-y-0
            "
            onClick={() => setOpenForm(true)}
          >
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
            loading={loading}
          />

          <StatHeader
            name="Members"
            value={fullMember}
            icon={<UserCheckIcon className="size-5 text-[#16A34A]" />}
            className1="bg-[#DCFCE7]"
            loading={loading}
          />

          <StatHeader
            name="Personal Trainers"
            value={fullPT}
            icon={<CrownIcon className="size-5 text-[#2563EB]" />}
            className1="bg-[#BEE3F8]"
            loading={loading}
          />

          <StatHeader
            name="Deleted Member"
            value={fullDeleted}
            icon={<UserXIcon className="size-5 text-[#DC2626]" />}
            className1="bg-[#FF6B73]"
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="px-7">
          <div className="flex gap-6 border-b border-gray-300">
            {/* Tab: Thống kê */}
            {hasPermission("statistic.read") && (
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
            )}
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
                        `}
            >
              <UserCheckIcon className="size-5" />
              Danh sách huấn luyện viên
            </button>
          </div>

          {/* Content */}
          <div className="mt-2">
            {activeTab === "stats" && memberGender && memberAge && havePT && (
              <MemberStatContent
                genderStats={memberGender}
                ageStats={memberAge}
                havePTStats={havePT}
              />
            )}
            {activeTab === "members" && <MemberList onChanged={() => {
            setRefreshStats(prev => prev + 1);
            }} />}
            {activeTab === "PersonalTrainer" && <PT refreshKey={refreshPT}
            onChanged={() => {
              setRefreshPT(prev => prev + 1);
              setRefreshStats(prev => prev + 1);
            }}/>}
          </div>
        </div>
      </div>
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <PTForm
          mode="add"
          onClose={() => setOpenForm(false)}
          onSubmit={handleCreatePT}
          loading={isSubmitting}
        />
      </Dialog>
      <NoPermissionModal
        open={openNoPermission}
        onClose={() => setOpenNoPermission(false)}
      />
    </>
  );
}
