import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./RolesModules.css"; // Import CSS file

const RolesModules = () => {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [roleModules, setRoleModules] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedPermission, setSelectedPermission] = useState("read");

    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchRoles();
        fetchModules();
        fetchRoleModules();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await API.get("/roles");
            setRoles(response.data);
        } catch (error) {
            toast.error("Failed to fetch roles");
        }
    };

    const fetchModules = async () => {
        try {
            const response = await API.get("/modules");
            setModules(response.data);
        } catch (error) {
            toast.error("Failed to fetch modules");
        }
    };

    const fetchRoleModules = async () => {
        try {
            const response = await API.get("/role-modules");
            setRoleModules(response.data);
        } catch (error) {
            toast.error("Failed to fetch role-modules");
        }
    };

    const handleAssignModule = async () => {
        if (!selectedRole || !selectedModule) {
            toast.error("Role and Module must be selected");
            return;
        }

        try {
            await API.post("/role-modules", { 
                role_id: selectedRole, 
                module_id: selectedModule, 
                permission: selectedPermission 
            });
            toast.success("Module assigned to role successfully");
            fetchRoleModules();
        } catch (error) {
            toast.error("Failed to assign module");
        }
    };

    return (
        <div className="roles-modules-container">
            <h2>Role-Module Management</h2>
            {role === "admin" && (
                <div className="assignment-form">
                    <select onChange={(e) => setSelectedRole(e.target.value)} className="dropdown">
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <select onChange={(e) => setSelectedModule(e.target.value)} className="dropdown">
                        <option value="">Select Module</option>
                        {modules.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>

                    <select onChange={(e) => setSelectedPermission(e.target.value)} className="dropdown">
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                        <option value="delete">Delete</option>
                    </select>

                    <button onClick={handleAssignModule} className="assign-btn">Assign</button>
                </div>
            )}

            <h3>Assigned Modules</h3>
            <table className="role-modules-table">
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Module</th>
                        <th>Permission</th>
                    </tr>
                </thead>
                <tbody>
                    {roleModules.map((rm) => (
                        <tr key={`role-mod-${rm.id}`}>
                            <td>{rm.role_name}</td>
                            <td>{rm.module_name}</td>
                            <td>{rm.permission}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RolesModules;
