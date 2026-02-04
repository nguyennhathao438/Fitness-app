import { createBrowserRouter } from "react-router-dom";
import DefaultMember from "./layouts/DefaultMember";
import Home from "./pages/member/Home";
import PricingPackages from "./pages/member/PricingPackage";
import RegisterPage from "./pages/member/RegisterPage";
import Login from "./pages/member/Login";
import ForgotPassword from "./pages/member/ForgotPasswod";
import Profile from "./pages/member/Profile";
import BodyMetric from "./pages/member/BodyMetric";
import DefaultAdmin from "./layouts/DefaultAdmin";
import User from "./pages/Admin/User";
import Dashboard from "./pages/Admin/Dashboard";
import RoleManagement from "./pages/admin/Role";
import WaitingForRegister from "./pages/member/WaitingForRegister";
import Exercise from "./pages/Admin/Exercise";
import MuscleGroup from "./pages/Admin/MuscleGroup";
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
        path: "/bmi",
        element: <BodyMetric />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/waiting",
        element: <WaitingForRegister />,
      },
      { path: "/profile", element: <Profile /> },
    ],
  },
  {
    path: "/admin",
    element: <DefaultAdmin />,
    children: [
      {
        path: "",
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
        path: "exercise",
        element: <Exercise />,
      },
      {
        path: "muscle",
        element: <MuscleGroup />,
      },
    ],
  },
]);
export default router;
