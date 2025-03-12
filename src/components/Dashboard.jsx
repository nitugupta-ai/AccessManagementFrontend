import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import Users from "./Users";
import Roles from "./Roles";
import Modules from "./Modules";
import RolesModules from "./RolesModules";
import "./Dashboard.css"; // Import CSS

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId"); // Store user ID
    const [accessibleModules, setAccessibleModules] = useState([]);

    useEffect(() => {
        if (!token) {
            toast.warning("Please login to access the dashboard.");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } else {
            fetchRoleModules();
        }
    }, [token, navigate]);

    const fetchRoleModules = async () => {
        if (!role) return console.warn("Role is missing!");

        try {
            const response = await API.get(`/role-modules/${role}`);
            console.log("API Response:", response.data); // ✅ Debug Log

            const modulePermissions = response.data.reduce((acc, { module_name, permission }) => {
                acc[module_name] = permission;
                return acc;
            }, {});

            setAccessibleModules(modulePermissions);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            toast.error("Failed to load module access.");
        }
    };

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        toast.info("Logged out successfully!");
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2 className="dashboard-title">Dashboard</h2>
                <p className="dashboard-role">
                    Role: <span className="font-semibold">{role || "Guest"}</span>
                </p>

                <div className="dashboard-content">
                    {/* ✅ Admin Access - Full Control */}
                    {role === "admin" ? (
                        <>
                            <div className="dashboard-section">
                                <Users />
                            </div>
                            <div className="dashboard-section">
                                <Roles />
                            </div>
                            <div className="dashboard-section">
                                <Modules />
                            </div>
                            <div className="dashboard-section">
                                <RolesModules />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="dashboard-section">
                                <Roles userId={userId} />
                            </div>
                            {accessibleModules["Modules"] && (
                                <div className="dashboard-section">
                                    <Modules />
                                </div>
                            )}
                            {accessibleModules["RolesModules"] && (
                                <div className="dashboard-section">
                                    <RolesModules />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
