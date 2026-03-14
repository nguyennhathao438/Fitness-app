import { Outlet } from "react-router-dom";
import SideBar from "../components/PT/SideBar";
import Topbar from "../components/PT/Topbar";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function DefaultPT() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="min-h-screen flex">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main
          className={`transition-all duration-300
          ${
            collapsed
              ? "ml-24 w-[calc(100%-6rem)]"
              : "ml-64 w-[calc(100%-16rem)]"
          }`}
        >
          <Topbar />

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </>
  );
}