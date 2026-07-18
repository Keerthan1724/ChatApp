import api from "./api";

const authService = {
  register: async (data) => {
    const response = await api.post("/auth/register/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  login: async ({ email, password, remember }) => {
    const response = await api.post("/auth/login/", {
      identifier: email,
      password,
    });
    
    const storage = remember ? localStorage : sessionStorage;
    
    if (remember) {
      sessionStorage.removeItem("access");
      sessionStorage.removeItem("user");
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("user");
    }

    storage.setItem("access", response.data.access);
    storage.setItem("user", JSON.stringify(response.data.user));
    
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout/");

    localStorage.removeItem("access");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("user");
  },

  sendVerificationOTP: async (email) => {
    const response = await api.post("/auth/send-verification-otp/", { email });

    return response.data;
  },

  verifyEmailOTP: async (data) => {
    const response = await api.post("/auth/verify-email/", data);

    return response.data;
  },

  sendPasswordResetOTP: async (email) => {
    const response = await api.post("/auth/send-password-reset-otp/", {
      email,
    });

    return response.data;
  },

  verifyPasswordResetOTP: async (data) => {
    const response = await api.post("/auth/verify-password-reset-otp/", data);

    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post("/auth/reset-password/", data);

    return response.data;
  },
};

export default authService;
