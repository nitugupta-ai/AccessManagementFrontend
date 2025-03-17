import { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

export const ModuleContext = createContext();

const ModuleProvider = ({ children }) => {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await API.get("/modules");
            console.log("✅ Raw Modules from API:", response.data);
    
            // Transform response if needed
            const formattedModules = response.data.map((mod) => ({
                module_id: mod.id,  // Ensure correct field names
                module_name: mod.name
            }));
    
            console.log("🚀 Transformed Modules:", formattedModules);
            setModules(formattedModules);
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModules([]);
        }
    };
    
    

    const addModule = async (moduleName, description) => {
        try {
            await API.post("/modules", {
                module_name: moduleName,
                description,
            });
            await fetchModules(); // ✅ Fetch updated modules after adding
            toast.success("Module added successfully");
        } catch (error) {
            toast.error("Failed to add module");
        }
    };

    const deleteModule = async (moduleId) => {
        try {
            await API.delete(`/modules/${moduleId}`);
            await fetchModules(); // ✅ Fetch updated modules after deletion
            toast.success("Module deleted successfully");
        } catch (error) {
            toast.error("Failed to delete module");
        }
    };

    return (
        <ModuleContext.Provider value={{ modules, fetchModules, addModule, deleteModule }}>
            {children}
        </ModuleContext.Provider>
    );
};

export default ModuleProvider;
