import API_URL from "../../config/api";

// GET home page stats
export const getStats = async () => {
  const res = await fetch(`${API_URL}/api/public/stats`);
  const data = await res.json();
  return data.data;
};