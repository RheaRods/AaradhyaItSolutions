import API_URL from "../../config/api";

// POST contact form
export const submitInquiry = async (form: {
  name: string;
  business: string;
  phone: string;
  message: string;
}) => {
  const res = await fetch(`${API_URL}/api/public/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  return data;
};