import { createBrowserRouter } from "react-router-dom";
import DefaultMember from "./layouts/DefaultMember";
import Home from "./pages/member/Home";
import PricingPackages from "./pages/member/PricingPackage";
import RegisterPage from "./pages/member/RegisterPage";
import Login from "./pages/member/Login";
import ForgotPassword from "./pages/member/ForgotPasswod";
import Profile from "./pages/member/Profile";
import DefaultAdmin from "./layouts/DefaultAdmin";
import User from "./pages/Admin/User";
import Dashboard from "./pages/Admin/Dashboard";
import RoleManagement from "./pages/admin/Role";
import WaitingForRegister from "./pages/member/WaitingForRegister";
import Exercise from "./pages/Admin/Exercise";
import MuscleGroup from "./pages/Admin/MuscleGroup";
import Invoice from "./pages/Admin/Invoice";
import Package from "./pages/Admin/package";
import UpgradePackagePage from "./pages/member/UpgradePackagePage";
import UpgradePaymentPage from "./pages/member/UpgradePaymentPage";
import WorkoutPage from "./pages/member/WorkoutPage";
import BodyMaxIndex from "./pages/member/BodyMaxIndex";
import Message from "./pages/Admin/Message";
import MessagePT from "./pages/Admin/MessagePT";
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
        path: "/upgrade",
        element: <UpgradePackagePage />,
      },
      {
        path: "/member/payment/:packageId",
        element: <UpgradePaymentPage />,
      },
      {
        path: "/register/:packageId",
        element: <RegisterPage />,
      },
      {
        path: "/bmi",
        element: <BodyMaxIndex />,
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
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/workout",
        element: <WorkoutPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <DefaultAdmin />,
    children: [
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
        path: "exercise",
        element: <Exercise />,
      },
      {
        path: "muscle",
        element: <MuscleGroup />,
      },
      {
        path: "order",
        element: <Invoice />,
      },
      {
        path: "packages",
        element: <Package />,
      },
      {
        path: "message",
        element: <Message />,
      },
      {
        path: "message-pt",
        element: <MessagePT />,
      },
    ],
  },
]);
export default router;
