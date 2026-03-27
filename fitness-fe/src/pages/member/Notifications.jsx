import { useEffect, useState } from "react";
import { Bell, CheckCheck, Clock, ChevronRight } from "lucide-react";
import { notificationService } from "../../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      let list = [];

      // Logic preserved exactly as original
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      }

      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (notif) => {
    try {
      if (notif.is_read === 0) {
        await notificationService.markAsRead(notif.id);
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  const formatTime = (time) => {
    return new Date(time).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    // GLOBAL PAGE LAYOUT
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DESIGN SYSTEM */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-purple-600" />
              Notifications
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Stay updated with your latest activities and alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 rounded-xl px-5 py-3 font-semibold hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </header>

        {/* CONTENT SECTION (CARD DESIGN SYSTEM) */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const isUnread = notif.is_read === 0;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkRead(notif)}
                    className={`group flex items-center gap-4 px-6 md:px-8 py-6 cursor-pointer transition-all duration-200 
                      ${isUnread ? "bg-purple-50/40 hover:bg-purple-50" : "hover:bg-slate-50"}`}
                  >
                    {/* Status Indicator */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-colors
                        ${isUnread ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      {isUnread && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Notification Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-base md:text-lg truncate ${isUnread ? "font-bold text-slate-900" : "text-slate-600"}`}>
                          {notif.message || "New activity notification"}
                        </p>
                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isUnread ? "text-purple-400" : "text-slate-300"}`} />
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">
                          {formatTime(notif.created_at)}
                        </span>
                        {isUnread && (
                          <span className="ml-2 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE SYSTEM */
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox is clear!</h3>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">
                You don't have any notifications at the moment. Check back later.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}