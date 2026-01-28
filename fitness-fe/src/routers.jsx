import { createBrowserRouter } from "react-router-dom";

/* ========= LAYOUT ========= */
import DefaultMember from "./layouts/DefaultMember";
import DefaultPT from "./layouts/DefaultPT";

/* ========= MEMBER PAGES ========= */
import Home from "./pages/member/Home";
import PricingPackages from "./pages/member/PricingPackage";
import RegisterPage from "./pages/member/RegisterPage";
import PTSchedules from "./pages/member/pt-schedules";
import MySchedules from "./pages/member/my-schedules";

/* ========= PT PAGES ========= */
import ListMemberOfPT from "./pages/PT/ListMemberOfPT";
import ScheduleDashboardPT from "./pages/PT/ScheduleDashboard";
import CreateSchedulePT from "./pages/PT/CreateSchedule";
import ScheduleMembersPT from "./pages/PT/ScheduleMembers";

const router = createBrowserRouter([
  /* ================= MEMBER ================= */
  {
    path: "/",
    element: <DefaultMember />,
    children: [
      { index: true, element: <Home /> },
      { path: "pricing-packages", element: <PricingPackages /> },
      { path: "register/:packageId", element: <RegisterPage /> },

      // Member xem lịch PT
      { path: "member/pt/:ptId", element: <PTSchedules /> },

      // Member xem lịch đã book
      { path: "member/my-schedules", element: <MySchedules /> },
    ],
  },

  /* ================= PT ================= */
  {
    path: "/pt/:ptId",
    element: <DefaultPT />,
    children: [
      { index: true, element: <ListMemberOfPT /> },

      { path: "schedules", element: <ScheduleDashboardPT /> },
      { path: "schedules/create", element: <CreateSchedulePT /> },
      {
        path: "schedules/:scheduleId/members",
        element: <ScheduleMembersPT />,
      },
    ],
  },
]);

export default router;
