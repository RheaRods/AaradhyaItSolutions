import axios from "axios";
import API_URL from "../../config/api";
import { getToken } from "./authService";

const auth = () => ({ Authorization: `Bearer ${getToken()}` });

export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/api/admin/categories`, { headers: auth() });
  return res.data.data;
};

export const addCategory = async (name: string) => {
  const res = await axios.post(`${API_URL}/api/admin/categories`, { name }, {
    headers: { ...auth(), "Content-Type": "application/json" },
  });
  return res.data;
};