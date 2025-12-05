// API configuration for client-server communication
const API_BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get auth token from localStorage
  const token = localStorage.getItem("token");
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "x-auth-token": token }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.warn("API request failed:", error.message);
    throw error;
  }
};

export default apiRequest;
