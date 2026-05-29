import API_URL from "../../config/api";
import { getToken } from "./authService";

// GET dashboard data
export const getDashboardData = async () => {
  const res = await fetch(`${API_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  return data.data;
};