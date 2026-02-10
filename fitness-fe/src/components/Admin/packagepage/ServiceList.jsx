import { useEffect, useState } from "react";
import { Edit, Trash2, Loader2, Activity, Search, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { getAllServices, deleteService, updateService } from "../../../services/admin/PackageTypeService";

import Dialog from "../../Admin/Dialog";
import ServiceForm from "./ServiceForm";
import DeletedDialog from "../../Admin/DeletedDialog";

export default function ServiceList({ refreshKey, onChanged }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE PHÂN TRANG & BỘ LỌC ---
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    page: 1
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllServices(filters)
      .then(res => {
        const paginateData = res.data.data;
        setServices(paginateData.data || []);
        setPagination({
          currentPage: paginateData.current_page,
          lastPage: paginateData.last_page,
        });
      })
      .catch(() => toast.error("Không thể tải danh sách dịch vụ"))
      .finally(() => setLoading(false));
  }, [refreshKey, filters]);

  const handleSearchChange = (e) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.lastPage) {
      setFilters(prev => ({ ...prev, page: pageNumber }));
    }
  };

  // Render các nút số trang
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pagination.lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all border ${
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
      await updateService(editData.id, formData);
      toast.success("Cập nhật dịch vụ thành công");
      setOpenEdit(false);
      onChanged();
    } catch (err) { toast.error("Lỗi cập nhật"); }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteService(deleteId);
      toast.success("Xóa dịch vụ thành công");
      setOpenDelete(false);
      onChanged();
    } catch (err) { toast.error("Lỗi khi xóa"); }
  };

  return (
    <div className="space-y-4">
      {/* THANH TÌM KIẾM  */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm tên dịch vụ..."
            className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        {filters.search && (
          <button 
            onClick={() => setFilters({ search: "", page: 1 })}
            className="text-gray-400 hover:text-purple-600 p-1.5 transition-colors"
            title="Xóa tìm kiếm"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/*  BẢNG DANH SÁCH */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th className="p-4 whitespace-nowrap">Thông tin dịch vụ</th>
              <th className="p-4 text-center whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="2" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <Loader2 className="animate-spin text-purple-600" size={24} />
                  </div>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-12 text-center text-gray-400 italic">
                  Không tìm thấy dịch vụ nào phù hợp.
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="hover:bg-purple-50 transition-colors duration-150 group">
                  <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 group-hover:bg-white group-hover:scale-110 transition-all">
                      <Activity size={16}/>
                    </div>
                    {s.name}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setEditData(s); setOpenEdit(true); }} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => { setDeleteId(s.id); setOpenDelete(true); }} className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PHẦN PHÂN TRANG */}
        {!loading && pagination.lastPage > 1 && (
          <div className="flex items-center justify-center gap-3 p-4 bg-white border-t border-gray-50">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => goToPage(pagination.currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            
            <div className="flex items-center gap-2">
              {renderPageNumbers()}
            </div>

            <button
              disabled={pagination.currentPage === pagination.lastPage}
              onClick={() => goToPage(pagination.currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* DIALOGS */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <ServiceForm key={editData?.id} mode="edit" initialData={editData} onClose={() => setOpenEdit(false)} onSubmit={handleUpdate} />
      </Dialog>
      <DeletedDialog open={openDelete} onClose={() => setOpenDelete(false)} onConfirm={handleConfirmDelete} name="dịch vụ" />
    </div>
  );
}