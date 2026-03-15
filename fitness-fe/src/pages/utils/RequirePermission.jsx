import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequirePermission({ permission, children }) {
  const permissions = useSelector((state) => state.auth.permissions);

  if (!permissions.includes(permission)) {
    return <Navigate to="/no-permission" replace />;
  }

  return children;
}
