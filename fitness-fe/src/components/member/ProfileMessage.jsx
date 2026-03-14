import { useEffect, useRef, useState } from "react";
import echo from "@/lib/echo";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { SendHorizonalIcon } from "lucide-react";
import { getMe } from "@/services/admin/PersonalTrainerService";
import { getMessages, sendMessage } from "@/services/admin/Message";

export default function ProfileMessage({ pt }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const bottomRef = useRef(null);

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
    if (!userId || !pt) return;

    const channel = echo.private(`chat.${userId}`);

    channel.listen(".MessageSent", (e) => {
      const msg = e.message;

      if (msg.sender_id !== pt.id && msg.receiver_id !== pt.id) return;

      setMessages((prev) => {
        const exists = prev.find((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      echo.leave(`chat.${userId}`);
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

  if (!pt) return null;

  return (
    <div className="h-[800px] flex flex-col border rounded-lg bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-b">
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
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          className="p-2 rounded-lg hover:bg-blue-100 transition"
        >
          <SendHorizonalIcon className="w-5 h-5 text-blue-500" />
        </button>
      </div>
    </div>
  );
}
