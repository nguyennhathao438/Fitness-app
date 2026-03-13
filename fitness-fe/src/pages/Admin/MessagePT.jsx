import ConversationItem from "@/components/Admin/messagepage/ConversationItem";
import MessageItem from "@/components/Admin/messagepage/MessageItem";
import echo from "@/lib/echo";
import { getAdminAndMemberListChat} from "@/services/admin/Message";
import { getMe } from "@/services/admin/PersonalTrainerService";
import { useEffect, useState } from "react";

export default function MessagePT() {

    const [selectedMember, setSelectedMember] = useState(null);
    const [listMember, setListMember] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            const res = await getMe();
            setCurrentUserId(res.data.id);
        };
        fetchMe();
    }, []);
    useEffect(() => {
        if (!currentUserId) return;

        const channel = echo.private(`chat.${currentUserId}`);

        channel.listen(".MessageSent", (e) => {

            const msg = e.message;
    
            setListMember(prev => {

                const updated = prev.map(user => {

                    if (user.id === msg.sender_id || user.id === msg.receiver_id) {

                        const otherId = msg.sender_id === currentUserId 
                            ? msg.receiver_id 
                            : msg.sender_id;

                        if (user.id === otherId) {
                            return {
                                ...user,
                                last_message: msg.content,
                                last_time: msg.created_at
                            };
                        }
                    }

                    return user;
                });

                // đưa conversation vừa nhắn lên đầu
                updated.sort((a,b)=> new Date(b.last_time) - new Date(a.last_time));

                return [...updated];

            });

        });

        return () => {
            echo.leave(`chat.${currentUserId}`);
        };

    }, [currentUserId]);
    // debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 400);

        return () => clearTimeout(timer);

    }, [keyword]);

    useEffect(() => {
        fetchAdminAndMember(debouncedKeyword);
    }, [debouncedKeyword]);
    
    const fetchAdminAndMember = async (keyword = "") => {
        try {
            const res = await getAdminAndMemberListChat(keyword);
            setListMember(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <div className="md:flex ">

            <div className="w-full md:w-[300px]">
                <ConversationItem 
                    ptList={listMember}
                    onSelectPT={setSelectedMember}
                    onSearch={setKeyword}
                />
            </div>

            <div className="w-full bg-gray-100">
                <MessageItem pt={selectedMember}/>
            </div>

        </div>
    );
}