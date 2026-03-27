import { SearchIcon } from "lucide-react";
import { useState } from "react";
import defaultAvatar from "@/assets/default-avatar.jpg";

export default function ConversationItem({ ptList, onSelectPT, onSearch, currentUserId}) {

    const [selectedId, setSelectedId] = useState(null);
    
    const handleSelect = (pt) => {
        setSelectedId(pt.id);
        onSelectPT(pt);
    };

    return (
        <div className="w-full md:w-[230px] lg:w-[300px] border-r md:h-[825px] md:overflow-y-hidden">

            {/* Search */}
            <div className="relative p-4 md:block">
                <SearchIcon className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

                <input
                    type="text"
                    placeholder="Tìm kiếm tên người dùng..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            {/* Conversation list */}
            <div className="flex md:block overflow-x-auto md:overflow-visible">

                {ptList.map(pt => (

                    <div
                        key={pt.id}
                        onClick={() => handleSelect(pt)}
                        className={`
                        flex flex-col max-md:p-4 max-md:p-2 max-md:ml-2 md:flex-row items-center gap-2 md:gap-3
                        px-3 py-3 md:px-4
                        cursor-pointer transition-all
                        border-b md:border-b border-gray-200
                        min-w-[70px] md:min-w-full
                        ${selectedId === pt.id
                            ? "md:border-l-4 md:border-purple-600 bg-purple-50"
                            : "hover:bg-purple-50"}
                        `}
                    >

                        <img
                            src={pt.avatar || defaultAvatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="hidden md:block flex-1">

                            <div className="flex justify-between items-center">

                                <p className="font-medium text-sm">
                                    {pt.name}
                                </p>
                            </div>
                            
                            <div className="flex justify-between">
                                <p className="text-xs text-gray-500 truncate md:w-[100px] lg:w-[175px]">
                                    {pt.last_sender_id === currentUserId 
                                        ? `Bạn: ${pt.last_message}` 
                                        : pt.last_message}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                {pt.last_time ? pt.last_time.slice(11, 16) : ""}
                                </p>
                            </div>
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}