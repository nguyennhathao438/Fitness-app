import { useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* NÚT MỞ CHATBOX (Khi đang đóng) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative group"
        >
          <MessageCircle size={28} />
          {/* Dấu chấm đỏ thông báo giả lập */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          
          {/* Tooltip nhỏ khi hover */}
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat với chúng tôi
          </span>
        </button>
      )}

      {/* KHUNG CHAT (Khi đang mở) */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[550px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Hỗ trợ trực tuyến</h3>
                <p className="text-xs text-purple-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Đang hoạt động
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body (Khu vực tin nhắn) */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300">
            
            {/* Tin nhắn của Bot/Admin */}
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-purple-600" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-bl-none text-sm text-gray-700 shadow-sm border border-gray-100">
                Xin chào! 👋 Cảm ơn bạn đã quan tâm đến phòng tập của chúng tôi. Bạn cần tư vấn về gói tập hay dịch vụ nào ạ?
              </div>
            </div>

            {/* Tin nhắn của Người dùng */}
            <div className="flex items-end gap-2 max-w-[85%] self-end flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <User size={16} className="text-gray-500" />
              </div>
              <div className="bg-purple-600 p-3 rounded-2xl rounded-br-none text-sm text-white shadow-sm">
                Cho mình hỏi giá gói tập 1 năm hiện tại là bao nhiêu? Có đang khuyến mãi gì không?
              </div>
            </div>

          </div>

          {/* Footer (Khu vực nhập tin nhắn) */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 pl-4 pr-1">
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..." 
                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400 py-2"
              />
              <button className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-md shrink-0">
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}