import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
export const API = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

console.log("API Configuration:");
console.log("BACKEND_URL:", BACKEND_URL);
console.log("API:", API);

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Add debugging for API calls
api.interceptors.request.use(request => {
  console.log('API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const SCHOOL = {
  name: "The Foundation Academy",
  tagline: "Building Future On A Strong Foundation",
  address: "Chandi Road, Harnaut, Nalanda, Bihar - 803110",
  phones: ["+91 8986233963", "+91 9006876172"],
  email: "info@foundationacademy.in",
  youtube: "thefoundationacademy",
  type: "English Medium • Co-Education • CBSE Pattern",
  classes: "Nursery to Class VIII",
};
