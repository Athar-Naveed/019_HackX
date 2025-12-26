import Cookies from "js-cookie";
import { axiosInstance } from "@/utils/clientUtils";

export const getUserData = async () => {
  try {
    const res = await axiosInstance.get("/user");

    return res.data;
  } catch (error: any) {
    return { error: error.message, status: error.status };
  }
};
