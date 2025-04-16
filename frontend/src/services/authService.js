import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const signup = (data, role) => {
  const endpoint = role === "admin" ? "/user/admin/create" : "/user/voter/signup";
  return axios.post(`${API}${endpoint}`, data);
};

export const login = async (data, role) => {
  const endpoint = role === "admin" ? "/user/admin/login" : "/user/voter/login";
  const response = await axios.post(`${API}${endpoint}`, data);
  const token = response.data.access_token;

  return { token, role }; // 🟢 Return both
};
