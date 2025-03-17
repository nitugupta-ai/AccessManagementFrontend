import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import "./Login.css"; // ✅ Import CSS

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/login", formData);
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", jwtDecode(data.token).role);
            const decodedToken = jwtDecode(data.token);
        console.log("🔍 Decoded Token:", decodedToken);
        if (decodedToken.id) {
            localStorage.setItem("userId", decodedToken.id.toString()); // Ensure it's stored as a string
            console.log("✅ Stored User ID:", localStorage.getItem("userId")); // Debugging
        } else {
            console.error("❌ User ID is missing in the token");
        }
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="login-input" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="login-input" />
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
