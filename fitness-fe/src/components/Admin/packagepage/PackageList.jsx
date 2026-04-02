import { useEffect, useState } from "react";
import { Edit, Trash2, Loader2, Eye, X, Search, Filter, DollarSign, ArrowUpDown } from "lucide-react"; 
import { toast } from "react-toastify";
import { getPackages, deletePackage, updatePackage, getPackageTypes } from "../../../services/admin/Package";

import Dialog from "../../Admin/Dialog";
import DeletedDialog from "../../Admin/DeletedDialog"; 
import PackageForm from "./PackageForm";

export default function PackageList({ refreshKey, onChanged }) {
  const [packages, setPackages] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    package_type_id: "",
    min_price: "", 
    max_price: "",
    sort_price: "",
    page: 1 
  });

  const [editData, setEditData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    getPackageTypes().then(res => setTypes(res.data.data || res.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    getPackages(filters)
      .then((res) => {
        const paginateData = res.data.data; 
        setPackages(paginateData.data || []);
        setPagination({
          currentPage: paginateData.current_page,
          lastPage: paginateData.last_page,
        });
      })
      .catch(() => toast.error("Không thể tải danh sách"))
      .finally(() => setLoading(false));
  }, [refreshKey, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.lastPage) {
      setFilters(prev => ({ ...prev, page: pageNumber }));
    }
  };

  const renderPageNumbers = () => {
    const { currentPage, lastPage } = pagination;
    let pageRange = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pageRange.push(i);
    } else {
      if (currentPage <= 3) {
        pageRange = [1, 2, 3, 4, "...", lastPage];
      } else if (currentPage >= lastPage - 2) {
        pageRange = [1, "...", lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
      } else {
        pageRange = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
      }
    }

    return pageRange.map((page, index) => {
      if (page === "...") {
        return <span key={`ellipsis-${index}`} className="px-2 text-gray-400 font-bold tracking-widest">...</span>;
      }
      return (
        <button
          key={`page-${page}`}
          onClick={() => goToPage(page)}
          className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all border ${
            currentPage === page
              ? "bg-purple-600 text-white border-purple-600 shadow-md scale-110"
              : "bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePackage(deleteId);
      toast.success("Đã xóa gói tập");
      setOpenDelete(false);
      onChanged(); 
    } catch (err) { toast.error("Lỗi khi xóa"); }
  };

  const handleUpdate = async (formData) => {
    try {
      await updatePackage(editData.id, formData);
      toast.success("Cập nhật thành công");
      setOpenEdit(false);
      onChanged();
    } catch (error) { toast.error("Lỗi cập nhật"); }
  };

  return (
    <div className="space-y-4">
      {/* --- THANH TÌM KIẾM & LỌC --- */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Tìm kiếm */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" name="search" placeholder="Tìm kiếm gói tập..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
            value={filters.search} onChange={handleFilterChange}
          />
        </div>

        {/* Các bộ lọc */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Lọc Loại gói */}
          <div className="flex flex-1 sm:flex-none items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <select 
              name="package_type_id"
              className="bg-transparent text-sm outline-none cursor-pointer w-full sm:w-auto"
              value={filters.package_type_id} onChange={handleFilterChange}
            >
              <option value="">Tất cả loại gói</option>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          {/* NHẬP GIÁ ĐẦU - GIÁ CUỐI */}
          <div className="flex flex-1 sm:flex-none items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
            <DollarSign size={14} className="text-gray-400 shrink-0" />
            <input 
              type="number" 
              name="min_price" 
              placeholder="Giá từ..."
              className="bg-transparent text-sm outline-none w-full sm:w-20"
              value={filters.min_price} 
              onChange={handleFilterChange}
            />
            <span className="text-gray-300">-</span>
            <input 
              type="number" 
              name="max_price" 
              placeholder="Đến..."
              className="bg-transparent text-sm outline-none w-full sm:w-20"
              value={filters.max_price} 
              onChange={handleFilterChange}
            />
          </div>

          {/* Sắp xếp giá */}
          <div className="flex flex-1 sm:flex-none items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
            <ArrowUpDown size={14} className="text-gray-400 shrink-0" />
            <select 
              name="sort_price"
              className="bg-transparent text-sm outline-none cursor-pointer w-full sm:w-auto"
              value={filters.sort_price} onChange={handleFilterChange}
            >
              <option value="">Sắp xếp</option>
              <option value="asc">Giá: Thấp đến Cao</option>
              <option value="desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

        </div>
      </div>

      {/* --- BẢNG DANH SÁCH --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 whitespace-nowrap">
              <tr>
                <th className="p-4">Package</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Duration</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-12 text-center"><Loader2 className="animate-spin inline text-purple-600"/></td></tr>
              ) : packages.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic">No packages found.</td></tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-purple-50 transition-colors duration-150 group">
                    <td className="p-4 font-medium text-gray-800">{pkg.name}</td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[12px] font-medium uppercase border border-indigo-100 whitespace-nowrap">
                        {pkg.package_type?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium text-center whitespace-nowrap">
                      {parseInt(pkg.price).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4 text-gray-600 font-medium text-center whitespace-nowrap">
                      {pkg.duration_days} days
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setViewData(pkg) || setOpenView(true)} className="cursor-pointer p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"><Eye size={16} /></button>
                        <button onClick={() => { setEditData(pkg); setOpenEdit(true); }} className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => { setDeleteId(pkg.id); setOpenDelete(true); }} className="cursor-pointer p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PHÂN TRANG ĐÃ NÂNG CẤP --- */}
        {!loading && pagination.lastPage > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-4 bg-white border-t border-gray-50">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => goToPage(pagination.currentPage - 1)}
              className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-purple-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {renderPageNumbers()}
            </div>

            <button
              disabled={pagination.currentPage === pagination.lastPage}
              onClick={() => goToPage(pagination.currentPage + 1)}
              className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-purple-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <PackageForm 
          key={editData ? `edit-pkg-${editData.id}` : 'add-pkg'} 
          mode="edit" 
          initialData={editData} 
          onClose={() => setOpenEdit(false)} 
          onSubmit={handleUpdate} 
        />
      </Dialog>

      <Dialog open={openView} onClose={() => setOpenView(false)}>
        {viewData && (
          <div className="bg-white rounded-lg overflow-hidden flex flex-col w-full max-w-2xl mx-auto">
            <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">Chi tiết gói tập</h2>
                    <p className="text-purple-200 text-xs mt-0.5">Thông tin đầy đủ về gói dịch vụ</p>
                </div>
                <button onClick={() => setOpenView(false)} className="cursor-pointer text-white/70 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block ">Tên gói</label>
                        <p className="text-xl font-bold text-gray-800 leading-tight">{viewData.name}</p>
                    </div>
                    <div>
                         <label className="text-xs font-bold text-gray-400 uppercase mb-1 block ">Giá niêm yết</label>
                        <p className="text-2xl font-bold text-gray-800">
                            {parseInt(viewData.price).toLocaleString('vi-VN')} <span className="text-sm font-medium text-gray-500">VNĐ</span>
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block ">Loại gói</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {viewData.package_type?.name || "Chưa phân loại"}
                        </span>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block ">Thời hạn</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {viewData.duration_days} ngày
                        </span>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ">Mô tả chi tiết</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-600  leading-relaxed">
                        {viewData.description || "Không có mô tả nào cho gói tập này."}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
                <button onClick={() => setOpenView(false)} className="cursor-pointer px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all shadow-sm">Đóng</button>
            </div>
          </div>
        )}
      </Dialog>

      <DeletedDialog 
        open={openDelete} 
        onClose={() => setOpenDelete(false)} 
        onConfirm={handleConfirmDelete}
        name="gói tập"
      />
    </div>
  );
}