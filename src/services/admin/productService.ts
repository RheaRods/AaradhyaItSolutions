import axios from "axios";
import API_URL from "../../config/api";
import { getToken } from "./authService";

const auth = () => ({ Authorization: `Bearer ${getToken()}` });

export const getProducts = async (search = "", type = "All") => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (type !== "All") params.type = type;
  const res = await axios.get(`${API_URL}/api/admin/products`, {
    headers: auth(), params,
  });
  return res.data.data;
};

export const getProduct = async (id: number) => {
  const res = await axios.get(`${API_URL}/api/admin/products/${id}`, {
    headers: auth(),
  });
  return res.data.data;
};

export const addProduct = async (product: any) => {
  const res = await axios.post(`${API_URL}/api/admin/products`, product, {
    headers: { ...auth() },
  });
  return res.data;
};

export const updateProduct = async (id: number, product: any) => {
  const res = await axios.put(`${API_URL}/api/admin/products/${id}`, product, {
    headers: { ...auth() },
  });
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await axios.delete(`${API_URL}/api/admin/products/${id}`, { headers: auth() });
  return res.data;
};

export const deleteProducts = async (ids: number[]) => {
  const res = await axios.delete(`${API_URL}/api/admin/products/bulk`, {
    headers: { ...auth(), "Content-Type": "application/json" },
    data: { ids },
  });
  return res.data;
};

export const toggleProduct = async (id: number, is_active: boolean) => {
  const res = await axios.patch(`${API_URL}/api/admin/products/${id}/toggle`, { is_active }, {
    headers: auth()
  })
  return res.data
}