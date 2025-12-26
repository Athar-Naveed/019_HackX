import { axiosInstance } from "@/utils/clientUtils";
import axios from "axios";
import Cookies from "js-cookie";
const token = Cookies.get("__hisaabKitaab__");
export const getStats = async () => {
  try {
    const resp = await axiosInstance.get("/stats");
    return { data: resp.data, status: resp.status };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.status,
    };
  }
};
