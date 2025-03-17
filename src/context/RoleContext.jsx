import { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

export const RoleContext = createContext();

const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await API.get("/roles");
      setRoles(data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const addRole = async (roleName, created_by) => {
    if (!roleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }
    try {
      await API.post("/roles", { name: roleName, created_by });
      await fetchRoles();
      toast.success("Role added successfully");
    } catch (error) {
      toast.error("Failed to add role");
    }
  };

  const updateRole = async (roleId, newName) => {
    try {
      await API.put(`/roles/${roleId}`, { name: newName });
      await fetchRoles();
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const deleteRole = async (roleId) => {
    try {
      await API.delete(`/roles/${roleId}`);
      await fetchRoles();
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  return (
    <RoleContext.Provider value={{ roles, fetchRoles, addRole, updateRole, deleteRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleProvider;
