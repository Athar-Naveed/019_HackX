"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import CreateOrgForm from "./createOrgForm";
import JoinOrgForm from "./joinOrgForm";
import { Building, Users } from "lucide-react";
import MainHeader from "../ui/header/MainHeader";

const MainForm = () => {
  const [createOrg, setCreateOrg] = useState<boolean>(true);

  return (
    <div className="w-full">
      <MainHeader state={createOrg} page={"Organizations"} />

      {/* Tab navigation with more color */}
      <div className="flex mb-8 bg-gray-50 dark:bg-gray-dark text-gray-dark rounded-lg p-1 border border-gray-200">
        <TabButton
          active={createOrg}
          onClick={() => setCreateOrg(true)}
          icon={<Building className="w-4 h-4 mr-2" />}
          text="Create New Dukaan"
        />
        {/* <TabButton
          active={!createOrg}
          onClick={() => setCreateOrg(false)}
          icon={<Users className="w-4 h-4 mr-2" />}
          text="Join Existing Organization"
        /> */}
      </div>

      {/* Form container with animation */}
      <div className="max-w-2xl">
        <motion.div
          key={createOrg ? "create" : "join"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {createOrg ? <CreateOrgForm /> : <JoinOrgForm />}
        </motion.div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
}

const TabButton = ({ active, onClick, icon, text }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-md ${
        active
          ? "bg-white text-brand-600 shadow-xs"
          : "text-gray-600 hover:text-brand-600 hover:bg-white/50"
      }`}
    >
      <span className={`flex items-center ${active ? "text-brand-600" : ""}`}>
        {icon}
        {text}
      </span>
    </button>
  );
};

export default MainForm;
