import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ requiredModule }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const accessibleModules = JSON.parse(localStorage.getItem("accessibleModules")) || {};

    if (!token) {
        // 🚀 Fix: Prevent admin self-delete from redirecting
        if (role === "admin") {
            toast.error("You cannot delete yourself as an admin!");
            return null; // ✅ Stay on the same page
        }
        toast.warning("Unauthorized! Please login.");
        return <Navigate to="/login" replace />;
    }

    if (requiredModule && !accessibleModules[requiredModule]) {
        toast.error("Forbidden! You do not have access.");
        return <Navigate to="/forbidden" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
