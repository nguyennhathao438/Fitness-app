import { X } from "lucide-react";
import { useState } from "react";
import { createRole } from "../../services/admin/Role";
import { toast } from "react-toastify";

export default function AddRoleModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Tên role không được để trống");
      return;
    }

    setLoading(true);
    try {
      const res = await createRole(form);
      toast.success("Tạo role thành công");

      onCreated?.(res.data.data); // trả role mới cho parent
      onClose();
      setForm({ name: "", description: "" });
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi kết nối sever");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative w-[500px] rounded-xl bg-white shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Add Role</h2>
          <X
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-800"
          />
        </div>

        {/* body */}
        <div className="space-y-4 px-6 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Role name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Admin, PT, Receptionist..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mô tả vai trò"
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`rounded-lg px-5 py-2 text-white transition ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
