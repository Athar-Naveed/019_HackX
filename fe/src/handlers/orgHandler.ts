import axios from "axios";
import Cookies from "js-cookie";
export const createOrgHandler = async (values: any) => {
  try {
    const resp = await axios.post("/api/v1/org/create", values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("__hisaabKitaab__")}`,
      },
    });
    return { message: resp.data, status: resp.status };
  } catch (error: any) {
    return { message: error.response.data.message, status: error.status };
  }
};

export const verifyOrgHandler = async (values: any) => {
  try {
    const resp = await axios.post("/api/v1/org/join", values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("__hisaabKitaab__")}`,
      },
    });
    return { message: resp.data, status: resp.status };
  } catch (error: any) {
    if (error.status == 403) {
      return { message: error.response.data.message, status: error.status };
    }
    return { message: error.response.data.message, status: error.status };
  }
};

export const getOrgHandler = async () => {
  try {
    const resp = await axios.get("/api/v1/org/get", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("__hisaabKitaab__")}`,
      },
    });
    if (resp.status == 200) {
      return { data: resp.data.data, status: resp.status };
    }
    return { message: resp.data.message, status: resp.status };
  } catch (error: any) {
    if (error.status == 403) {
      return { message: error.response.data.message, status: error.status };
    }
    return { message: error.response.data.message, status: error.status };
  }
};
