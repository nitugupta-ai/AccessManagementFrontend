import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api"; 
import Users from "./Users";
import Roles from "./Roles";
import Modules from "./Modules";
import "./Dashboard.css"; // Import CSS
import RolesModules from "./RolesModules";

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
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

    // ✅ Fetch modules assigned to the logged-in role
    const fetchRoleModules = async () => {
        try {
            const { data } = await API.get(`/role-modules/${role}`);
            const moduleNames = data.map(({ module_name }) => module_name);
            setAccessibleModules(moduleNames);
        } catch (error) {
            toast.error("Failed to load module access.");
            console.error(error);
        }
    };

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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

                {/*  Manage Users Section (Only for Admin) */}
                {role === "admin" && (
                    <div className="dashboard-section">
                        <Users />
                    </div>
                )}

                {/* Manage Roles Section */}
                {(role === "admin" || accessibleModules.includes("Roles")) && (
                    <div className="dashboard-section">
                        <Roles />
                    </div>
                )}

                {/*  Manage Modules Section */}
                {(role === "admin" || accessibleModules.includes("Modules")) && (
                    <div className="dashboard-section">
                        <Modules />
                    </div>
                )}

                <RolesModules />

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
