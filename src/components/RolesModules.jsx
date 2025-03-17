import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { RoleContext } from "../context/RoleContext";
import { ModuleContext } from "../context/ModuleContext";
import { RoleModuleContext } from "../context/RoleModulesContext";
import "./RolesModules.css";

const RolesModules = () => {
    const { roles, fetchRoles } = useContext(RoleContext);  // ✅ Get roles from context
    const { modules, fetchModules } = useContext(ModuleContext); // ✅ Get modules from context
    const { roleModules, fetchRoleModules } = useContext(RoleModuleContext);

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedPermission, setSelectedPermission] = useState("read");

    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchRoles(); // ✅ Ensure latest roles
        fetchModules(); // ✅ Ensure latest modules
        fetchRoleModules(); // ✅ Ensure latest role-module assignments
        console.log("Modules from context:", modules); // ✅ Debugging
    }, []);

    const handleAssignModule = async () => {
        if (!selectedRole || !selectedModule) {
            toast.error("Role and Module must be selected");
            return;
        }

        const requestData = {
            role_id: Number(selectedRole),
            module_ids: [Number(selectedModule)],
            permission: selectedPermission,
        };

        try {
            await API.post("/role-modules/assign", requestData);
            toast.success("Module assigned successfully");
            fetchRoleModules(); // ✅ Fetch updated role-module data
        } catch (error) {
            toast.error("Failed to assign module");
            console.error("Error assigning module:", error.response?.data || error.message);
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
                        {modules.length > 0 ? (
                            modules.map((m) => (
                                <option key={m.module_id} value={m.module_id}>{m.module_name}</option>
                            ))
                        ) : (
                            <option disabled>No modules available</option>
                        )}
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
                    {roleModules.length > 0 ? (
                        roleModules.map((rm, index) => (
                            <tr key={index}>
                                <td>{rm.role_name}</td>
                                <td>{rm.module_name}</td>
                                <td>{rm.permission}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No modules assigned</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RolesModules;
