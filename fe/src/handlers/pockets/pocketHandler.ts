import { axiosInstance } from "@/utils/clientUtils";
import axios from "axios";
import Cookies from "js-cookie";
const token = await Cookies.get("__hisaabKitaab__");

export const getPockets = async () => {
  try {
    const resp = await axiosInstance.get("/pockets");
    return {
      message: resp.data.message,
      pockets: resp.data.pockets,
      status: resp.status,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.response.data.status,
    };
  }
};

export const createPocket = async (values: {
  pocketName: string;
  pocketType: string;
  organizationId: string;
}) => {
  try {
    const resp = await axios.post("/api/v1/pockets/create", values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      message: resp.data.message,
      pockets: resp.data.pockets,
      status: resp.status,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.response.data.status,
    };
  }
};
