import axios from "axios";
import API_URL from "../../config/api";

export const getProducts = async (search = "", category = "All") => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (category !== "All") params.category = category;
  const res = await axios.get(`${API_URL}/api/public/products`, { params });
  return res.data.data;
};

export const getProduct = async (id: string | number) => {
  const res = await axios.get(`${API_URL}/api/public/products/${id}`);
  return {
    product: res.data.data,
    similar: res.data.similar || []
  };
};