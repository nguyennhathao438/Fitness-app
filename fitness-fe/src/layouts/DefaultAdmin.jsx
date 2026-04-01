import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/Admin/SideBar";
import { Toaster } from "react-hot-toast";
import HeaderBar from "@/components/Admin/Headerbar";

export default function DefaultAdmin() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCollapsed(true);   // mobile → auto thu
            } else {
                setCollapsed(false);  // desktop → mở
            }
        };

        handleResize(); // chạy lần đầu
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
        <div className="min-h-screen flex">
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <main  className={`transition-all duration-300
            ${collapsed ? "ml-24 w-[calc(100%-6rem)]" : "ml-64 w-[calc(100%-16rem)]"}
            `}>
                <HeaderBar/>
                <div className="p-1">
                    <Outlet />
                </div>
            </main>
        </div>
        <Toaster position="top-right" />
      {/* routes */}
    </>
    );
}
