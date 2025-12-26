import MainOrderPanel from "@/components/orders/MainOrders"
import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Create Orders Here!",
    description: "Easily create orders and share receipt to your customers, your record is save with Hisaab Kitaab.",
    icons: "/Logo/hisaab.png"
}
export default function Orders(){
    return (
        <>
        <MainOrderPanel />
        </>
    )
}