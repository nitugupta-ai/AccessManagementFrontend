import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Roles.css"; // Import the CSS file

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState("");
    const [editingRole, setEditingRole] = useState(null);
    const role = localStorage.getItem("role");
    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await API.get("/roles");
            if (!Array.isArray(response.data)) {
                throw new Error("Invalid response format");
            }
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error.response?.data || error.message);
            toast.error("Failed to fetch roles");
        }
    };

    const handleCreateRole = async () => {
        if (!roleName.trim()) {
            toast.error("Role name is required");
            return;
        }
        try {
            const response = await API.post("/roles", { name: roleName, created_by: userId });
            setRoles([...roles, response.data]);
            setRoleName("");
            toast.success("Role created successfully");
        } catch (error) {
            console.error("Error creating role:", error.response?.data || error.message);
            toast.error("Failed to create role");
        }
    };

    const handleEditRole = (role) => {
        setEditingRole(role);
        setRoleName(role.name);
    };

    const handleUpdateRole = async () => {
        if (!editingRole || !roleName.trim()) return;
        try {
            await API.put(`/roles/${editingRole.id}`, { name: roleName });
            setRoles(roles.map(r => (r.id === editingRole.id ? { ...r, name: roleName } : r)));
            setEditingRole(null);
            setRoleName("");
            toast.success("Role updated successfully");
        } catch (error) {
            console.error("Error updating role:", error.response?.data || error.message);
            toast.error("Failed to update role");
        }
    };

    const handleDeleteRole = async (id) => {
        try {
            await API.delete(`/roles/${id}`);
            setRoles(roles.filter(role => role.id !== id));
            toast.success("Role deleted successfully");
        } catch (error) {
            console.error("Error deleting role:", error.response?.data || error.message);
            toast.error("Failed to delete role");
        }
    };

    return (
        <div className="roles-container">
            <h2>Role Management</h2>

            {/* Role Input Form */}
            <div className="input-container">
                <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter Role Name"
                    className="role-input"
                />
                {editingRole ? (
                    <button onClick={handleUpdateRole} className="update-btn">Update Role</button>
                ) : (
                    <button onClick={handleCreateRole} className="create-btn">Create Role</button>
                )}
            </div>

            {/* Roles Table */}
            <div className="table-container">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={`role-${role.id}`}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td>
                                    {role.created_by === userId || localStorage.getItem("role") === "admin" ? (
                                        <>
                                            <button onClick={() => handleEditRole(role)} className="edit-btn">Edit</button>
                                            <button onClick={() => handleDeleteRole(role.id)} className="delete-btn">Delete</button>
                                        </>
                                    ) : (
                                        <span className="no-actions">No Actions</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Roles;
