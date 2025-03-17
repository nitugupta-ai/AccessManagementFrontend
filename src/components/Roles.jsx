import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { RoleContext } from "../context/RoleContext";
import "./Roles.css";

const Roles = () => {
    const { roles, addRole, updateRole, deleteRole } = useContext(RoleContext);
    const [roleName, setRoleName] = useState("");
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editedRoleName, setEditedRoleName] = useState("");

    const userId = Number(localStorage.getItem("userId"));
    const userRole = localStorage.getItem("role");

    useEffect(() => {
        // No need to fetch roles here since RoleContext handles it
    }, []);

    const handleCreateRole = () => {
        if (!roleName.trim()) {
            toast.error("Role name is required");
            return;
        }
        addRole(roleName, userId);
        setRoleName("");
    };

    const handleUpdateRole = (roleId) => {
        if (!editedRoleName.trim()) {
            toast.error("Role name cannot be empty");
            return;
        }
        updateRole(roleId, editedRoleName);
        setEditingRoleId(null);
        setEditedRoleName("");
    };

    const handleDeleteRole = (roleId, createdBy) => {
        if (userRole !== "admin" && createdBy !== userId) {
            toast.error("You can only delete roles you created!");
            return;
        }
        deleteRole(roleId);
    };

    return (
        <div className="roles-container">
            <h2>Role Management</h2>
            <div className="input-container">
                <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter Role Name"
                    className="role-input"
                />
                <button onClick={handleCreateRole} className="create-btn">
                    Create Role
                </button>
            </div>

            <div className="table-container">
                <h2>All Roles</h2>
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>
                                    {editingRoleId === role.id ? (
                                        <input
                                            type="text"
                                            value={editedRoleName}
                                            onChange={(e) => setEditedRoleName(e.target.value)}
                                        />
                                    ) : (
                                        role.name
                                    )}
                                </td>
                                <td>{role.created_by}</td>
                                <td>
                                    {editingRoleId === role.id ? (
                                        <>
                                            <button onClick={() => handleUpdateRole(role.id)}>Save</button>
                                            <button onClick={() => setEditingRoleId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            {(userRole === "admin" || role.created_by === userId) && (
                                                <>
                                                    <button onClick={() => {
                                                        setEditingRoleId(role.id);
                                                        setEditedRoleName(role.name);
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteRole(role.id, role.created_by)}>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </>
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
