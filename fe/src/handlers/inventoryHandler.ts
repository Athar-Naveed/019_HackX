import { axiosInstance } from "@/utils/clientUtils";
import axios from "axios";
import Cookies from "js-cookie";
export const createInventory = async (values: any) => {
  try {
    const resp = await axios.post("/api/v1/inventory/create", values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("__hisaabKitaab__")}`,
      },
    });

    return { message: resp.data.message, status: resp.status };
  } catch (error: any) {
    return {
      message: `Error! Unable to add product to inventory `,
      status: 500,
    };
  }
};

export const getInventory = async (organizationId: string) => {
  try {
    const resp = await axios.get(
      `/api/v1/inventory/get?organizationId=${organizationId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("__hisaabKitaab__")}`,
        },
      }
    );

    return { message: resp.data.data, status: resp.status };
  } catch (error: any) {
    return { message: `Error! Unable to fetch inventory `, status: 500 };
  }
};
export const getInvento = async () => {
  try {
    const resp = await axiosInstance.get(`/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("__hisaabKitaab__")}`,
      },
    });

    return { data: resp.data, status: resp.status };
  } catch (error: any) {
    return { message: `Error! Unable to fetch inventory `, status: 500 };
  }
};
