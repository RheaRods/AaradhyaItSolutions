import axios from "axios";
import API_URL from "../../config/api";

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/api/public/stats`);
  return res.data.data;
};