import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Users.css"; // ✅ Import CSS

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchUsers(); // ✅ Fetch users initially
    }, []);

    // ✅ Fetch Users Function
    const fetchUsers = async () => {
        try {
            const response = await API.get("/users");
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    // ✅ Fix: Fetch updated user list after adding
    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast.error("All fields are required!");
            return;
        }
        try {
            await API.post("/users/create", newUser);
            toast.success("User created successfully!");
            setNewUser({ name: "", email: "", password: "", role: "user" });
            fetchUsers(); // ✅ Fetch users again after adding
        } catch (error) {
            toast.error("Failed to create user");
        }
    };

    const handleDeleteUser = async (id) => {
        const loggedInUserId = localStorage.getItem("userId");
    
        if (id.toString() === loggedInUserId) {
            toast.error("You cannot delete yourself as an admin!");
            return;
        }
    
        try {
            const response = await API.delete(`/users/${id}`);
    
            if (response.data.error) {
                toast.error(response.data.message); // 🚀 Show toast without redirecting
                return;
            }
    
            toast.success("User deleted successfully");
            fetchUsers(); // ✅ Refresh user list
        } catch (error) {
            toast.error("Failed to delete user");
        }
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
                    </select>
                    <button className="create-user-btn" onClick={handleCreateUser}>
                        Create User
                    </button>
                </div>
            )}

            {users?.length > 0 ? (
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
                                        <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
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
