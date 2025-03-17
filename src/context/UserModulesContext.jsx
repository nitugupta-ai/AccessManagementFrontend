import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserModuleContext = createContext();

const UserModuleProvider = ({ children }) => {
  const [userModules, setUserModules] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // 🚀 Stop API call if no token
    fetchUserModules();
  }, []);

  const fetchUserModules = async () => {
    try {
      const response = await axios.get("/api/user-modules");
      setUserModules(response.data);
    } catch (error) {
      console.error("Error fetching user modules:", error);
    }
  };

  return (
    <UserModuleContext.Provider value={{ userModules, fetchUserModules }}>
      {children}
    </UserModuleContext.Provider>
  );
};

export default UserModuleProvider;
