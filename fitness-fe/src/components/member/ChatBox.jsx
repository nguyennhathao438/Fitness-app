import { useState, useRef, useEffect } from "react";
import { X, Send, User } from "lucide-react";
import { sendMessageToChatbot } from "../../services/member/ChatbotService.js";
import botImg from "../../assets/chatbot.png";
import botVideo from "../../assets/chatbot.mp4";

const BotAvatarPng = ({ className = "w-12 h-12" }) => (
  <div
    className={`${className} rounded-full overflow-hidden bg-purple-100 border-2 border-purple-200 flex items-center justify-center shrink-0 shadow-sm`}
  >
    <img src={botImg} alt="Bot Static" className="w-full h-full object-cover" />
  </div>
);

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! 👋 Cảm ơn bạn đã quan tâm đến phòng tập của chúng tôi. Bạn cần tư vấn về gói tập hay dịch vụ nào ạ?",
      sender: "bot",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotThinking]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userMessage, sender: "user" },
    ]);

    setInputText("");
    setIsBotThinking(true);

    try {
      const response = await sendMessageToChatbot({ question: userMessage });

      const fullResponse = response.data.answer; // lấy từ API
      console.log(response.data);
      const botMessageId = Date.now();

      setIsBotThinking(false);

      setMessages((prev) => [
        ...prev,
        { id: botMessageId, text: "", sender: "bot" },
      ]);

      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: fullResponse.slice(0, currentIndex + 1) }
              : msg,
          ),
        );

        currentIndex++;

        if (currentIndex === fullResponse.length) {
          clearInterval(typingInterval);
        }
      }, 30);
    } catch (error) {
      setIsBotThinking(false);
      console.log(error.messages || "Lỗi khi gửi tin nhắn đến chatbot");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Xin lỗi, hệ thống đang gặp lỗi.",
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* NÚT MỞ CHATBOX BÊN NGOÀI */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative group border-4 border-[#474274] w-24 h-24 overflow-hidden"
        >
          <video
            src={botVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-full"
          />
        </button>
      )}

      {/* KHUNG CHAT BÊN TRONG */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[600px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4 text-white flex justify-between items-center shadow-md z-10 shrink-0">
            <div className="flex items-center gap-3">
              <BotAvatarPng className="w-16 h-16" />
              <div>
                <h3 className="font-bold text-lg text-white m-0">
                  Hỗ trợ trực tuyến
                </h3>
                <p className="text-sm text-purple-100 flex items-center gap-1 m-0 mt-0.5">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                  Đang hoạt động
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : ""}`}
              >
                {msg.sender === "bot" && <BotAvatarPng className="w-12 h-12" />}

                <div
                  className={`p-3.5 rounded-2xl text-[15px] shadow-sm ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isBotThinking && (
              <div className="flex items-end gap-2 max-w-[85%]">
                <BotAvatarPng className="w-12 h-12" />

                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1.5 items-center h-[48px]">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 pl-4 pr-1 overflow-hidden">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent text-[15px] focus:outline-none text-gray-700 placeholder-gray-400 py-3 px-0 m-0 border-0"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-600 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-md shrink-0 m-0 p-0 border-0"
              >
                <Send size={20} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
