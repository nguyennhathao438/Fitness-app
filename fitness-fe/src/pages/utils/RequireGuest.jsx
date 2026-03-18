import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireGuest({ children }) {
  const user = useSelector((state) => state.auth.member);

  // đã login → không cho vào login
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
