import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireGuest({ children }) {
  const user = useSelector((state) => state.auth.member);
  const roles = useSelector((state) => state.auth.roles);
  // đã login → không cho vào login
  if (user) {
    console.log("My roles: ", roles);
    if (roles.some((r) => r.toLowerCase() === "admin")) {
      return <Navigate to="/admin/" replace />;
    }

    if (roles.includes("PT")) {
      return <Navigate to="/pt" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}
