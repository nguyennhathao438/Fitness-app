import {
  SearchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FilterIcon,
  CableIcon,
  UserCogIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  deletedUser,
  getMembers,
  selectedPTForMember,
  updatedUser,
} from "../../../services/admin/PersonalTrainerService";
import Pagination from "../Pagination";
import Dialog from "../Dialog";
import DetailDialog from "../DetailDialog";
import MemberInfoTab from "./MemberInfoTab";
import PTForm from "../PTForm";
import BodyMetricInfoTab from "./BodyMetricInfoTab";
import DeletedDialog from "../DeletedDialog";
import { toast } from "react-toastify";
import PTSelectedForm from "./PTSeletedForm";
import defaultAvatar from "@/assets/default-avatar.jpg";
import UpdatePTSelectedForm from "./UpdatePTSelectedForm";
import { useSelector } from "react-redux";
import NoPermissionModal from "@/components/utils/NoPermissionModel";
import MemberScheduleInfoTab from "./MemberScheduleInfoTab";

export default function MemberList({ onChanged }) {
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [gender, setGender] = useState("");
  const [sort, setSort] = useState("desc");
  const [meta, setMeta] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openselectPT, setOpenSelectPT] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdated, setOpenUpdated] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [hasPT, setHasPT] = useState("");
  const permissions = useSelector((state) => state.auth.permissions);
  const [openNoPermission, setOpenNoPermission] = useState(false);
  const canUpdateRole = permissions.includes("user.update");
  const canDeleteRole = permissions.includes("user.delete");
  // lấy danh sách Member
  const fetchMembers = () => {
    setLoading(true);
    return getMembers({
      page,
      keyword: debouncedSearch,
      gender,
      sort,
      has_pt: hasPT,
    })
      .then((res) => {
        setMemberList(res.data.data.data);
        setMeta(res.data.data);
      })
      .finally(() => setLoading(false));
  };
  // Sửa thông tin member
  const handleupdated = async (data) => {
    console.log("Updating member with data:", data);
    if (isSubmitting) return;
    else if (!canUpdateRole) {
      setOpenNoPermission(true);
      return;
    }
    try {
      setIsSubmitting(true);
      await updatedUser(selectedMember.id, data);
      toast.success("Updated Success");
      setOpenForm(false);
      setSelectedMember(null);
      fetchMembers();
      onChanged?.();
    } catch (error) {
      toast.error("Fail to updated",error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, [page, debouncedSearch, gender, sort, hasPT]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(keyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, gender, sort, hasPT]);

  return (
    <>
      <div className="space-y-4">
        {/* FILTER BAR */}
        <div className="">
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                value={keyword}
                type="text"
                placeholder="Search members by name..."
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Gender filter */}
              <div className="relative w-full sm:w-[180px]">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                >
                  <option value="">All Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="relative w-full sm:w-[180px]">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <select
                  value={hasPT}
                  onChange={(e) => setHasPT(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                >
                  <option value="">All Members</option>
                  <option value="1">Đã có PT</option>
                  <option value="0">Chưa có PT</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative w-full sm:w-[160px]">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                >
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="md:overflow-x-hidden max-md:overflow-x-auto rounded-lg border bg-white ">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : memberList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                memberList.map((m) => (
                  <tr
                    key={m.id}
                    className="
                    border-t
                    transition-all duration-200
                    bg-white
                    hover:bg-gray-50
                    hover:translate-x-2  
                  "
                  >
                    <td className="px-4 py-3 relative">
                      {m.can_add_pt && (
                        <span
                          className="
                        inline-block mb-1
                      text-red-500 text-xs font-semibold
                      bg-red-50 px-2 py-0.5 rounded-full
                        xl:absolute xl:right-45
                        lg:absolute lg:top-1 lg:right-15
                        lg:mb-0
                      "
                        >
                          Chưa có PT
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar || defaultAvatar}
                          className="size-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-md text-gray-800">
                          {m.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {m.email}
                    </td>
                    <td className="px-4 py-3 flex">
                      <div className="flex justify-center gap-3">
                        {m.can_add_pt && (
                          <button
                            title="Assign PT"
                            className="p-2 rounded-lg bg-green-100 text-green-600
                                    hover:bg-green-200 transition"
                            onClick={() => {
                              if (!canUpdateRole) {
                                  setOpenNoPermission(true);
                                  return;
                                }
                              setSelectedMember(m);
                              setOpenSelectPT(true);
                            }}
                          >
                            <UserPlusIcon size={16} />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-lg bg-blue-100 text-blue-600
                                  hover:bg-blue-200 transition"
                          onClick={() => {
                            setSelectedMember(m);
                            setOpenView(true);
                          }}
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-600
                                  hover:bg-yellow-200 transition"
                          onClick={() => {
                            if (!canUpdateRole) {
                              setOpenNoPermission(true);
                              return;
                            }
                            setSelectedMember(m);
                            setOpenForm(true);
                          }}
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-600
                                  hover:bg-red-200 transition"
                          onClick={() => {
                            if (!canDeleteRole) {
                              setOpenNoPermission(true);
                              return;
                            }
                            setSelectedMember(m);
                            setOpenDelete(true);
                          }}
                        >
                          <TrashIcon size={16} />
                        </button>
                        {!m.can_add_pt && m.activept && (
                          <button
                            title="Change PT"
                            className="p-2 rounded-lg bg-orange-100 text-orange-600
                                    hover:bg-orange-200 transition"
                            onClick={() => {
                              if (!canUpdateRole) {
                              setOpenNoPermission(true);
                              return;
                            }
                              setSelectedMember(m);
                              setOpenUpdated(true);
                            }}
                          >
                            <UserCogIcon size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="">
          {meta && meta.last_page > 1 && (
            <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
          )}
        </div>
      </div>
      {/* Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        {selectedMember && (
          <PTForm
            mode="edit"
            onSubmit={handleupdated}
            onClose={() => setOpenForm(false)}
            pt={selectedMember}
            loading={isSubmitting}
          />
        )}
      </Dialog>
      {/* SelectedPT Dialog */}
      <Dialog open={openselectPT} onClose={() => setOpenSelectPT(false)}>
        {selectedMember && (
          <PTSelectedForm
            onSubmit={async (ptId) => {
              try {
                await selectedPTForMember({
                  member_id: selectedMember.id,
                  pt_id: ptId,
                });

                toast.success("Gán PT thành công");
                setOpenSelectPT(false);
                fetchMembers(); // refresh lại list
                onChanged?.();
              } catch (err) {
                const msg = err?.response?.data?.message || "Gán PT thất bại";
                toast.error(msg);
              }
            }}
          />
        )}
      </Dialog>
      {/* UpdatedPT Dialog */}
      <Dialog open={openUpdated} onClose={() => setOpenUpdated(false)}>
        {selectedMember && (
          <UpdatePTSelectedForm
            member={selectedMember}
            onClose={() => setOpenUpdated(false)}
            onSuccess={() => {
              setOpenUpdated(false);
              fetchMembers();
              onChanged?.();
            }}
            onChange={() => {
              fetchMembers();
              onChanged?.();
            }}
          />
        )}
      </Dialog>
      {/* Delete Dialog */}
      <DeletedDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          try {
            await deletedUser(selectedMember.id);

            toast.success("Xóa người dùng thành công");

            setOpenDelete(false);
            fetchMembers();
            onChanged?.();
          } catch (err) {
            console.log("error",err);
            toast.error("Member đang có pt nên không thể xóa");
          }
        }}
        name="Xóa người dùng"
      />
      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        {selectedMember && (
          <DetailDialog
            title={selectedMember.name}
            avatar={selectedMember.avatar}
            tabs={[
              {
                id: "info",
                label: "Thông tin tài khoản",
                content: <MemberInfoTab member={selectedMember} />,
              },
              {
                id: "body",
                label: "Chỉ số cơ thể",
                content: <BodyMetricInfoTab member={selectedMember} />,
              },
              {
                id: "schedule",
                label: "Lịch tập",
                content:< MemberScheduleInfoTab member={selectedMember.id} />
              },
              {
                id: "food",
                label: "Chế độ ăn uống",
              },
            ]}
          />
        )}
      </Dialog>
      <NoPermissionModal
        open={openNoPermission}
        onClose={() => setOpenNoPermission(false)}
      />
    </>
  );
}
