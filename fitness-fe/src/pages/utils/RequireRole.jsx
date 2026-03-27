import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequirePermission({ role, children }) {
  const roles = useSelector((state) => state.auth.roles);
  console.log("User roles:", roles);
  if (!roles.includes(role)) {
    return <Navigate to="/no-permission" replace />;
  }

  return children;
}
