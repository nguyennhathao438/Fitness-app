import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBodyMetric } from "../../services/member/MemberService.js";
import { toast } from "react-toastify";
export default function StepBodyMetrics({ waiting }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    height: "",
    weight: "",
    muscle: "",
    body_fat: "",
    visceral_fat: "",
    body_water: "",
  });
  const validateForm = () => {
    if (!form.height || form.height <= 0 || form.height >= 250) {
      toast.error("Chiều cao phải lớn hơn 0 và nhỏ hơn 250");
      return false;
    }

    if (!form.weight || form.weight <= 0 || form.weight >= 300) {
      toast.error("Cân nặng phải lớn hơn 0 và nhỏ hơn 300");
      return false;
    }

    if (form.muscle && form.muscle < 0) {
      toast.error("Chỉ số cơ không được âm");
      return false;
    }

    if (form.body_fat && (form.body_fat < 0 || form.body_fat > 100)) {
      toast.error("Mỡ cơ thể phải từ 0 đến 100%");
      return false;
    }

    if (form.visceral_fat && form.visceral_fat < 0) {
      toast.error("Mỡ nội tạng không được âm");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await createBodyMetric(form);
      toast.success("Lưu chỉ số cơ thể thành công");
      if (waiting) {
        setTimeout(() => {
          navigate("/waiting");
        }, 500);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lưu chỉ số cơ thể thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (waiting) {
      setTimeout(() => {
        navigate("/waiting");
      }, 500);
    } else {
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Đo chỉ số cơ thể</h2>
        <p className="text-gray-400">Có thể bỏ qua và cập nhật sau</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
        <input
          name="height"
          type="number"
          placeholder="Chiều cao (cm)"
          value={form.height}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />

        <input
          name="weight"
          type="number"
          placeholder="Cân nặng (kg)"
          value={form.weight}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />

        <input
          name="muscle"
          type="number"
          step="0.1"
          placeholder="Tỷ lệ cơ (%)"
          value={form.muscle}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />

        <input
          name="body_fat"
          type="number"
          step="0.1"
          placeholder="Mỡ cơ thể (%)"
          value={form.body_fat}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />

        <input
          name="visceral_fat"
          type="number"
          placeholder="Mỡ nội tạng"
          value={form.visceral_fat}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />

        <input
          name="body_water"
          type="number"
          step="0.1"
          placeholder="Nước cơ thể (%)"
          value={form.body_water}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
        />
      </div>

      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={handleSkip}
          className="flex-1 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 
    hover:bg-yellow-400 hover:scale-105 hover:text-gray-900 hover:font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30"
        >
          Để sau
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className={`
    flex-1 py-3 rounded-full font-semibold transition-all duration-300
    ${
      !loading
        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
        : "bg-gray-600 text-gray-400 cursor-not-allowed"
    }
  `}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Đang lưu..." : "Lưu chỉ số"}
        </button>
      </div>
    </div>
  );
}
