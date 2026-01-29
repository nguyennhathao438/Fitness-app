import imageBMI from "../../assets/img/imageBMI.png";
export default function BodyMetric() {
  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Chiều cao / cm"
              className="border px-4 py-3 rounded outline-none focus:border-red-500"
            />

            <input
              type="number"
              placeholder="Cân nặng / kg"
              className="border px-4 py-3 rounded outline-none focus:border-red-500"
            />

            <input
              type="number"
              placeholder="Tuổi"
              className="border px-4 py-3 rounded outline-none focus:border-red-500"
            />

            <select
              className="border px-4 py-3 rounded outline-none focus:border-red-500"
            >
              <option value="">Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>

            <input
              type="text"
              placeholder="Họ và tên"
              className="border px-4 py-3 rounded outline-none focus:border-red-500 sm:col-span-2"
            />

            <input
              type="tel"
              placeholder="Số điện thoại"
              className="border px-4 py-3 rounded outline-none focus:border-red-500 sm:col-span-2"
            />
          </div>

          {/* BUTTON */}
          <button className="mt-6 bg-red-600 text-white px-8 py-3 rounded hover:bg-red-700 transition">
            NHẬN KẾT QUẢ
          </button>
        </div>
      </div>
    </div>
  );
}
