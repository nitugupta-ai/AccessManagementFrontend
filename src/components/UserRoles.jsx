import { useContext, useEffect, useState } from "react";
import { RoleContext } from "../context/RoleContext";
import { useUser } from "../context/UserContext"; // ✅ Import User Context
import API from "../services/api";
import { toast } from "react-toastify";
import "./UserRoles.css";

const UserRoles = () => {
    const { roles, fetchRoles } = useContext(RoleContext);
    const { users, loading: userLoading } = useUser(); // ✅ Use users from UserContext

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [userRoles, setUserRoles] = useState([]);
    const [roleLoading, setRoleLoading] = useState(false);

    useEffect(() => {
        fetchRoles(); // ✅ Fetch roles only once when the component mounts
    }, []);

    const fetchUserRoles = async (userId) => {
        if (!userId) return;
        setRoleLoading(true);
        try {
            const { data } = await API.get(`/user-roles/${userId}`);
            setUserRoles(data);
        } catch (error) {
            toast.error("Failed to fetch user roles");
        } finally {
            setRoleLoading(false);
        }
    };

    const handleAssignRole = async () => {
        if (!selectedUser || !selectedRole) {
            toast.error("Please select both user and role");
            return;
        }

        try {
            await API.post("/user-roles", {
                user_id: Number(selectedUser),
                role_id: Number(selectedRole),
            });
            toast.success("Role assigned successfully");
            setUserRoles([...userRoles, roles.find((role) => role.id === Number(selectedRole))]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign role");
        }
    };

    const handleRemoveRole = async (roleId) => {
        if (!selectedUser || !roleId) return;

        try {
            await API.delete("/user-roles", {
                data: { user_id: Number(selectedUser), role_id: Number(roleId) },
                headers: { "Content-Type": "application/json" },
            });
            toast.success("Role removed successfully");
            setUserRoles(userRoles.filter((role) => role.id !== roleId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove role");
        }
    };

    return (
        <div className="user-roles-container">
            <h2 className="user-roles-title">Manage User Roles</h2>

            <div className="user-roles-form">
                {/* User Dropdown */}
                <select
                    className="user-dropdown"
                    onChange={(e) => {
                        const userId = e.target.value;
                        setSelectedUser(userId);
                        setUserRoles([]); // Reset roles when changing users
                        if (userId) fetchUserRoles(userId);
                    }}
                    value={selectedUser}
                    disabled={userLoading}
                >
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={String(user.id)}>
                            {user.username} ({user.email})
                        </option>
                    ))}
                </select>

                {/* Role Dropdown */}
                <select
                    className="role-dropdown"
                    onChange={(e) => setSelectedRole(e.target.value)}
                    value={selectedRole}
                    disabled={userLoading}
                >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role.id} value={String(role.id)}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <button className="assign-role-button" onClick={handleAssignRole} disabled={userLoading}>
                    Assign Role
                </button>
            </div>

            {/* Assigned Roles Section */}
            {selectedUser && (
                <div className="assigned-roles-section">
                    <h3 className="assigned-roles-title">Assigned Roles</h3>
                    {roleLoading ? (
                        <p>Loading roles...</p>
                    ) : userRoles.length > 0 ? (
                        <ul className="assigned-roles-list">
                            {userRoles.map((role) => (
                                <li key={`${selectedUser}-${role.id}`} className="assigned-role-item">
                                    {role.name}
                                    <button className="remove-role-button" onClick={() => handleRemoveRole(role.id)}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No roles assigned</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserRoles;
