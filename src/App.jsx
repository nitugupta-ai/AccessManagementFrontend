import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register.jsx";
import Landing from "./components/Landing.jsx";
import Users from "./components/Users.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Roles from "./components/Roles.jsx";
import Modules from "./components/Modules.jsx";
import UserRoles from "./components/UserRoles.jsx";
import RolesModules from "./components/RolesModules.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Forbidden from "./components/Forbidden.jsx";

// Import Context Providers
import RoleProvider from "./context/RoleContext.jsx";
import ModuleProvider from "./context/ModuleContext.jsx";
import RoleModuleProvider from "./context/RoleModulesContext.jsx";
import UserModuleProvider from "./context/UserModulesContext.jsx";
import { UserProvider } from "./context/UserContext"; 
const App = () => {
    return (
        <UserProvider>
        <RoleProvider>
            <ModuleProvider>
                <RoleModuleProvider>
                    <UserModuleProvider>
                        <Router>
                            <ToastContainer position="top-right" autoClose={3000} />
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Landing />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/forbidden" element={<Forbidden />} />

                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/modules" element={<Modules />} />
                                    <Route path="/roles" element={<Roles />} />
                                    <Route path="/users" element={<Users />} />
                                    <Route path="/user-roles" element={<UserRoles />} />
                                    <Route path="/roles-modules" element={<RolesModules />} />
                                </Route>
                            </Routes>
                        </Router>
                    </UserModuleProvider>
                </RoleModuleProvider>
            </ModuleProvider>
        </RoleProvider>
        </UserProvider>
    );
};

export default App;
