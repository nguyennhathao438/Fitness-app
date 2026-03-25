import defaultAvatar from "@/assets/default-avatar.jpg";

export default function MemberCard({ member }) {
  return (
    <div className="relative bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 p-4">
      
      {/* Status */}
      <span className="
        absolute top-3 right-3
        px-2 py-1 text-xs rounded-full
        bg-green-100 text-green-600
      ">
        Active
      </span>

      {/* Content */}
      <div className="flex items-center gap-4 mt-3">
        {/* Avatar */}
        <img
          src={member.avatar || defaultAvatar}
          alt={member.name}
          className="size-14 rounded-full object-cover shrink-0"
        />

        {/* Info */}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 leading-tight">
            {member.name}
          </span>
          <span className="text-sm text-gray-500">
            Tuổi: {member.age}
          </span>
        </div>
      </div>
    </div>
  );
}
