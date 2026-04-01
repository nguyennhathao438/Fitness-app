import { useEffect, useState } from "react";
import { Bell, BellDot, Trash2 } from "lucide-react";
import DeletedDialog from "./DeletedDialog";
import { deleteNotification, getNotifications } from "@/services/admin/Notifications";
import { getEcho } from "@/lib/echo";
import { notificationService } from "@/services/notificationService";
import { useNavigate } from "react-router-dom";

export default function Notification() {

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // load API
    const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
    } catch (err) {
      console.log(err);
    }
  };
    fetchNotifications();

    // realtime
  const echo = getEcho();
  if (!echo) return;
  echo.private("admin.notifications")
    .listen(".new.order.notification", (e) => {

      setNotifications(prev => [
        e.notification,
        ...prev
      ]);

    });

  return () => {
    echo.leave("admin.notifications");
  };
  }, []);

  // unread
  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  // format time
  const formatTime = (time) => {
    return new Date(time).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // mark read
  const handleClick = async (notif) => {
    try {
    // mark read
    if (!notif.is_read) {
      await notificationService.markAsRead(notif.id);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notif.id
          ? { ...n, is_read: 1 }
          : n
      )
    );
  }
    // chuyển trang theo type
    if (notif.type === "order") {

      navigate("/admin/order");

    }

    if (notif.type === "pt_assign") {

      navigate("/admin/user");

    }

  } catch (err) {console.log(err);}
  };

  // mở dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    try {
      await deleteNotification(deleteId);

      setNotifications(
        notifications.filter(n => n.id !== deleteId)
      );

      setOpenDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="relative inline-block">

      {/* Bell */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl border transition
        ${unreadCount > 0
          ? "border-purple-500 bg-purple-50 text-purple-600"
          : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >

        {unreadCount > 0 ? (
          <BellDot className="w-6 h-6 animate-pulse text-purple-600" />
        ) : (
          <Bell className="w-6 h-6" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center 
          rounded-full bg-red-500 text-[10px] font-bold text-white px-1 animate-bounce">
            {unreadCount}
          </span>
        )}

      </button>

      {isOpen && (

        <div className="absolute z-[9999] right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border">

          {/* Header */}

          <div className="px-4 py-3 border-b flex justify-between">
            <h3 className="font-bold">Notifications</h3>
            <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-lg font-medium">
              {unreadCount} New
            </span>
          </div>

          {/* List */}

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                Chưa có thông báo
              </div>
            ) : (
            notifications.map((notif) => {

              const isUnread = notif.is_read === 0;

              return (

                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b flex justify-between cursor-pointer
                  ${isUnread ? "bg-fuchsia-100" : "hover:bg-purple-50 transition duration-200"}`}
                >
                  {/* dot */}
                  <span
                    className={`mt-2 w-2 h-2 rounded-full
                      ${isUnread ? "bg-purple-600" : "bg-gray-300"}
                    `}
                  />
                  <div
                    onClick={() => handleClick(notif)}
                    className="flex-1 ml-3"
                  >
                    
                    <p className={isUnread ? "font-semibold" : "text-gray-500"}>
                      {notif.message}
                    </p>

                    <p className="text-xs text-gray-400">
                      {formatTime(notif.created_at)}
                    </p>

                  </div>

                  {/* delete */}

                  <button
                    onClick={() => handleDeleteClick(notif.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              );

              })
            )
          }

          </div>

        </div>

      )}

      {/* Delete Dialog */}

      <DeletedDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        name="notification"
      />

    </div>
  );
}