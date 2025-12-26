import { MessageType } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";
export const sendChatbotMessage = async (message:MessageType) => {
    
    try {
        const resp = await axios.post("/api/v1/chatbot/chat",message,{
            headers:{
                "Authorization": `Bearer ${Cookies.get("__hisaabKitaab__")}`,
                "Content-Type":"application/json"
            }
        })
        
        return resp.data.message;
    } catch (error:any) {

        return {"message":error.message}
    }
}