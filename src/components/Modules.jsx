import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Modules.css"; // Import CSS file

const Modules = () => {
    const [modules, setModules] = useState([]);
    const [moduleName, setModuleName] = useState("");
    const [description, setDescription] = useState("");
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await API.get("/modules");
                setModules(response.data);
            } catch (error) {
                toast.error("Failed to fetch modules");
            }
        };
        fetchModules();
    }, []);

    const handleAddModule = async () => {
        if (!moduleName.trim()) {
            toast.error("Module name is required");
            return;
        }

        try {
            await API.post("/modules", { name: moduleName, description: description || "No description provided" });
            toast.success("Module added successfully");
            setModuleName("");
            setDescription("");
            const response = await API.get("/modules"); 
            setModules(response.data);
        } catch (error) {
            toast.error("Failed to add module");
        }
    };

    const handleDeleteModule = async (id) => {
        try {
            await API.delete(`/modules/${id}`);
            setModules(modules.filter((mod) => mod.id !== id));
            toast.success("Module deleted successfully");
        } catch (error) {
            toast.error("Failed to delete module");
        }
    };

    return (
        <div className="modules-container">
            <h2>Module Management</h2>
            {role === "admin" && (
                <div className="module-form">
                    <input
                        type="text"
                        placeholder="Module Name"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                        className="module-input"
                    />
                    <input
                        type="text"
                        placeholder="Module Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="module-input"
                    />
                    <button onClick={handleAddModule} className="add-btn">Add Module</button>
                </div>
            )}
            <div className="modules-list">
                <ul>
                    {modules.map((mod) => (
                        <li key={mod.id} className="module-item">
                            <span className="module-text">{mod.name} - {mod.description}</span>
                            {role === "admin" && (
                                <button onClick={() => handleDeleteModule(mod.id)} className="delete-btn">Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Modules;
