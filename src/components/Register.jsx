import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "./login.css";  

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
        <div className="login-container">
            <div className="login-card">
            <h2 className="login-title">Register</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="login-input" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="login-input" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="login-input" />
                <button type="submit" className="login-button">Register</button>
            </form>
            </div>
        </div>
    );
};

export default Register;
