import { useForm } from "react-hook-form";
import imageBMI from "../../assets/imageBMI.png";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
export default function BodyMetric() {
  const [flagBMI, setFlagBMI] = useState(false)
  const [bmi, setBMI] = useState(null)
  const bmiSchema = z.object({
    height: z.
      string()
      .min(1, "Vui lòng nhập chiều cao")
      .regex(/^\d{3}$/, "Chiều cao phải gồm đúng 3 chữ số"),
    weight: z.
      string()
      .min(1, "Vui lòng nhập cân nặng")
      .min(2, "Cân nặng không hợp lệ")
      .max(3, "Cân không hợp lệ"),
  })
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(bmiSchema)
  })
  const onSubmit = (data) => {
    try {
      console.log("data", data)
      const weight = data.weight
      const height = (data.height * 0.01) * (data.height * 0.01)
      const bmi = weight / height
      setBMI(bmi)
      setFlagBMI(true)
    } catch (error) {
      toast.error(error)
    }
  }
  const onError = (err) => {
    const firstError = Object.values(err)[0]
    if (firstError)
      toast.error(firstError.message)
  }
  
  const resultBMI = (
    <div className="flex flex-col md:flex-row md:gap-5 w-full
                  bg-gray-100 p-6 rounded-2xl shadow-md">

      <div className="flex-1 bg-white rounded-xl shadow-sm
                    transition-all duration-300 hover:shadow-lg">
        <h2 className="text-center font-bold text-4xl py-4">
          BIỂU ĐỒ BMI
        </h2>

        <div className="grid grid-cols-2 items-center">
          <div className="border-r border-gray-300">
            <h2 className="text-center text-xl font-bold py-2">BMI</h2>
          </div>
          <div>
            <h2 className="text-center text-xl font-bold py-2">
              Tình trạng cân nặng
            </h2>
          </div>

          <div className="border-r border-gray-300 py-1">
            <span className="text-center block text-md font-light">
              Dưới 18.5
            </span>
          </div>
          <div>
            <span className="text-center block text-md font-light">
              Thiếu cân
            </span>
          </div>

          <div className="border-r border-gray-300 py-1">
            <span className="text-center block text-md font-light">
              18.5 đến 24.9
            </span>
          </div>
          <div>
            <span className="text-center block text-md font-light">
              Bình thường
            </span>
          </div>

          <div className="border-r border-gray-300 py-1">
            <span className="text-center block text-md font-light">
              25.0 đến 29.9
            </span>
          </div>
          <div>
            <span className="text-center block text-md font-light py-1">
              Dư cân
            </span>
          </div>

          <div className="border-r border-gray-300">
            <span className="text-center block text-md font-light">
              Trên 30
            </span>
          </div>
          <div>
            <span className="text-center block text-md font-light">
              Béo phì
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm
                    transition-all duration-300 hover:shadow-lg">
        <h2 className="text-center font-bold text-4xl py-4">
          Kết quả của bạn
        </h2>

        <p className="border text-2xl p-6 mx-6 rounded-xl text-center
                    bg-gray-50 transition-all duration-300
                    hover:scale-105">
          Chỉ số BMI của bạn là :
          <span className="text-red-600 font-bold text-4xl ml-2">
            {bmi?.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );


  return (
    <div>
      <div className="w-full min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT - IMAGE PLACEHOLDER */}
          <div className="flex justify-center">
            <div className="w-[500px] h-[500px] bg-gray-100 flex items-center justify-center text-gray-400">
              <img src={imageBMI} alt="" />
            </div>
          </div>

          {/* RIGHT - CONTENT */}
          <div>
            <h2 className="text-3xl font-bold mb-4">
              TÍNH BMI (CHỈ SỐ KHỐI CƠ THỂ)
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Đo chỉ số BMI để đánh giá mức độ béo, gầy hay cân nặng lý tưởng.
              Chỉ số BMI giúp theo dõi tình trạng cơ thể trong quá trình tập luyện
              và chăm sóc sức khỏe.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit, onError)} action="">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  {...register("height")}
                  type="number"
                  placeholder="Chiều cao / cm"
                  className="border px-4 py-3 rounded outline-none focus:border-red-500"
                />

                <input
                  {...register("weight")}
                  type="number"
                  placeholder="Cân nặng / kg"
                  className="border px-4 py-3 rounded outline-none focus:border-red-500"
                />

              </div>
              <button className="mt-6 cursor-pointer bg-[#9289e2] hover:bg-[#5a548c] text-white px-8 py-3 rounded transition">
                NHẬN KẾT QUẢ
              </button>
            </form>
          </div>
        </div>
      </div>
      {flagBMI && (resultBMI)}
    </div>
  );
}
