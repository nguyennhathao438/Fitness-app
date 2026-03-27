import { FilterIcon, SearchIcon } from "lucide-react";
import {useEffect, useState } from "react";
import PTCard from "../../components/Admin/PTPage/PTCard";
import { deletedPT, getPersonalTrainers, updatedUser } from "../../services/admin/PersonalTrainerService";
import Pagination from "../../components/Admin/Pagination";
import { toast } from "react-toastify";
import DeletedDialog from "../../components/Admin/DeletedDialog";
import PTForm from "../../components/Admin/PTForm";
import Dialog from "../../components/Admin/Dialog";

export default function PT({ refreshKey,onChanged }){
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
            setMeta(res.data.data);// META PAGINATION
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
        await deletedPT(selectedPT.id);

        toast.success("Xóa thành công");

        setOpenDelete(false);
        setSelectedPT(null);

        // reload list
        getPersonalTrainers({ page, keyword: debouncedSearch, gender, sort })
            .then(res => {
                setPts(res.data.data.data);
                setMeta(res.data.data);
            });
        onChanged?.();
        } catch (err) {
            console.error(err);
            toast.error("PT đang có học viên nên không thể xóa");
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
            onChanged?.();
        } catch (err) {
            console.log("lỗi",err);
            toast.error("Cập nhật thất bại");
        }   finally {
      setIsSubmitting(false);
        }
    };

    return(
        <>
        <div className="">
            {/* FILTER BAR */}
            <div className="mb-2">
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}
                <div className="relative w-full lg:max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                    value={keyword}
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg
                            focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                {/* Gender */}
                <div className="relative w-full sm:w-[180px]">
                    <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                    >
                    <option value="">Tất cả giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Giới tính khác</option>
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
                    <option value="desc">Mới nhất</option>
                    <option value="asc">Cũ nhất</option>
                    </select>
                </div>

                </div>
            </div>
            </div>
            {/* Card PT */}
            <div className="p-1 bg-[#F6F5F5] mx-2 gap-12 lg:gap-10 xl:gap-10  grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 rounded-lg">
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
                name="Xóa PT"
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