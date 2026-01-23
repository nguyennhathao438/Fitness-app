import "./App.css";
import router from "./routers";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function App() {
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
