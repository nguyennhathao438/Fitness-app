import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export default function ServiceForm({ mode = "add", initialData, onClose, onSubmit, loading }) {
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <div className="p-1 bg-white rounded-[32px] w-[550px] max-w-full relative overflow-hidden">
      {/* Nút đóng nhanh */}
      <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors">
        <X size={20} />
      </button>

      <div className="p-8">
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 mb-4 transform rotate-3">
                <Sparkles size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                {mode === "add" ? "Thêm Dịch Vụ" : "Cập Nhật"}
            </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-800 uppercase tracking-widest ml-1 mb-2 block">Tên dịch vụ</label>
            <input 
              type="text" 
              required
              autoFocus
              className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-gray-800 font-semibold placeholder:font-normal"
              placeholder="VD: xông hơi xoa bóp..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading || !name}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 shadow-xl shadow-gray-200 hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full py-3 text-gray-400 font-semibold hover:text-gray-800 transition-colors text-sm"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}