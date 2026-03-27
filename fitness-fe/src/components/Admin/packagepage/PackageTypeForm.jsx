import { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { getAllServiceForForm } from "../../../services/admin/PackageTypeService"; 

export default function PackageTypeForm({ mode = "add", initialData, onClose, onSubmit, loading }) {
  
  const [name, setName] = useState(initialData?.name || "");
  const [selectedServices, setSelectedServices] = useState(() => {
    return initialData?.services?.map(s => s.id) || [];
  });
  const [services, setServices] = useState([]); 
  const [isFetching, setIsFetching] = useState(true);

  const [error, setError] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    getAllServiceForForm()
      .then((res) => {
        const data = res.data.data || [];
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => setServices([]))
      .finally(() => setIsFetching(false)); 
  }, []);

  const handleCheckboxChange = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Vui lòng nhập tên loại gói.");
      nameRef.current.focus();
      return; 
    }

    onSubmit({ name, service_ids: selectedServices });
  };

  return (
    <div className="w-[520px] max-w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-bold uppercase tracking-tight">
          {mode === "add" ? "Thêm Loại Gói" : "Cập Nhật Loại Gói"}
        </h2>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Tên loại gói */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase px-1">Tên loại gói <span className="text-red-500">*</span></label>
          <input
            ref={nameRef} 
            type="text"
            placeholder="Nhập tên loại gói..."
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 outline-none transition-all text-sm
              ${error ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-purple-500"}
            `}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(""); 
            }}
          />
          {/* Hiện chữ đỏ báo lỗi */}
          {error && <p className="text-red-500 text-xs mt-1.5 font-medium px-1">{error}</p>}
        </div>

        {/* Danh sách dịch vụ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase px-1">
            Dịch vụ đi kèm ({selectedServices.length})
          </label>
          <div className="border border-gray-200 rounded-lg p-3 max-h-52 overflow-y-auto bg-gray-50 custom-scrollbar">
            {isFetching ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-purple-600" size={24} />
              </div>
            ) : services.length === 0 ? (
              <p className="text-center text-gray-400 text-xs italic py-4">Chưa có dịch vụ nào.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {services?.map((sv) => (
                  <label key={sv.id} className="flex items-center gap-2 p-2 hover:bg-white rounded-md cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      checked={selectedServices.includes(sv.id)}
                      onChange={() => handleCheckboxChange(sv.id)}
                    />
                    <span className="text-sm text-gray-700 font-medium">{sv.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Xác nhận"}
          </button>
        </div>
      </form>
    </div>
  );
}