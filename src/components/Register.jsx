import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", formData);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error("Registration failed. Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="p-2 border rounded" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="p-2 border rounded" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="p-2 border rounded" />
                <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">Register</button>
            </form>
        </div>
    );
};

export default Register;
