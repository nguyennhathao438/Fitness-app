import { useEffect, useState } from "react";
import { Edit, Trash2, Loader2, Eye, CheckCircle2, Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"; 
import { toast } from "react-toastify";
import { getPackageTypes, updatePackageType, deletePackageType } from "../../../services/admin/PackageTypeService";

import Dialog from "../../Admin/Dialog";
import DeletedDialog from "../../Admin/DeletedDialog";
import PackageTypeForm from "./PackageTypeForm";

export default function PackageTypeList({ refreshKey, onChanged }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // STATE PHÂN TRANG 
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  const [filters, setFilters] = useState({ 
    search: "", 
    page: 1 
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPackageTypes(filters)
      .then((res) => {
        const paginateData = res.data.data;
        setTypes(paginateData.data || []);
        setPagination({
          currentPage: paginateData.current_page,
          lastPage: paginateData.last_page,
          total: paginateData.total
        });
      })
      .catch(() => toast.error("Lỗi tải loại gói"))
      .finally(() => setLoading(false));
  }, [refreshKey, filters]);

  const handleSearchChange = (e) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pagination.lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border ${
            pagination.currentPage === i
              ? "bg-purple-600 text-white border-purple-600 shadow-md"
              : "bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  //  HÀNH ĐỘNG
  const handleUpdate = async (formData) => {
    try {
      await updatePackageType(editData.id, formData);
      toast.success("Cập nhật thành công");
      setOpenEdit(false);
      onChanged();
    } catch (error) { toast.error("Lỗi cập nhật"); }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePackageType(deleteId);
      toast.success("Đã xóa loại gói");
      setOpenDelete(false);
      onChanged();
    } catch (err) { toast.error(err.response?.data?.message || "Lỗi khi xóa"); }
  };

  return (
    <div className="space-y-4">
      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" placeholder="Tìm tên loại gói..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
            value={filters.search} onChange={handleSearchChange}
          />
        </div>
        {filters.search && (
          <button onClick={() => setFilters({ search: "", page: 1 })} className="text-gray-400 hover:text-purple-600 transition-colors">
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th className="p-4 w-1/4">Tên Loại Gói</th>
              <th className="p-4">Dịch vụ bao gồm</th>
              <th className="p-4 text-center w-40">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr><td colSpan="3" className="p-12 text-center"><Loader2 className="animate-spin inline text-purple-600" size={24}/></td></tr>
            ) : types.length === 0 ? (
              <tr><td colSpan="3" className="p-12 text-center text-gray-400 italic">Không tìm thấy kết quả phù hợp.</td></tr>
            ) : (
              types.map((type) => (
                <tr key={type.id} className="hover:bg-purple-50 transition duration-150">
                  <td className="p-4 font-bold text-gray-800">{type.name}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {type.services?.slice(0, 3).map(s => (
                        <span key={s.id} className="px-2 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[12px] font-medium">
                          {s.name}
                        </span>
                      ))}
                      {type.services?.length > 3 && (
                        <span className="px-2 py-2 bg-gray-100 text-gray-600 rounded text-[12px] font-bold">
                          +{type.services.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setViewData(type) || setOpenView(true)} className="p-2 text-indigo-600 bg-gray-100 hover:bg-indigo-100 rounded-lg transition-colors"><Eye size={16} /></button>
                      <button onClick={() => { setEditData(type); setOpenEdit(true); }} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => { setDeleteId(type.id); setOpenDelete(true); }} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/*  THANH PHÂN TRANG */}
        {!loading && pagination.lastPage > 1 && (
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50/50 border-t border-gray-100">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <div className="flex items-center gap-2">{renderPageNumbers()}</div>
            <button
              disabled={pagination.currentPage === pagination.lastPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/*  DIALOG  */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <PackageTypeForm 
          key={editData ? `edit-${editData.id}` : 'edit-form'} 
          mode="edit" initialData={editData} onClose={() => setOpenEdit(false)} onSubmit={handleUpdate} 
        />
      </Dialog>

      <DeletedDialog open={openDelete} onClose={() => setOpenDelete(false)} onConfirm={handleConfirmDelete} name="loại gói" />

      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <div className="p-6 w-[500px] max-w-full">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Chi Tiết Loại Gói</h2>
            </div>

            {viewData && (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tên gói tập</label>
                        <p className="text-lg font-semibold text-gray-800">{viewData.name}</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-3">
                            Dịch vụ đi kèm ({viewData.services?.length || 0})
                        </label>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                            {viewData.services && viewData.services.length > 0 ? (
                                <ul className="space-y-3">
                                    {viewData.services.map((service) => (
                                        <li key={service.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700 font-medium">{service.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4 text-gray-400 italic">Không có dịch vụ nào.</div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button onClick={() => setOpenView(false)} className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 w-full sm:w-auto">Đóng</button>
                    </div>
                </div>
            )}
        </div>
      </Dialog>
    </div>
  );
}