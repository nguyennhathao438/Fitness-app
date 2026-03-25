import ConversationItem from "@/components/Admin/messagepage/ConversationItem";
import MessageItem from "@/components/Admin/messagepage/MessageItem";
import { getEcho } from "@/lib/echo";
import { getPTListChat } from "@/services/admin/Message";
import { getMe } from "@/services/admin/PersonalTrainerService";
import { useEffect, useState } from "react";

export default function Message() {

    const [selectedPT, setSelectedPT] = useState(null);
    const [listPT, setListPT] = useState([]);

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
        const echo = getEcho();
        if (!currentUserId) return;

        const channel = echo.private(`chat.${currentUserId}`);

        channel.listen(".MessageSent", (e) => {

            const msg = e.message;
            setListPT(prev => {

                const updated = prev.map(user => {

                    if (user.id === msg.sender_id || user.id === msg.receiver_id) {

                        const otherId = msg.sender_id === currentUserId 
                            ? msg.receiver_id 
                            : msg.sender_id;

                        if (user.id === otherId) {
                            return {
                                ...user,
                                last_message: msg.content,
                                last_time: new Date(msg.created_at).toLocaleString("sv-SE"),
                                last_sender_id: msg.sender_id
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
        const fetchPT = async (keyword = "") => {
        try {
            const res = await getPTListChat(keyword);
            setListPT(res.data);
        } catch (err) {
            console.error(err);
        }
    }
        fetchPT(debouncedKeyword);
    }, [debouncedKeyword]);    

    return(
        <div className="md:flex ">

            <div className="w-full md:w-[300px]">
                <ConversationItem 
                    ptList={listPT}
                    onSelectPT={setSelectedPT}
                    onSearch={setKeyword}
                    currentUserId={currentUserId}
                />
            </div>

            <div className="w-full bg-gray-100">
                <MessageItem key={selectedPT?.id} pt={selectedPT} type="admin"/>
            </div>

        </div>
    );
}