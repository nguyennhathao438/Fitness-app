import { SearchIcon, EyeIcon, PencilIcon, TrashIcon, FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { deletedUser, getPersonalTrainers, updatedUser } from "../../../services/admin/PersonalTrainerService";
import Pagination from "../Pagination";
import Dialog from "../Dialog";
import DetailDialog from "../DetailDialog";
import MemberInfoTab from "./MemberInfoTab";
import PTForm from "../PTForm";
import BodyMetricInfoTab from "./BodyMetricInfoTab";
import DeletedDialog from "../DeletedDialog";
import toast from "react-hot-toast";

export default function MemberList({onChanged}) {
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
    const [openDelete, setOpenDelete] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [memberList, setMemberList] = useState([]);
    // lấy danh sách Member
    const fetchMembers = () => {
      setLoading(true);
      return getPersonalTrainers({
        page,
        keyword: debouncedSearch,
        gender,
        sort,
      })
        .then(res => {
          setMemberList(res.data.data.data);
          setMeta(res.data.data);
        })
        .finally(() => setLoading(false));
    };
    // Sửa thông tin member
    const handleupdated = async (formData) => {
      if (isSubmitting) return;
      try {
        setIsSubmitting(true);
        const res = await updatedUser(selectedMember.id, formData);

        const updatedMember = res.data.member;

        setMemberList(prev =>
          prev.map(m =>
            m.id === updatedMember.id ? updatedMember : m
          )
        );

        toast.success("Updated Success");
        setOpenForm(false);
        setSelectedMember(null);
        onChanged?.();
      } catch (error) {
        toast.error("Fail to updated");
      } finally {
      setIsSubmitting(false);
    }
    };
    useEffect(() => {
      fetchMembers();
    }, [page, debouncedSearch, gender, sort]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(keyword);
        }, 400);
    
      return () => clearTimeout(timer);}, [keyword]);
    
    useEffect(() => {
      setPage(1);
      }, [debouncedSearch, gender, sort]);
    
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
      <div className="sm:overflow-x-hidden rounded-lg border bg-white ">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Actions</th>
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
                  {/* Member */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar || "/avatar-default.png"}
                        className="size-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-md text-gray-800">
                        {m.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {m.email}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
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
                          setSelectedMember(m);
                          setOpenDelete(true);
                        }}
                      >
                        <TrashIcon size={16} />
                      </button>
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
              <Pagination meta={meta} onPageChange={(p) => setPage(p)}/>
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
                />)}
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
                  toast.error("Xóa thất bại");
                }
              }}
              name="người dùng"
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
                    content: <BodyMetricInfoTab member={selectedMember}/>
                    },
                    {
                    id: "schedule",
                    label: "Lịch tập",
                    },
                    {
                    id: "food",
                    label: "Chế độ ăn uống",
                    },
                ]}
                />
            )}
            </Dialog>

    </>
  );
}
