import { useState, useEffect, useRef } from "react";
import { getPackageTypes } from "../../../services/admin/Package";

export default function PackageForm({ mode = "add", initialData, onClose, onSubmit, loading }) {
  
  const formatInitialPrice = (price) => {
    if (!price) return "";
    return parseInt(price, 10).toString(); 
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: formatInitialPrice(initialData?.price),
    duration_days: initialData?.duration_days || "",
    package_type_id: initialData?.package_type_id || "",
    description: initialData?.description || "",
  });

  const [types, setTypes] = useState([]);
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const typeRef = useRef(null); 
  const durationRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    getPackageTypes()
      .then((res) => {
        setTypes(res.data.data || res.data || []);
      })
      .catch((err) => console.error("Lỗi load loại gói:", err));
  }, []); 

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === "price" || name === "duration_days") {
        value = value.replace(/\D/g, ""); 
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "duration_days" && value !== "" && Number(value) <= 0) {
      setErrors((prev) => ({ ...prev, [name]: "Thời hạn phải lớn hơn 0!" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let firstInvalidRef = null;

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên gói tập.";
      if (!firstInvalidRef) firstInvalidRef = nameRef;
    }

    if (!formData.package_type_id) {
      newErrors.package_type_id = "Vui lòng chọn loại gói tập.";
      if (!firstInvalidRef) firstInvalidRef = typeRef;
    }

    if (!formData.duration_days || Number(formData.duration_days) <= 0) {
      newErrors.duration_days = "Thời hạn phải lớn hơn 0.";
      if (!firstInvalidRef) firstInvalidRef = durationRef;
    }

    if (formData.price === "") {
      newErrors.price = "Vui lòng nhập giá tiền.";
      if (!firstInvalidRef) firstInvalidRef = priceRef;
    }

    setErrors(newErrors);

    if (firstInvalidRef) {
      firstInvalidRef.current.focus();
      return false; 
    }

    return true; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-purple-600 px-6 py-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-white uppercase tracking-wide">
          {mode === "add" ? "Thêm Gói Tập Mới" : "Cập Nhật Gói Tập"}
        </h2>
        <p className="text-purple-200 text-xs mt-0.5">Vui lòng điền đầy đủ thông tin bên dưới</p>
      </div>

      {/* Body Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
        {/* Tên Gói */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên gói tập <span className="text-red-500">*</span></label>
          <input
            ref={nameRef}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ví dụ: Gói VIP 1 Tháng"
            className={`w-full px-3 py-2 border rounded focus:ring-2 outline-none transition-all text-sm
              ${errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-500"}
            `}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Loại Gói */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại gói <span className="text-red-500">*</span></label>
            <select
                ref={typeRef} 
                name="package_type_id"
                value={formData.package_type_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:ring-2 outline-none transition-all text-sm bg-white
                  ${errors.package_type_id ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-500"}
                `}
            >
                <option value="">-- Chọn loại --</option>
                {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
            {errors.package_type_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.package_type_id}</p>}
          </div>

          {/* Thời Hạn */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thời hạn (Ngày) <span className="text-red-500">*</span></label>
            <input
                ref={durationRef}
                type="text" 
                inputMode="numeric" 
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                placeholder="Ví dụ: 30"
                className={`w-full px-3 py-2 border rounded focus:ring-2 outline-none transition-all text-sm
                  ${errors.duration_days ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-500"}
                `}
            />
            {errors.duration_days && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.duration_days}</p>}
          </div>
        </div>

        {/* Giá Tiền */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá niêm yết (VNĐ) <span className="text-red-500">*</span></label>
            <div className="relative">
                <input
                    ref={priceRef}
                    type="text" 
                    inputMode="numeric" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Ví dụ: 500000"
                    className={`w-full pl-3 pr-12 py-2 border rounded focus:ring-2 outline-none transition-all text-sm font-medium text-gray-800
                      ${errors.price ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-purple-500"}
                    `}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm font-medium">VNĐ</span>
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.price}</p>}
        </div>

        {/* Mô Tả */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả chi tiết</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả về quyền lợi của gói..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm resize-none"
          ></textarea>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-md shadow-purple-200 transition-all text-sm flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Đang lưu...
                </>
            ) : "Xác nhận"}
          </button>
        </div>
      </form>
    </div>
  );
}