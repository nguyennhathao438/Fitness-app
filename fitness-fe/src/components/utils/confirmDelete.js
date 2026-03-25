import Swal from "sweetalert2";

export const confirmDelete = async ({
  title = "Bạn chắc chắn?",
  text = "Hành động này không thể hoàn tác!",
  confirmText = "Xóa",
  cancelText = "Hủy",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7c3aed", // purple-600
    cancelButtonColor: "#d1d5db", // gray-300
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};
