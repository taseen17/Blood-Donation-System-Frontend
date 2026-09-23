import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function ProtectedRoute({ roles }) {
    const { user, isAuthLoading } = useContext(AuthContext);
    const location = useLocation();

    if (isAuthLoading) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking your session...</div>;
    }
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
}
