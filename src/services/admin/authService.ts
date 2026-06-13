import axios from "axios";
import API_URL from "../../config/api";

export const loginAdmin = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/api/admin/auth/login`, { username, password });
  return res.data;
};

export const saveToken = (token: string, name?: string, avatar?: string) => {
  // Use ONLY sessionStorage for the token so it clears automatically on tab close
  sessionStorage.setItem("adminToken", token);
  
  if (name) {
    localStorage.setItem("adminName", name);
    sessionStorage.setItem("adminName", name);
  }
  if (avatar) {
    localStorage.setItem("adminAvatar", avatar);
    sessionStorage.setItem("adminAvatar", avatar);
  }
};

export const getToken = () => {
  // Check sessionStorage strictly to enforce the tab-close logout rule
  return sessionStorage.getItem("adminToken");
};

export const logout = () => {
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminAvatar");
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminName");
  sessionStorage.removeItem("adminAvatar");
};