"use client";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import adminStore from "@/store/adminStore";
// import { userDropdown } from "@/data/constants";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = adminStore();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const handleOut = () => {
    Cookies.remove("__hisaabKitaab__");
    location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 border border-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 flex items-center justify-center overflow-hidden rounded-full h-11 w-11">
          <div className="name">
            <span className="mr-3 border border-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 flex items-center justify-center overflow-hidden rounded-full h-11 w-11">
              <div className="name">
                {user?.fullName?.split(" ")[0].split("")[0] || ""}
              </div>
            </span>
          </div>
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.fullName}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="
    absolute right-0 mt-4 w-[260px]
    rounded-xl border
    bg-white p-3 shadow-xl
    border-gray-200

    dark:bg-gray-900
    dark:border-gray-700
  "
      >
        {/* User Info */}
        <div className="px-1 pb-3">
          <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
            {user?.fullName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>

        {/* Links */}
        {/* <ul className="flex flex-col gap-1 border-t border-gray-200 pt-3 dark:border-gray-700">
          {userDropdown.map((link: any, index: number) => (
            <li key={index}>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                href={link.href}
                className="
            flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium
            text-gray-700 hover:bg-gray-100

            dark:text-gray-300
            dark:hover:bg-gray-800
            dark:hover:text-white
          "
              >
                <link.icon className="h-4 w-4 opacity-80" />
                <span>{link.title}</span>
              </DropdownItem>
            </li>
          ))}
        </ul> */}

        {/* Sign Out */}
        <button
          onClick={handleOut}
          className="
      mt-3 flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium
      text-red-600 hover:bg-red-50

      dark:text-red-400
      dark:hover:bg-red-500/10
    "
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484H16.0007C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484H5.81528L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
            />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
