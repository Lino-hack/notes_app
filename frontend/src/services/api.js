import axios from "axios";
import { AUTH_STORAGE_KEY, DEFAULT_API_URL } from "../constants";

const sanitizeBaseUrl = (value) => value.replace(/\/+$/, "");

const API_BASE_URL = sanitizeBaseUrl(
  process.env.REACT_APP_API_URL || DEFAULT_API_URL
);
const API_HOST = API_BASE_URL.replace(/\/api$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch (error) {
    return null;
  }
};

API.interceptors.request.use((req) => {
  const token = getStoredToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export { API_BASE_URL, API_HOST };
export default API;
