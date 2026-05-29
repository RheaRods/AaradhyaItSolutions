import API_URL from "../../config/api";
import { getToken } from "./authService";

// GET all products
export const getProducts = async (search = "", type = "All") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (type !== "All") params.append("type", type);

  const res = await fetch(`${API_URL}/api/admin/products?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  return data.data;
};

// POST add product
export const addProduct = async (product: any) => {
  const res = await fetch(`${API_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  return data;
};

// DELETE single product
export const deleteProduct = async (id: string) => {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  return data;
};

// DELETE multiple products
export const deleteProducts = async (ids: string[]) => {
  const res = await fetch(`${API_URL}/api/admin/products/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ids }),
  });
  const data = await res.json();
  return data;
};