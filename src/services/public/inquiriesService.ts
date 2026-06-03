import axios from "axios";
import API_URL from "../../config/api";

export const submitInquiry = async (form: {
  name?: string;
  business?: string;
  phone?: string;
  message?: string;
  prod_id?: number;
  method?: string;
}) => {
  const res = await axios.post(`${API_URL}/api/public/inquiries`, {
    full_name:     form.name || "Visitor",
    business_name: form.business || null,
    phone_no:      form.phone || "N/A",
    message:       form.message || null,
    prod_id:       form.prod_id || null,
    method:        form.method || "Website",
  });
  return res.data;
};