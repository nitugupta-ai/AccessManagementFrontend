import { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext"; // ✅ Import User Context
import "./Users.css"; 

const Users = () => {
    const { users, loading, createUser, deleteUser } = useUser(); // ✅ Use Context
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
    const role = localStorage.getItem("role");
    const loggedInUserId = localStorage.getItem("userId");

    // ✅ Handle User Creation
    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast.error("All fields are required!");
            return;
        }
        if (newUser.password.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return;
        }
        createUser(newUser);
        setNewUser({ name: "", email: "", password: "", role: "user" });
    };

    return (
        <div className="users-container">
            <h2 className="users-title">User Management</h2>

            {role === "admin" && (
                <div className="user-form">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className="create-user-btn" onClick={handleCreateUser}>
                        Create User
                    </button>
                </div>
            )}

            {loading ? (
                <p className="loading-text">Loading users...</p>
            ) : users?.length > 0 ? (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            {role === "admin" && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                {role === "admin" && (
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteUser(user.id, loggedInUserId)}>
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default Users;
