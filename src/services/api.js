import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

// ✅ Attach JWT Token to Requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

// ✅ Handle Unauthorized Responses
API.interceptors.response.use(
    (response) => response, // Return response if successful
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401 || status === 403) {
                toast.error("Unauthorized access! Redirecting to login...");
                localStorage.removeItem("token"); // Clear token
                localStorage.removeItem("role"); // Clear role
                window.location.href = "/forbidden"; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default API;
