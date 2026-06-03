import axios from "axios";
import API_URL from "../../config/api";

export const loginAdmin = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/api/admin/auth/login`, { username, password });
  return res.data;
};

export const saveToken = (token: string) => {
  localStorage.setItem("adminToken", token);
};

export const getToken = () => {
  return localStorage.getItem("adminToken");
};

export const logout = () => {
  localStorage.removeItem("adminToken");
};