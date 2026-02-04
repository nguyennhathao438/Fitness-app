export default function StatHeader({ name, value, icon, className,className1 }) {
    return (
        <div className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow ${className}`}>
            
            {/* Icon */}
            {icon && (
                <div className={`p-3 ${className1} rounded-lg`}>
                    {icon}
                </div>
            )}

            {/* Content */}
            <div>
                <p className="text-gray-500 text-sm">{name}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
            </div>
        </div>
    );
}
