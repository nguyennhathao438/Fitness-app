import { useForm } from "react-hook-form";
import imageBMI from "../../assets/imageBMI.png";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";

export default function BodyMaxIndex() {
  const [flagBMI, setFlagBMI] = useState(false)
  const [bmi, setBMI] = useState(null)

  // Schema Zod - height và weight là number, kiểm tra range
  const bmiSchema = z.object({
    height: z.number({
      required_error: "Vui lòng nhập chiều cao",
      invalid_type_error: "Chiều cao phải là số"
    })
      .min(50, "Chiều cao tối thiểu là 50cm")
      .max(250, "Chiều cao tối đa là 250cm"),

    weight: z.number({
      required_error: "Vui lòng nhập cân nặng",
      invalid_type_error: "Cân nặng phải là số"
    })
      .min(20, "Cân nặng tối thiểu là 20kg")
      .max(300, "Cân nặng tối đa là 300kg"),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bmiSchema),
    defaultValues: { height: "", weight: "" }
  })

  const onSubmit = (data) => {
    try {
      const heightInMeters = data.height / 100;
      const bmiValue = data.weight / (heightInMeters ** 2);
      setBMI(bmiValue)
      setFlagBMI(true)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tính BMI", error)
    }
  }

  const onError = (err) => {
    const firstError = Object.values(err)[0]
    if (firstError)
      toast.error(firstError.message)
  }

  return (
    <div>
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT - IMAGE PLACEHOLDER */}
          <div className="flex justify-center">
            <div className="w-[500px] h-[500px] bg-gradient-to-tr from-purple-100 to-purple-200 flex items-center justify-center rounded-3xl shadow-xl transform transition hover:scale-105">
              <img src={imageBMI} alt="BMI" className="w-96 h-96 object-contain" />
            </div>
          </div>

          {/* RIGHT - CONTENT */}
          <div className="flex flex-col">
            <h2 className="text-4xl font-extrabold mb-4 text-purple-800">TÍNH BMI (CHỈ SỐ KHỐI CƠ THỂ)</h2>

            <p className="text-gray-700 mb-8 leading-relaxed">
              Đo chỉ số BMI để đánh giá mức độ béo, gầy hay cân nặng lý tưởng.
              Chỉ số BMI giúp theo dõi tình trạng cơ thể trong quá trình tập luyện
              và chăm sóc sức khỏe.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* HEIGHT INPUT */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Chiều cao (cm)</label>
                  <input
                    {...register("height", { valueAsNumber: true })}
                    type="number"
                    placeholder="Nhập chiều cao"
                    className="border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  />
                  {errors.height && <p className="text-red-500 mt-1">{errors.height.message}</p>}
                </div>

                {/* WEIGHT INPUT */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Cân nặng (kg)</label>
                  <input
                    {...register("weight", { valueAsNumber: true })}
                    type="number"
                    placeholder="Nhập cân nặng"
                    className="border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  />
                  {errors.weight && <p className="text-red-500 mt-1">{errors.weight.message}</p>}
                </div>
              </div>

              <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg transition transform hover:scale-105">
                NHẬN KẾT QUẢ
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BMI RESULT CARD */}
      {flagBMI && (
        <div className="mt-10 max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* BMI CHART */}
            <div className="bg-white rounded-3xl shadow-lg p-6 transform transition hover:scale-105">
              <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">BIỂU ĐỒ BMI</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { range: "Dưới 18.5", status: "Thiếu cân" },
                  { range: "18.5 - 24.9", status: "Bình thường" },
                  { range: "25.0 - 29.9", status: "Dư cân" },
                  { range: "Trên 30", status: "Béo phì" },
                ].map((item, idx) => (
                  <>
                    <div key={idx} className="border-r border-gray-300 py-2 text-center font-medium text-gray-600">{item.range}</div>
                    <div key={idx + "s"} className="text-center py-2 text-gray-700 font-semibold">{item.status}</div>
                  </>
                ))}
              </div>
            </div>

            {/* BMI RESULT */}
            <div className="bg-white rounded-3xl shadow-lg p-6 transform transition hover:scale-105">
              <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Kết quả của bạn</h2>
              <div className="border border-purple-200 bg-purple-50 p-6 rounded-2xl text-center text-2xl font-semibold text-purple-800 transform transition hover:scale-105">
                Chỉ số BMI của bạn là:
                <span className="text-red-500 text-5xl ml-2">{bmi?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}