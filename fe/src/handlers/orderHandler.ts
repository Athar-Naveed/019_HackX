import axios from "axios"
import Cookies from "js-cookie"
export const placeOrder = async (values:any) => {
    try {
        const resp = await axios.post("/api/v1/order/create",values,{
            headers: {
                "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get("__hisaabKitaab__")}`
        }
    })
    
        return {message:resp.data.message,status:resp.status};
    } catch (error:any) {
        
        return {message:`Error! Unable to place order`,status:500}
    }
}

export const getOrders = async (organizationId:string) => {
try {
        const resp = await axios.get(`/api/v1/order/get?organizationId=${organizationId}`,{
            headers: {
                "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get("__hisaabKitaab__")}`
        }
    })
    
        return {message:resp.data.data,status:resp.status};
    } catch (error:any) {
        
        return {message:`Error! Unable to fetch orders`,status:500}
    }
}