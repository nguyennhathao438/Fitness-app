import { SearchIcon } from "lucide-react";
import {useEffect, useState } from "react";
import PTCard from "../../components/Admin/PTPage/PTCard";
import { deletedUser, getPersonalTrainers, updatedUser } from "../../services/admin/PersonalTrainerService";
import Pagination from "../../components/Admin/Pagination";
import toast from "react-hot-toast";
import DeletedDialog from "../../components/Admin/DeletedDialog";
import PTForm from "../../components/Admin/PTForm";
import Dialog from "../../components/Admin/Dialog";

export default function PT({ refreshKey }){
    //state loadpage
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [gender, setGender] = useState("");
    const [sort, setSort] = useState("desc");
    const [pts, setPts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPT, setSelectedPT] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        setLoading(true);
        // Fetch PT data from API
        getPersonalTrainers({page, keyword: debouncedSearch, gender, sort}).then(res => {
            setPts(res.data.data.data);   // MẢNG PT
            setMeta(res.data.data);       // META PAGINATION
        }).finally(() => setLoading(false));
    }, [page,debouncedSearch,gender,sort,refreshKey]);
    
    useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(keyword);
    }, 400);

    return () => clearTimeout(timer);
    }, [keyword]);
    useEffect(() => {
    setPage(1);
    }, [debouncedSearch, gender, sort]);

    // Xóa PT
    const handleDeletePT = async () => {
    if (!selectedPT) return;
    try {
        await deletedUser(selectedPT.id);

        toast.success("Xóa thành công");

        setOpenDelete(false);
        setSelectedPT(null);

        // reload list
        getPersonalTrainers({ page, keyword: debouncedSearch, gender, sort })
            .then(res => {
                setPts(res.data.data.data);
                setMeta(res.data.data);
            });

        } catch (err) {
            console.error(err);
            toast.error("Xóa thất bại");
        }
    };
    // sửa thông tin
    const handleUpdatePT = async (data) => {
      if (isSubmitting) return;
        try {
            setIsSubmitting(true);

            await updatedUser(selectedPT.id, data);

            toast.success("Cập nhật PT thành công");

            setOpenEdit(false);
            setSelectedPT(null);

            // reload list
            getPersonalTrainers({ page, keyword: debouncedSearch, gender, sort })
            .then(res => {
                setPts(res.data.data.data);
                setMeta(res.data.data);
            });
        } catch (err) {
            toast.error("Cập nhật thất bại");
        }   finally {
      setIsSubmitting(false);
        }
    };

    return(
        <>
        <div className="">
            <div className="p-3 m-1 border-2 border-[#e0d8d8] px-3 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search PT */}
                <div className="relative">
                    <SearchIcon className="size-5 text-gray-400 absolute top-3 left-3"/>
                    <input
                    value={keyword} 
                    type="text"
                    placeholder="Search trainers by name..."
                    className="w-full p-2 pl-10 bg-[#E2E8F0] text-[#929292] border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div>
                    <select
                        value={gender}
                        className="w-full py-2 px-3 bg-[#E2E8F0] border text-[#524848] border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                            setGender(e.target.value);
                        }}
                    >
                        <option value="">Filter by</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <select
                        className="w-full py-2 px-3 bg-[#E2E8F0] text-[#524848] border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="desc">Newest</option>
                        <option value="asc">Oldest</option>
                    </select>
                </div>
            </div>
            <div className="p-2 bg-[#F6F5F5] mx-2 gap-12 lg:gap-10 xl:gap-10  grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Card PT */}
                {loading && <p>Đang tải PT...</p>}

                {!loading && pts.length === 0 && (
                    <p>Chưa có PT nào</p>
                )}

                {!loading && pts.map(pt => (
                    <PTCard 
                        key={pt.id} 
                        pt={pt} 
                        onDeleteClick={() => {
                            setSelectedPT(pt);
                            setOpenDelete(true);
                        }}
                        onEditClick={() => {
                            setSelectedPT(pt);
                            setOpenEdit(true);
                        }}
                    />
                ))}
            </div>
            {/* Pagination */}
            <div className="">
                {meta && meta.last_page > 1 && (
                <Pagination meta={meta} onPageChange={(p) => setPage(p)}
                />
                )}
            </div>
        </div>
            {/*Deleted Dialog*/}
            <DeletedDialog
                open={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                    setSelectedPT(null);
                }}
                onConfirm={handleDeletePT}
            />
            {/* Edit PT Dialog */}
            <Dialog 
                open={openEdit} 
                onClose={() => setOpenEdit(false)}>
                {selectedPT && (
                    <PTForm
                    mode="edit"
                    pt={selectedPT}
                    onSubmit={handleUpdatePT}
                    onClose={() => setOpenEdit(false)}
                    loading={isSubmitting}
                    />
                )}
            </Dialog>


    </>
    );    
};