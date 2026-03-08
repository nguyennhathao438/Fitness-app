import defaultAvatar from "@/assets/default-avatar.jpg";

export function UpdatePTHeader({ member }) {
  return (
    <div className="relative rounded-t-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white mb-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={member?.avatar || defaultAvatar}
            className="size-14 rounded-full object-cover bg-white"
          />
          <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-purple-500 flex items-center justify-center text-xs">
            ✓
          </span>
        </div>

        <div>
          <div className="text-lg font-semibold">
            {member?.name}
          </div>
          <div className="text-sm opacity-90">
            Member 
          </div>
        </div>
      </div>
    </div>
  );
}
