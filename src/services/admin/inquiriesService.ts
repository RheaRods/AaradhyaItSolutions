import API_URL from "../../config/api";
import { getToken } from "./authService";

// GET all inquiries
export const getInquiries = async () => {
  const res = await fetch(`${API_URL}/api/admin/inquiries`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  return data.data;
};

// PATCH update inquiry status
export const updateInquiryStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/api/admin/inquiries/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  return data;
};