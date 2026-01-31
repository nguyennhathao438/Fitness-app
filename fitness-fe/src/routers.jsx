import { createBrowserRouter } from "react-router-dom";
import DefaultMember from "./layouts/DefaultMember";
import Home from "./pages/member/Home";
import PricingPackages from "./pages/member/PricingPackage";
import RegisterPage from "./pages/member/RegisterPage";
import DefaultAdmin from "./layouts/DefaultAdmin";
import User from "./pages/Admin/User";
import Dashboard from "./pages/Admin/Dashboard";
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
    ],
  },
  {
    path: "/admin",
    element: <DefaultAdmin />,
    children: [
      {
        path: "",
        element: <Dashboard/>,
      },
      {
        path: "user",
        element: <User/>,
      },
    ],
  },
]);
export default router;
