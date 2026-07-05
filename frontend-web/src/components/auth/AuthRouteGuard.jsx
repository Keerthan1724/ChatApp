import { Navigate, useLocation } from "react-router-dom";
import { canAccessRoute, getFallbackRoute } from "@/utils/flowGuard";

const protectedRoutes = [
  "/profile-setup",
  "/verify-email",
  "/verify-email-otp",
  "/email-verification-success",
  "/review-info",
  "/registration-success",
  "/verify-otp",
  "/reset-password",
  "/reset-success",
];

export default function AuthRouteGuard({ children }) {
  const location = useLocation();

  const isProtected = protectedRoutes.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );

  if (!isProtected) return children;

  if (canAccessRoute(location.pathname)) return children;

  return <Navigate to={getFallbackRoute(location.pathname)} replace />;
}
