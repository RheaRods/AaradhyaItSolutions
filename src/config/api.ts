// Dynamically switches between local testing and your live Render server URL
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://aaradhyaitsolutions-backend.onrender.com";

export default API_URL;