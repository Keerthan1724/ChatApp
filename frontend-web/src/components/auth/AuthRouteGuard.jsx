import { Navigate, useLocation } from "react-router-dom";
import { canAccessRoute, getFallbackRoute } from "@/utils/flowGuard";
import useChat from "@/hooks/useChat";

const protectedRoutes = [
  "/chat",
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
  const { isHydrated } = useChat();
  
  const token =
    sessionStorage.getItem("access") ||
    localStorage.getItem("access");

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (token) {
    const authFlowPaths = [
      "/login", 
      "/create-account", 
      "/profile-setup", 
      "/verify-email", 
      "/verify-email-otp", 
      "/email-verification-success", 
      "/review-info", 
      "/registration-success"
    ];

    if (authFlowPaths.includes(location.pathname)) {
      return <Navigate to="/chat" replace />;
    }
  }

  const isProtected = protectedRoutes.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );

  if (!isProtected) return children;

  if (location.pathname.startsWith("/chat") && !token) {
    return <Navigate to="/login" replace />;
  }

  if (token && location.pathname.startsWith("/chat")) {
    return children;
  }

  if (canAccessRoute(location.pathname)) return children;

  return <Navigate to={getFallbackRoute(location.pathname)} replace />;
}