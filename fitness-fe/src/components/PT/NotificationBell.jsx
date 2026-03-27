import { useEffect, useState } from "react";
import { Bell, BellDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";

export default function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {

    try {

      const data = await notificationService.getNotifications();

      let list = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      }

      // newest first
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setNotifications(list);

    } catch (err) {
      console.error("Notification error:", err);
    }

  };

  useEffect(() => {

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);

  }, []);

  // unread notifications
  const unreadNotifications = notifications.filter(
    (n) => n.is_read === 0
  );

  const unreadCount = unreadNotifications.length;

  // format time
  const formatTime = (time) => {
    return new Date(time).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // click notification
  const handleNotificationClick = async (notif) => {

    try {

      if (notif.is_read === 0) {
        await notificationService.markAsRead(notif.id);
      }

      fetchNotifications();
      setIsOpen(false);

    } catch (err) {
      console.error(err);
    }

  };

  // mark all read
  const handleMarkAll = async () => {

    try {

      await notificationService.markAllRead();
      fetchNotifications();

    } catch (err) {
      console.error(err);
    }

  };

  return (
    <div className="relative inline-block">

      {/* Bell button */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-95 group"
      >

        {unreadCount > 0 ? (
          <BellDot className="w-6 h-6 text-purple-600 animate-pulse" />
        ) : (
          <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

      </button>

      {isOpen && (
        <>

          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-80 z-50 overflow-hidden bg-white rounded-[24px] shadow-xl shadow-slate-200/60 border border-slate-200">

            {/* Header */}

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">

              <h3 className="font-bold text-slate-900">
                Notifications
              </h3>

              <div className="flex items-center gap-2">

                <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-600 rounded-lg">
                  {unreadCount} New
                </span>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAll}
                    className="text-xs text-purple-600 font-semibold hover:underline"
                  >
                    Mark all
                  </button>
                )}

              </div>

            </div>

            {/* List */}

            <div className="max-h-[400px] overflow-y-auto">

              {notifications.length > 0 ? (

                notifications.map((notif) => {

                  const isUnread = notif.is_read === 0;

                  return (

                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`px-6 py-4 border-b border-slate-50 transition-colors cursor-pointer
                      ${isUnread
                          ? "bg-purple-50 hover:bg-purple-100"
                          : "bg-white hover:bg-slate-50"
                        }`}
                    >

                      <div className="flex gap-3">

                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            isUnread
                              ? "bg-purple-600"
                              : "bg-slate-300"
                          }`}
                        />

                        <div>

                          <p
                            className={`text-sm leading-snug ${
                              isUnread
                                ? "text-slate-900 font-semibold"
                                : "text-slate-500"
                            }`}
                          >
                            {notif.message || "New activity"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            {formatTime(notif.created_at)}
                          </p>

                        </div>

                      </div>

                    </div>

                  );

                })

              ) : (

                <div className="text-center py-12 px-6">

                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-slate-300" />
                  </div>

                  <p className="text-slate-500 font-medium">
                    No notifications yet
                  </p>

                </div>

              )}

            </div>

            {/* Footer */}

            <div className="p-3 bg-slate-50 border-t border-slate-100">

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/notifications");
                }}
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
              >
                View all activity
              </button>

            </div>

          </div>

        </>
      )}

    </div>
  );
}