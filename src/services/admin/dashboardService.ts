import axios from "axios";
import API_URL from "../../config/api";
import { getToken } from "./authService";

export const getDashboardData = async () => {
  const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data.data;
};