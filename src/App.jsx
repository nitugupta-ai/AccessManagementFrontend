import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register.jsx";
import Landing from "./components/Landing.jsx";
import Users from "./components/Users.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Roles from "./components/Roles.jsx";
import Modules from "./components/Modules.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Forbidden from "./components/Forbidden.jsx";

const App = () => {
    return (
        <Router>
           <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/modules" element={<Modules />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/users" element={<Users />} />
                <Route path="/forbidden" element={<Forbidden />} />

            </Routes>
        </Router>
    );
};

export default App;
