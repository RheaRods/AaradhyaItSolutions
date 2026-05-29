import API_URL from "../../config/api";

// POST admin login
export const loginAdmin = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  return data;
};

// Save token to localStorage
export const saveToken = (token: string) => {
  localStorage.setItem("adminToken", token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("adminToken");
};

// Logout - remove token
export const logout = () => {
  localStorage.removeItem("adminToken");
};