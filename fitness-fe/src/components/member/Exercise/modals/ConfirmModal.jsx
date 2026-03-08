import Modal from "@/components/ui/modal";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc muốn thực hiện hành động này?",
    confirmText = "Xác nhận",
    cancelText = "Hủy"
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            bgColor="bg-zinc-900"
            txtColor="text-white"
        >
            <p className="text-sm text-gray-400 mb-6">
                {message}
            </p>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-600"
                >
                    {cancelText}
                </button>

                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}