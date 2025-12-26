import MainPocketPanel from "@/components/pockets/MainPockets";
import CreatingPockets from "@/components/pockets/Pockets";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pockets | Hisaab Kitaab",
  description: "",
  icons: "/Logo/hisaab.png",
};

export default function Pockets() {
  return (
    <>
      <MainPocketPanel />
      <CreatingPockets />
    </>
  );
}
