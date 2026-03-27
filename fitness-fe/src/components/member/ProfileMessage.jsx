import { useEffect, useRef, useState } from "react";
import { getEcho } from "@/lib/echo";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { SendHorizonalIcon } from "lucide-react";
import { getMe } from "@/services/admin/PersonalTrainerService";
import { getMessages, sendMessage, sendTyping } from "@/services/admin/Message";
import { useSelector } from "react-redux";
import NoPermissionModal from "../utils/NoPermissionModel";

export default function ProfileMessage({ pt }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const bottomRef = useRef(null);
  const permissions = useSelector((state) => state.auth.permissions);
  const [openNoPermission, setOpenNoPermission] = useState(false);
  const canCreatePermission = permissions.includes("message_user.create");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);

    if (!typingTimeoutRef.current) sendTyping(pt.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(pt.id, false);
      typingTimeoutRef.current = null;
    }, 1500);
  };
  // lấy user hiện tại
  useEffect(() => {
    const fetchMe = async () => {
      const res = await getMe();
      setUserId(res.data.id);
    };

    fetchMe();
  }, []);

  // load message
  useEffect(() => {
    if (!pt) return;
    const fetchMessages = async () => {
      const res = await getMessages(pt.id);
      setMessages(res.data);
    };
    fetchMessages();
  }, [pt]);

  // realtime
  useEffect(() => {
  const echo = getEcho();
  if (!userId || !pt) return;

  const channel = echo.private(`chat.${userId}`);

  // Listener tin nhắn mới
  const messageListener = (e) => {
    const msg = e.message;
    if (msg.sender_id !== pt.id && msg.receiver_id !== pt.id) return;

    setMessages((prev) => {
      const exists = prev.find((m) => m.id === msg.id);
      if (exists) return prev;
      return [...prev, msg];
    });
  };

  // Listener typing
  const typingListener = (e) => {
    if (e.senderId !== pt.id) return;
    setIsTyping(e.isTyping);
  };

  // Đăng ký
  channel.listen(".MessageSent", messageListener);
  channel.listen(".TypingEvent", typingListener);

  // Cleanup khi unmount / userId hoặc pt thay đổi
  return () => {
    channel.stopListening(".MessageSent", messageListener);
    channel.stopListening(".TypingEvent", typingListener);
    echo.leave(`private-chat.${userId}`);
  };
}, [userId, pt]);

  // send message
  const handleSend = async () => {
    if (!text.trim()) return;

    const res = await sendMessage(pt.id, text);

    setMessages((prev) => [...prev, res.data.message]);

    setText("");
  };

  // auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (messages.length === 0) return;

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);
// clean timeout
 useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);
  if (!pt) return null;

  return (
    <>
    <div className="h-full flex flex-col border rounded-lg bg-white">
      {/* HEADER */}
      <div className="flex bg-gradient-to-r from-purple-50 via-pink-50 items-center gap-3 p-4 border-b">
        <img
          src={pt.avatar || defaultAvatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="font-semibold text-gray-700">{pt.name}</span>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isMine = msg.sender_id === userId;

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[60%] break-words
                ${
                  isMine
                    ? "bg-gradient-to-r from-[#caa3f3] to-[#e4dbf6]"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
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

      {/* INPUT */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />

        <button
          onClick={() => {
            if (canCreatePermission) {
              handleSend();
            } else {
              setOpenNoPermission(true);
            }
          }
          }
          className="p-2 rounded-lg hover:bg-blue-100 transition"
        >
          <SendHorizonalIcon className="w-5 h-5 text-fuchsia-500" />
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
