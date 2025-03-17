import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

// Create the UserContext
const UserContext = createContext();

// ✅ Custom Hook to use User Context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch Users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await API.get("/users");
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle User Creation
    const createUser = async (newUser) => {
        try {
            await API.post("/users/create", newUser);
            toast.success("User created successfully!");
            fetchUsers(); // Refresh users after creation
        } catch (error) {
            toast.error("Failed to create user");
        }
    };

    // ✅ Handle User Deletion
    const deleteUser = async (id, loggedInUserId) => {
        if (id.toString() === loggedInUserId) {
            toast.error("You cannot delete yourself!");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/users/${id}`);
            toast.success("User deleted successfully");
            fetchUsers(); // Refresh users after deletion
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    // ✅ Fetch Users on Mount
    useEffect(() => {
        const token = localStorage.getItem("token");
    if (!token) return; 
        fetchUsers();
    }, []);

    return (
        <UserContext.Provider value={{ users, loading, fetchUsers, createUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};
