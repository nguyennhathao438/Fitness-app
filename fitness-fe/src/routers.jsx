import { createBrowserRouter } from "react-router-dom";
import DefaultMember from "./layouts/DefaultMember";
import Home from "./pages/member/Home";
import PricingPackages from "./pages/member/PricingPackage";
import RegisterPage from "./pages/member/RegisterPage";
import Login from "./pages/member/Login";
import ForgotPassword from "./pages/member/ForgotPasswod";
import DefaultAdmin from "./layouts/DefaultAdmin";
import User from "./pages/Admin/User";
import Dashboard from "./pages/Admin/Dashboard";
import RoleManagement from "./pages/admin/Role";
import Invoice from "./pages/Admin/Invoice";
import PageError from "./pages/Admin/PageError";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultMember />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/pricing-packages",
        element: <PricingPackages />,
      },
      {
        path: "/register/:packageId",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/admin",
    element: <DefaultAdmin />,
    children: [
      {
        path:"",
        element: <PageError/>
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "role",
        element: <RoleManagement />,
      },
      {
        path: "order",
        element: <Invoice/>
      }
    ],
  },
]);
export default router;
