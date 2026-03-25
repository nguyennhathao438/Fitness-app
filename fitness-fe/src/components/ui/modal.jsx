import { X } from "lucide-react";

export default function Modal({
    open,
    onClose,
    title,
    children,
    bgColor,
    txtColor,
    border,
    width = "max-w-md",
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            {/* Overlay */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className={`relative w-full ${border} ${width} ${bgColor} rounded-xl shadow-lg p-6 z-10`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-semibold ${txtColor}`}>{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div>{children}</div>
            </div>
        </div>
    );
}
