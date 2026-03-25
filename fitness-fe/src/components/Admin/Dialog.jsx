export default function Dialog({ open, onClose, children, width = "max-w-lg" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full ${width} mx-4 bg-white rounded-xl shadow-lg`}
      >
        {children}
      </div>
    </div>
  );
}
