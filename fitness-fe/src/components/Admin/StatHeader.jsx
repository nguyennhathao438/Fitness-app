import { Skeleton } from "@/components/ui/skeleton";

export default function StatHeader({
  name,
  value,
  subValue,
  icon,
  className,
  className1,
  loading = false,
}) {
  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow ${className}`}>
      
      {/* Icon */}
      {icon && (
        <div className={`p-3 ${className1} rounded-lg`}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex gap-4">
        <div>
          <p className="text-gray-500 text-sm">{name}</p>

          {loading ? (
            <Skeleton className="h-7 w-28 mt-1" />
          ) : (
            <h2 className="text-2xl font-bold">{value}</h2>
          )}
        </div>

        <div className="flex items-end">
          {loading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            subValue
          )}
        </div>
      </div>
    </div>
  );
}
