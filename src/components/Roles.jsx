import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Roles.css"; // Import the CSS file

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]); // Assigned roles for user
    const [roleName, setRoleName] = useState("");
    const [editingRole, setEditingRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [forbidden, setForbidden] = useState(false);

    const role = localStorage.getItem("role");
    const userId = Number(localStorage.getItem("userId"));
    const isAdmin = role === "admin";

    useEffect(() => {
        fetchRoles();
        if (!isAdmin) {
            fetchUserRoles(); // Fetch assigned roles only for non-admins
        }
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await API.get("/roles");
            if (!Array.isArray(response.data)) throw new Error("Invalid response format");
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error.response?.data || error.message);
            toast.error("Failed to fetch roles");
            setForbidden(error.response?.status === 403);
        }
    };

    const fetchUserRoles = async () => {
        try {
            const response = await API.get(`/user-roles/${userId}`);
            if (!Array.isArray(response.data)) throw new Error("Invalid response format");
            setUserRoles(response.data);
        } catch (error) {
            console.error("Error fetching user roles:", error.response?.data || error.message);
            toast.error("Failed to fetch assigned roles");
        }
    };

    const handleCreateRole = async () => {
        if (!roleName.trim()) {
            toast.error("Role name is required");
            return;
        }
        setLoading(true);
        try {
            const response = await API.post("/roles", { name: roleName, created_by: userId });
            setRoles([...roles, response.data]);
            setRoleName("");
            toast.success("Role created successfully");
        } catch (error) {
            toast.error("Failed to create role");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (id) => {
        setLoading(true);
        try {
            await API.delete(`/roles/${id}`);
            setRoles(roles.filter(role => role.id !== id));
            toast.success("Role deleted successfully");
        } catch (error) {
            toast.error("Failed to delete role");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRole = async (roleId) => {
        setLoading(true);
        try {
            await API.post("/user-roles/join", { role_id: roleId, user_id: userId });
            toast.success("Joined role successfully");
            fetchUserRoles();
        } catch (error) {
            toast.error("Failed to join role");
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveRole = async (roleId) => {
        setLoading(true);
        try {
            await API.post("/user-roles/leave", { role_id: roleId, user_id: userId });
            toast.success("Left role successfully");
            fetchUserRoles();
        } catch (error) {
            toast.error("Failed to leave role");
        } finally {
            setLoading(false);
        }
    };

    if (forbidden) {
        return <h2 className="forbidden">Forbidden: You do not have access to this page</h2>;
    }

    return (
        <div className="roles-container">
            <h2>Role Management</h2>
            {isAdmin && (
                <div className="input-container">
                    <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="Enter Role Name"
                        className="role-input"
                    />
                    <button onClick={handleCreateRole} className="create-btn" disabled={loading}>
                        {loading ? "Creating..." : "Create Role"}
                    </button>
                </div>
            )}

            <div className="table-container">
                <h2>All Available Roles</h2>
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
                            <tr key={`role-${role?.id}`}>
                                <td>{role?.id}</td>
                                <td>{role?.name}</td>
                                <td>
                                    {isAdmin ? (
                                        <button onClick={() => handleDeleteRole(role.id)} className="delete-btn" disabled={loading}>
                                            Delete
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleJoinRole(role.id)} className="join-btn" disabled={loading}>
                                                Join
                                            </button>
                                            <button onClick={() => handleLeaveRole(role.id)} className="leave-btn" disabled={loading}>
                                                Leave
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isAdmin && (
                <div className="table-container">
                    <h2>My Assigned Roles</h2>
                    <table className="roles-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRoles.map(role => (
                                <tr key={`my-role-${role?.id}`}>
                                    <td>{role?.id}</td>
                                    <td>{role?.name}</td>
                                    <td>
                                        <button onClick={() => handleLeaveRole(role.id)} className="leave-btn" disabled={loading}>
                                            Leave
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Roles;
