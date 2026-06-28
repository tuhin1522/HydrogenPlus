// // import axios from "axios";

import axiosInstance from "@/app/services/axiosInstance";

// import axiosInstance from "@/app/services/axiosInstance";

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// // const BASE_URL = `${API_URL}/auth`;

// // export const authService = {
// //   login: async (email: string, password: string) => {
// //     const response = await axios.post(`${BASE_URL}/login`, { email, password });
// //     return response.data;
// //   },

// //   signup: async (data: any) => {
// //     const response = await axios.post(`${BASE_URL}/signup`, data);
// //     return response.data;
// //   },

// //   forgotPassword: async (email: string) => {
// //     const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
// //     return response.data;
// //   },

// //   verifyEmail: async (token: string) => {
// //     const response = await axios.get(`${BASE_URL}/verify?token=${token}`);
// //     return response.data;
// //   },

// //   resendVerification: async (email: string) => {
// //     const response = await axios.post(`${BASE_URL}/resend-verification`, { email });
// //     return response.data;
// //   },

// //   resetPassword: async (token: string, newPassword: string) => {
// //     const response = await axios.post(`${BASE_URL}/reset-password`, { token, newPassword });
// //     return response.data;
// //   }
// // };




// const BASE_URL = "/auth";

// export const authService = {
//   login: async (email: string, password: string) => {
//     const response = await axiosInstance.post(`${BASE_URL}/login`, {
//       email,
//       password,
//     });
//     return response.data;
//   },

//   signup: async (data: any) => {
//     const response = await axiosInstance.post(`${BASE_URL}/signup`, data);
//     return response.data;
//   },

//   forgotPassword: async (email: string) => {
//     const response = await axiosInstance.post(`${BASE_URL}/forgot-password`, {
//       email,
//     });
//     return response.data;
//   },

//   verifyEmail: async (token: string) => {
//     const response = await axiosInstance.get(`${BASE_URL}/verify`, {
//       params: { token },
//     });
//     return response.data;
//   },

//   resendVerification: async (email: string) => {
//     const response = await axiosInstance.post(
//       `${BASE_URL}/resend-verification`,
//       { email }
//     );
//     return response.data;
//   },

//   resetPassword: async (token: string, newPassword: string) => {
//     const response = await axiosInstance.post(`${BASE_URL}/reset-password`, {
//       token,
//       newPassword,
//     });
//     return response.data;
//   },
// };




export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const signup = async (data: any) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axiosInstance.get("/auth/verify", {
    params: { token },
  });
  return response.data;
};

export const resendVerification = async (email: string) => {
  const response = await axiosInstance.post(
    "/auth/resend-verification",
    { email }
  );
  return response.data;
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

export const authService = {
  login,
  signup,
  forgotPassword,
  verifyEmail,
  resendVerification,
  resetPassword,
};