// import adminStore from "@/store/adminStore";
import { LoginType, RegisterType } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";
export const adminLoginHandler = async (values: LoginType) => {
  try {
    const res = await axios.post("/api/auth/login", values);
    const data = res.data;
    Cookies.set("__hisaabKitaab__", data.token);
    return { data, status: res.status };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.response ? error.response.status : 500,
    };
  }
};

export const adminRegisterHandler = async (values: RegisterType) => {
  try {
    const res = await axios.post("/api/auth/register", values);
    const data = res.data;

    return { message: data, status: res.status };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.response ? error.response.status : 500,
    };
  }
};

export const forgotPasswordHandler = async (values: { email: string }) => {
  try {
    const resp = await axios.post("/api/auth/forgot", values);
    return { message: resp.data, status: resp.status };
  } catch (error: any) {
    if (error.status === 404) {
      return { message: { message: "User not found" }, status: error.status };
    }
    return { message: error, status: error.status };
  }
};
export const newPasswordHandler = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const resp = await axios.post("/api/auth/passwordReset", values);
    return { message: resp.data, status: resp.status };
  } catch (error: any) {
    if (error.status === 404) {
      return { message: { message: "User not found" }, status: error.status };
    }
    return { message: error, status: error.status };
  }
};

export const validateOTP = async (values: any) => {
  try {
    const resp = await axios.post("/api/auth/otp", values);
    return { data: resp.data, status: resp.status };
  } catch (error: any) {
    return { message: error, status: error.status };
  }
};
export const resendOTP = async (email: string) => {
  try {
    const resp = await axios.post("/api/auth/otp", { email });
    return { data: resp.data };
  } catch (error: any) {
    return { message: error, status: error.status };
  }
};
