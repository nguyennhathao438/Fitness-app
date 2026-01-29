import { createBrowserRouter } from "react-router-dom";
import DefaultMember from "./layouts/DefaultMember";
import Home from "./pages/member/Home";
import PricingPackages from "./pages/member/PricingPackage";
import RegisterPage from "./pages/member/RegisterPage";
import Login from "./pages/member/Login";
import ForgotPassword from "./pages/member/ForgotPasswod";
import Profile from "./pages/member/Profile";
import BodyMetric from "./pages/member/BodyMetric";
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
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);
export default router;
