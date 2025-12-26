import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin SignIn Page | Hisaab Kitaab",
  description: "This is Hisaab Kitaab Signin Page",
};

export default function SignIn() {
  return <SignInForm />;
}
