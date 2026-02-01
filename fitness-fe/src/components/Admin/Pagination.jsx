export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page } = meta;

  const baseBtn =
    "px-3 py-1 rounded-md border text-sm transition-all duration-200";
  const normalBtn =
    "bg-white border-gray-300 text-gray-700 hover:bg-purple-100 hover:border-purple-400 hover:text-purple-600";
  const activeBtn =
    "bg-purple-600 border-purple-600 text-white font-semibold";
  const disabledBtn =
    "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";

  return (
    <div className="flex gap-2 justify-center mt-4">
      {/* Prev */}
      <button
        disabled={current_page === 1}
        onClick={() => onPageChange(current_page - 1)}
        className={`${baseBtn} ${
          current_page === 1 ? disabledBtn : normalBtn
        }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      {[...Array(last_page)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${baseBtn} ${
              page === current_page ? activeBtn : normalBtn
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        disabled={current_page === last_page}
        onClick={() => onPageChange(current_page + 1)}
        className={`${baseBtn} ${
          current_page === last_page ? disabledBtn : normalBtn
        }`}
      >
        Next
      </button>
    </div>
  );
}
