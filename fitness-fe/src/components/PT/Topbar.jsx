import NotificationBell from "./NotificationBell";

export default function Topbar() {
  return (
    <div className="h-16 flex items-center justify-end px-6 bg-white shadow">
      <NotificationBell />
    </div>
  );
}