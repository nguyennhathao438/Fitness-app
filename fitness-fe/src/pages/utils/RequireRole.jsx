import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequirePermission({ role, children }) {
  const roles = useSelector((state) => state.auth.roles);
  const user = useSelector((state) => state.auth.member);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(role)) {
    return <Navigate to="/no-permission" replace />;
  }

  return children;
}
