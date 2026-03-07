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
import Invoice from "./pages/Admin/Invoice";
import Package from "./pages/Admin/package";
import UpgradePackagePage from "./pages/member/UpgradePackagePage"; 
import UpgradePaymentPage from "./pages/member/UpgradePaymentPage"; 
import ListMemberOfPT from "./pages/PT/ListMemberOfPT";
import CreateSchedulePT from "./pages/PT/CreateSchedule";

import DefaultPT from "./layouts/DefaultPT";
import ScheduleDashboardPT from "./pages/PT/ScheduleDashboard";
import PTRegisterPage from "./pages/MemberSchedule/MemberRegisterPage";
import MySchedulePage from "./pages/MemberSchedule/MySchedulePage";
import Notifications from "./pages/member/Notifications";
import MemberDetail from "./pages/PT/MemberDetail";
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
      {
        path: "/profile",
        element: <Profile />,
      },
      {
  path: "/member/pt-register",
  element: <PTRegisterPage />,
},
{
  path: "/member/my-schedules",
  element: <MySchedulePage />,
},
{
  path: "/notifications",
  element: <Notifications  />,
},
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
      {
        path: "order",
        element: <Invoice />,
      },
      {
        path: "packages",
        element: <Package />,
      },
    ],
  },
   {
    path: "/pt",
    element: <DefaultPT />,
    children: [
      { index: true, element: <ListMemberOfPT /> },
      { path: "schedules", element: <ScheduleDashboardPT /> },

      { path: "schedules/create", element: <CreateSchedulePT /> },

      {
  path: "/pt/members/:id",
  element: <MemberDetail />
}
    //   { path: "schedules/:scheduleId/members", element: <ScheduleMembersPT /> },
    ],
  },
]);
export default router;
