import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import Stats from "@/components/home/Stats";
import Steps from "@/components/home/Steps";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hisaab Kitaab - Manage Your Finances and Tasks Seamlessly",
  description:
    "Hisaab Kitaab is your all-in-one solution for tracking expenses and managing tasks efficiently. Stay organized and in control of your finances and productivity with our user-friendly platform.",
};
const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Steps />
      <Stats />
      <Newsletter />
    </>
  );
};

export default HomePage;
