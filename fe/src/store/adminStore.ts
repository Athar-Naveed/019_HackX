
import { AdminStateType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


const adminStore = create<AdminStateType>()(
    persist(
        (set)=>({
            user:null,
            email:"",
            unit: "PKR",
            isChat:false,
            setIsChat: (isChat:boolean) => set(() => ({isChat:isChat})),
            setUnit: (unit:string) => set(() => ({unit:unit})),
            setEmail: (email:string) => set(() => ({email:email})) ,
            setUser: (user) => set(() => ({user:user}))
        }),
        {
            name: "userStorage",
            partialize: (state) => ({user:state.user})
        }
    )
)

export default adminStore;