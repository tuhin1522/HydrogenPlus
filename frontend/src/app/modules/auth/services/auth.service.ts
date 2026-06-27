import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BASE_URL = `${API_URL}/api/v1/auth`;

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  },

  signup: async (data: any) => {
    const response = await axios.post(`${BASE_URL}/signup`, data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  },
};

