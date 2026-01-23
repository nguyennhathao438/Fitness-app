export default function StepSurvey({ prev }) {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl text-yellow-400 font-semibold">
        Khảo sát tập luyện
      </h2>

      <p className="text-gray-300">Phần này sẽ được hoàn thiện sau 🚧</p>

      <button
        onClick={prev}
        className="px-6 py-3 border-2 border-yellow-400 text-yellow-400 rounded-full"
      >
        Quay lại
      </button>
    </div>
  );
}
