import "./App.css";
import router from "./routers";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { login } from "./storages/authSlice.js";
import { getMyInfo } from "./services/member/MemberService.js";
import { initEcho } from "./lib/echo";
import introVideo from "./assets/intro.mp4";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const prevToken = useRef(null);

  // 1. CHỈ BẬT INTRO NẾU KHỚP CHÍNH XÁC 1 TRONG 3 TRANG NÀY
  const pathname = window.location.pathname;
  const isShowIntro = pathname === "/" || pathname === "/admin" || pathname === "/pt";

  useEffect(() => {
    const fetchUser = async () => {
      const startTime = Date.now();
      const token = localStorage.getItem("token");

      if (token != null && token !== "") {
        try {
          const response = await getMyInfo();
          dispatch(login(response.data));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      }

      const elapsedTime = Date.now() - startTime;
      
      // 2. LOGIC THỜI GIAN: Đúng 3 trang kia thì ép đợi 2000ms, trang khác đợi 0ms
      const minimumLoadingTime = isShowIntro ? 2000 : 0; 
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    };

    fetchUser();
  }, [dispatch, isShowIntro]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");

      // login hoặc đổi account
      if (token && token !== prevToken.current) {
        console.log("Token changed re-init Echo");
        initEcho(token);
        prevToken.current = token;
      }

      // logout
      if (!token && prevToken.current) {
        console.log("Logout disconnect WS");
        prevToken.current = null;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    //  NẾU ĐÚNG TRANG ĐƯỢC PHÉP -> HIỆN VIDEO
    if (isShowIntro) {
      return (
        <div className="flex items-center justify-center w-full h-screen bg-[#050505]">
          <video
            src={introVideo}
            autoPlay
            muted
            playsInline
            className="w-[50%] max-w-[200px] sm:max-w-[350px]"
          />
        </div>
      );
    }

    // 3CÁC TRANG CÒN LẠI HIỆN GIAO DIỆN LOADING CŨ 
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg font-semibold text-gray-700 bg-white">
        {/* Vòng tròn xoay */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Đang tải trang...</p>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;