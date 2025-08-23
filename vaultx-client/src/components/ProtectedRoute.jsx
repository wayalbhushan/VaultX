import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("vaultxToken");
  const location = useLocation();

  // No token? Kick them to Get Started (you can change this route)
  if (!token) {
    return <Navigate to="/get-started" replace state={{ from: location }} />;
  }

  // Token exists? Render the protected branch
  return <Outlet />;
}
