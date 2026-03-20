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
import ListMemberOfPT from "./pages/PT/ListMemberOfPT";
import CreateSchedulePT from "./pages/PT/CreateSchedule";
import NoPermissionPage from "./pages/utils/NoPermissionPage";
import DefaultPT from "./layouts/DefaultPT";
import ScheduleDashboardPT from "./pages/PT/ScheduleDashboard";
import PTRegisterPage from "./pages/MemberSchedule/MemberRegisterPage";
import MySchedulePage from "./pages/MemberSchedule/MySchedulePage";
import Notifications from "./pages/member/Notifications";
import MemberDetail from "./pages/PT/MemberDetail";
import RequirePermission from "./pages/utils/RequirePermission";
import RequireRole from "./pages/utils/RequireRole";
import RequireGuest from "./pages/utils/RequireGuest";
import NotFound from "./components/member/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultMember />,
    children: [
      { index: true, element: <Home /> },
      { path: "pricing-packages", element: <PricingPackages /> },
      { path: "upgrade", element: <UpgradePackagePage /> },
      { path: "member/payment/:packageId", element: <UpgradePaymentPage /> },
      { path: "register/:packageId", element: <RegisterPage /> },
      { path: "bmi", element: <BodyMaxIndex /> },
      {
        path: "login",
        element: (
          <RequireGuest>
            <Login />
          </RequireGuest>
        ),
      },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "waiting", element: <WaitingForRegister /> },
      { path: "profile", element: <Profile /> },
      { path: "workout", element: <WorkoutPage /> },
      { path: "member/pt-register", element: <PTRegisterPage /> },
      { path: "member/my-schedules", element: <MySchedulePage /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },
  {
    path: "/no-permission",
    element: <NoPermissionPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/admin",
    element: (
      <RequireRole role="Admin">
        <DefaultAdmin />
      </RequireRole>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <RequirePermission permission="statistic.read">
            <Dashboard />
          </RequirePermission>
        ),
      },
      {
        path: "user",
        element: (
          <RequirePermission permission="user.read">
            <User />
          </RequirePermission>
        ),
      },
      {
        path: "role",
        element: (
          <RequirePermission permission="permission.read">
            <RoleManagement />
          </RequirePermission>
        ),
      },

      {
        path: "muscle",
        element: <MuscleGroup />,
      },
      {
        path: "order",
        element: (
          <RequirePermission permission="invoice.read">
            <Invoice />
          </RequirePermission>
        ),
      },
      {
        path: "packages",
        element: <Package />,
      },
      {
        path: "message",
        element: (
          <RequirePermission permission="message_admin.read">
            <Message />
          </RequirePermission>
        ),
      },
    ],
  },
  {
    path: "/pt",
    element: (
      <RequireRole role="PT">
        <DefaultPT />
      </RequireRole>
    ),
    children: [
      { index: true, element: <ListMemberOfPT /> },
      { path: "schedules", element: <ScheduleDashboardPT /> },

      { path: "schedules/create", element: <CreateSchedulePT /> },
      { path: "members/:id", element: <MemberDetail /> },
      {
        path: "exercise",
        element: <Exercise />,
      },
      {
        path: "message-pt",
        element: (
          <RequirePermission permission="message_pt.read">
            <MessagePT />
          </RequirePermission>
        ),
      },
      // { path: "schedules/:scheduleId/members", element: <ScheduleMembersPT /> },
    ],
  },
]);
export default router;
