import { Outlet } from "react-router-dom";

export default function DefaultPT() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
