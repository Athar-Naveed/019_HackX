import MainInventory from "@/components/inventory/MainInventory";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "Inventory",
    description: "Manage your inventory here.",
    icons: "/Logo/hisaab.png"
}
export default function Inventory() {
    return (
        <>
        <MainInventory />
        </>
    );
}