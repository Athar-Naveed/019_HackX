import { axiosInstance } from "@/utils/clientUtils";
import axios from "axios";
import Cookies from "js-cookie";
const token = await Cookies.get("__hissabKitaab__");

export const getPocketTransactions = async (pocketId: string) => {
  try {
    const response = await axiosInstance.get("/pockets/transactions", {
      params: { pocketId },
    });
    return {
      data: response.data.transactions,
      pocket: response.data.pocket,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.response.status,
    };
  }
};

export const createTransaction = async (values: any) => {
  try {
    const response = await axiosInstance.post("/pockets/transactions", values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      data: response.data.transactions,
      pocket: response.data.pocket,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      status: error.response.status,
    };
  }
};
