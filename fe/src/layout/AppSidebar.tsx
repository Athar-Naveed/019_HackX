"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "../context/SidebarContext";
import SidebarData from "./SidebarData";
import Image from "next/image";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="logo flex items-center gap-2 text-white text-xl font-semibold">
                <Image
                  src={"/Logo/hisaab.png"}
                  width={30}
                  height={30}
                  alt={"Hisaab Kitaab Logo"}
                />
                <h1 className="text-black dark:text-white">Hisaabi Keera</h1>
              </div>
            </>
          ) : (
            <div className="logo flex items-center gap-2 text-white text-xl font-semibold">
              <Image
                src={"/Logo/hisaab.png"}
                width={30}
                height={30}
                alt={"Hisaab Kitaab Logo"}
              />
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <SidebarData
                isExpanded={isExpanded}
                isMobileOpen={isMobileOpen}
                isHovered={isHovered}
              />
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
