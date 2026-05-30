// Dynamically switches between your local testing environment and your real live Render server
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : "https://aaradhyasolutions-backend.onrender.com"; // 🌟 REMOVED THE "-it-" TO MATCH YOUR RENDER NAME

export default API_URL;