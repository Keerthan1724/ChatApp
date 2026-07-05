import { createContext, useContext, useState } from "react";

const RegisterContext = createContext();

const STORAGE_KEY = "quickchat_register_data";

const initialRegisterData = {
  full_name: "",
  email: "",
  mobile_number: "",
  password: "",
  confirm_password: "",

  profile_picture: null,
  profile_picture_preview: "",
  profile_picture_url: "",
  bio: "",

  email_verified: false,
};

const getInitialRegisterData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialRegisterData;
    const parsed = JSON.parse(saved);
    return { ...initialRegisterData, ...parsed };
  } catch {
    return initialRegisterData;
  }
};

export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] =
    useState(getInitialRegisterData());

  const updateRegisterData = (data) => {
    setRegisterData((prev) => {
      const next = {
        ...prev,
        ...data,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  const resetRegisterData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    setRegisterData(initialRegisterData);
  };

  return (
    <RegisterContext.Provider
      value={{
        registerData,
        updateRegisterData,
        resetRegisterData,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () =>
  useContext(RegisterContext);