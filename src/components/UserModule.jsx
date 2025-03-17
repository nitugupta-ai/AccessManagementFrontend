import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

const UserModules = () => {
    const [modules, setModules] = useState([]);
    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        if (userId) {
            fetchUserModules();
        } else {
            toast.error("User ID not found. Please log in again.");
        }
    }, [userId]);

    const fetchUserModules = async () => {
        try {
            const response = await API.get(`/user-modules/${userId}`);
            console.log("✅ Modules API Response:", response.data);

            if (!Array.isArray(response.data)) {
                throw new Error("Invalid API response format");
            }

            setModules(response.data);
        } catch (error) {
            console.error("❌ API Error:", error);
            toast.error("Failed to fetch modules");
        }
    };

    return (
        <div>
            <h2>Modules</h2>
            {modules.length > 0 ? (
                <ul>
                    {modules.map((module, index) => (
                        <li key={`${module.id}-${index}`}>
                            <strong>{module.name || "Unknown Module"}</strong> 
                            - {module.description || "No description"}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No modules assigned to your roles.</p>
            )}
        </div>
    );
};

export default UserModules;
