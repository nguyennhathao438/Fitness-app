import "./App.css";
import router from "./routers";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { login } from "./storages/authSlice.js";
import { getMyInfo } from "./services/member/MemberService.js";
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
      }
      if (token != null && token != "") {
        try {
          const response = await getMyInfo();
          console.log(response);
          dispatch(login(response.data));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);
  if (loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen text-lg font-semibold text-gray-700">
          {/* Vòng tròn xoay */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Đang tải trang...</p>
        </div>
      </>
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
