import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const RoleModuleContext = createContext();

const RoleModuleProvider = ({ children }) => {
    const [roleModules, setRoleModules] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
    if (!token) return; 
        fetchRoleModules();
    }, []);

    const fetchRoleModules = async () => {
        try {
            const response = await API.get("/role-modules");
            setRoleModules(response.data);
        } catch (error) {
            console.error("Error fetching role-modules:", error);
        }
    };

    const assignModuleToRole = async (roleId, moduleId, permission) => {
        try {
            await API.post("/role-modules/assign", {
                role_id: roleId,
                module_id: moduleId,
                permission,
            });
            await fetchRoleModules(); // ✅ Fetch updated role-modules
        } catch (error) {
            console.error("Error assigning module to role:", error);
        }
    };
    
    const removeModuleFromRole = async (roleId, moduleId) => {
        try {
            await API.delete(`/role-modules/${roleId}/${moduleId}`);
            await fetchRoleModules(); // ✅ Fetch updated role-modules
        } catch (error) {
            console.error("Error removing module from role:", error);
        }
    };
    

    return (
        <RoleModuleContext.Provider value={{ roleModules, fetchRoleModules, assignModuleToRole, removeModuleFromRole }}>
            {children}
        </RoleModuleContext.Provider>
    );
};

export default RoleModuleProvider;
