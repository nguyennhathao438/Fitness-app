import { SearchIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { deletedUser, getPersonalTrainers, updatedUser } from "../../../services/admin/PersonalTrainerService";
import Pagination from "../Pagination";
import Dialog from "../Dialog";
import DetailDialog from "../DetailDialog";
import MemberInfoTab from "./MemberInfoTab";
import PTForm from "../PTForm";
import BodyMetricInfoTab from "./BodyMetricInfoTab";
import DeletedDialog from "../DeletedDialog";
import { toast } from "react-toastify";

export default function MemberList() {
    const [page, setPage] = useState(1);
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
    const handleupdated = async(data) => {
      try {
        await updatedUser(selectedMember.id,data);
        toast.success("Updated Success");
        setOpenForm(false);
        setSelectedMember(null);
        fetchMembers();
      } catch (error) {
        toast.error("Fail to updated")
      }
    }

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
      <div className="p-3 border-2 border-[#e0d8d8] rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <SearchIcon className="size-5 text-gray-400 absolute left-3 top-3" />
          <input
            value={keyword}
            type="text"
            placeholder="Search Members by name..."
            className="w-full p-2 pl-10 bg-[#E2E8F0] text-[#929292] border border-gray-300 border rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <select
          value={gender}
          className="w-full py-2 px-3 bg-[#E2E8F0] border text-[#524848] border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Filter by gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select
          className="w-full py-2 px-3 bg-[#E2E8F0] text-[#524848] border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border">
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
            <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 flex items-center gap-3">
                <img
                    src={m.avatar || "/avatar-default.png"}
                    className="size-10 rounded-full object-cover"
                />
                <span className="font-medium">{m.name}</span>
                </td>

                <td className="px-4 py-3 text-gray-600">{m.email}</td>

                <td className="px-4 py-3">
                <div className="flex justify-center gap-3 lg:gap:9">
                    <button className="p-2 rounded-lg bg-blue-100 text-blue-600 w-8 flex justify-center lg:w-30 hover:opacity-40"
                    onClick={() => {
                        setSelectedMember(m);
                        setOpenView(true);
                    }}
                    >
                    <EyeIcon size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 w-8 flex justify-center lg:w-30 hover:opacity-40"
                    onClick={() => {
                      setSelectedMember(m);
                      setOpenForm(true);
                    }}>
                    <PencilIcon size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-100 text-red-600 w-8 flex justify-center lg:w-30 hover:opacity-40"
                    onClick={() => {
                      setSelectedMember(m);
                      setOpenDelete(true);
                    }}>
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
                } catch (err) {
                  toast.error("Xóa thất bại");
                }
              }}
            />
    {/* View Dialog */}
            <Dialog open={openView} onClose={() => setOpenView(false)}>
        {selectedMember && (
            <DetailDialog
                title={selectedMember.name}
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
