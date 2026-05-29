import API_URL from "../../config/api";

// GET all products (with search + filter)
export const getProducts = async (search = "", category = "All") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category !== "All") params.append("category", category);

  const res = await fetch(`${API_URL}/api/public/products?${params}`);
  const data = await res.json();
  return data.data;
};

// GET single product
export const getProduct = async (id: string) => {
  const res = await fetch(`${API_URL}/api/public/products/${id}`);
  const data = await res.json();
  return { product: data.data, similar: data.similar };
};