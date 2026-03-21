import { MessageCircle, SendHorizonalIcon } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { getMessages, sendMessage, sendTyping } from "@/services/admin/Message";
import { getMe } from "@/services/admin/PersonalTrainerService";
import { useEffect, useRef, useState } from "react";
import { getEcho } from "@/lib/echo";
import { useSelector } from "react-redux";
import NoPermissionModal from "@/components/utils/NoPermissionModel";

export default function MessageItem({ pt , type}) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const permissions = useSelector((state) => state.auth.permissions);
    const [openNoPermission, setOpenNoPermission] = useState(false);
    const canSendMessage =
    (type === "admin" && permissions?.includes("message_admin.create")) ||
    (type === "pt" && permissions?.includes("message_pt.create"));
    const bottomRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    useEffect(() => {
    const fetchMe = async () => {
        try {
            const res = await getMe();
            console.log("My ID:", res.data.id); // log ở đây
            setCurrentUserId(res.data.id);
        } catch (error) {
            console.error(error);
        }
    };

    fetchMe();
}, []);
    const handleSend = async () => {
    if (!text.trim()) return;

    try {
        const res = await sendMessage(pt.id, text);

        console.log("Message sent:", res.data.message);

        setMessages((prev) => [...prev, res.data.message]);
        setText("");
    } catch (err) {
        console.error("Send message error:", err);
    }
};
    const handleTyping = (e) => {
        setText(e.target.value);

        // gửi trạng thái đang gõ
        // gửi true chỉ khi chưa gõ
        if (!typingTimeoutRef.current) sendTyping(pt.id, true);

        // Xóa timeout cũ
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Nếu ngừng gõ 1.5s, gửi isTyping=false
        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(pt.id, false);
            typingTimeoutRef.current = null;
        }, 1500);
    };
    useEffect(() => {
        if (!pt) return;
        const fetchMessages = async () => {
        try {
            const res = await getMessages(pt.id);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };
        fetchMessages();
    }, [pt]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
    const echo = getEcho();
    if (!currentUserId || !pt) return;

    const channel = echo.private(`chat.${currentUserId}`);

    const listener = (e) => {
        const msg = e.message;

        if (msg.sender_id !== pt.id && msg.receiver_id !== pt.id) return;

        setMessages((prev) => {
            const exists = prev.find(m => m.id === msg.id);
            if (exists) return prev;
            return [...prev, msg];
        });
    };
    const typingListener = (e) => {
            if (e.senderId !== pt.id) return;
            // ví dụ dùng state để hiển thị "User đang gõ..."
            setIsTyping(e.isTyping);
        };

    channel.listen(".TypingEvent", typingListener);
    channel.listen(".MessageSent", listener);
    return () => {
            channel.stopListening(".MessageSent", listener);
            channel.stopListening(".TypingEvent", typingListener);
            echo.leave(channel);
        };
}, [currentUserId, pt]);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);
    if (!pt) {
        return (
            <div className="relative rounded-lg">

                <div className="absolute top-60 left-5 sm:top-60 sm:left-20 xl:top-60 xl:left-90 md:top-60 md:left-15 lg:top-60 lg:left-50 :text-center bg-[#D7BEFF] px-8 py-8 rounded-xl">

                    {/* icon circle */}
                    <div className="w-16 h-16 mx-auto flex items-center justify-center 
                                    bg-purple-100 rounded-full">
                        <MessageCircle className="w-8 h-8 text-purple-600" />
                    </div>

                    {/* title */}
                    <p className="mt-4 font-semibold text-gray-700">
                        Select a conversation
                    </p>

                    {/* description */}
                    <p className="text-sm text-gray-500 mt-1">
                        Choose a user from the list to start messaging
                    </p>

                </div>

            </div>
        );
    }

    return (
        <>
        <div className="h-[825px] border rounded-lg flex flex-col">

            {/* header */}
            <div className="p-4 border-b font-medium flex gap-5 bg-gradient-to-r from-purple-50 via-pink-50">
                <div>
                    <img
                    src={pt.avatar || defaultAvatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
                <div>
                    <p>{pt.name}</p>
                </div>
            </div>

            {/* message list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 max-sm:w-full max-md:w-[510px]">
                {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div
                            className={`px-3 py-2 rounded-lg max-w-[60%] max-md:max-w-[80%]
                            ${isMine 
                                ? "bg-gradient-to-r from-[#caa3f3] to-[#e4dbf6]" 
                                : "bg-gray-200 text-gray-800"
                            }`}
                            >
                            <p className="break-words">
                                {msg.content}
                            </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef}></div>
                {isTyping && (
                <div className="flex items-center gap-1 ml-2">
                    <p className="text-sm text-gray-500 mr-2">{pt.name} Đang gõ</p>
                    <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay animation-delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay animation-delay-300"></span>
                    </div>
                </div>
                )}
            </div>
            {/* input */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
    
                <input
                    type="text"
                    value={text}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-4 py-2 
                            focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button 
                onClick={
                    () => {
                        if(canSendMessage) {
                            handleSend();
                        }
                        else {
                            setOpenNoPermission(true);
                        }
                    }
                }
                className="p-2 rounded-lg hover:bg-purple-100 transition">
                    <SendHorizonalIcon className="text-fuchsia-500 w-5 h-5"/>
                </button>

            </div>

        </div>
            <NoPermissionModal
            open={openNoPermission}
            onClose={() => setOpenNoPermission(false)}
            />
        </>
    );
}