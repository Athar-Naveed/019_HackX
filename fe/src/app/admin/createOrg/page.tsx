import MainForm from "@/components/createOrg/mainForm";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "Create Organization",
    description: "Create a new organization here.",
    icons: "/Logo/hisaab.png"
}

export default function CreateOrganization(){
    return (
        <>
        <MainForm />
        </>
    )
}