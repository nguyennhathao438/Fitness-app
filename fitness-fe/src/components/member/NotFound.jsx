import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center px-6">
        {/* 404 */}
        <h1 className="text-8xl font-extrabold text-red-600 tracking-widest">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-bold uppercase">
          Trang không tồn tại
        </h2>

        {/* Description */}
        <p className="mt-2 text-gray-400">
          Có vẻ bạn đã đi sai hướng. Hãy quay lại để tiếp tục tập luyện!
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-xl font-semibold"
        >
          Quay về trang chủ
        </Link>

        {/* Fitness line */}
        <p className="mt-6 text-sm text-gray-500 italic">No pain no gain 💪</p>
      </div>
    </div>
  );
}
