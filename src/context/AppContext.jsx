import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const AppContext = createContext(); // ✅ Create Context

export const AppProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [roleModules, setRoleModules] = useState([]);
    const [userModules, setUserModules] = useState([]);
    const [refresh, setRefresh] = useState(false); // ✅ Trigger UI updates

    // ✅ Function to refetch data
    const triggerRefresh = () => setRefresh(prev => !prev);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return; // 🚀 Stop API call if no token
        fetchRoles();
        fetchModules();
        fetchRoleModules();
    }, [refresh]); // ✅ Re-fetch data when refresh state changes

    // ✅ Fetch Roles
    const fetchRoles = async () => {
        try {
            const response = await API.get("/roles");
            setRoles(response.data);
        } catch (error) {
            toast.error("Error fetching roles");
        }
    };

    // ✅ Fetch Modules
    const fetchModules = async () => {
        try {
            const response = await API.get("/modules");
            setModules(response.data);
        } catch (error) {
            toast.error("Error fetching modules");
        }
    };

    // ✅ Fetch Role-Modules
    const fetchRoleModules = async () => {
        try {
            const response = await API.get("/role-modules");
            setRoleModules(response.data);
        } catch (error) {
            toast.error("Error fetching role modules");
        }
    };

    return (
        <AppContext.Provider value={{ roles, modules, roleModules, userModules, triggerRefresh }}>
            {children}
        </AppContext.Provider>
    );
};

// ✅ Correctly Export Custom Hook
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
