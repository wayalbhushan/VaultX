import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import API from "../utils/api";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    API.get("/user/me")
      .then(() => {
        if (isMounted) setIsAuthenticated(true);
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-green-400 font-mono">
        <p className="animate-pulse">Verifying secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
