"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import adminStore from "@/store/adminStore";
import { sidebarMenu } from "@/data/constants";

const SidebarData = ({
  isExpanded,
  isMobileOpen,
  isHovered,
}: {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
}) => {
  const { user } = adminStore();
  const path = usePathname().split("/")[2];

  // Filter menu items based on user role
  const filteredMenu =
    user?.role == "employee"
      ? sidebarMenu.filter((data) => data.title.toLowerCase() != "owner")
      : sidebarMenu;

  return (
    <ul className="flex flex-col gap-4">
      {filteredMenu.map((menu, menuIndex) => (
        <li key={menuIndex}>
          {(isExpanded || isMobileOpen || isHovered) && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {menu.title}
            </h3>
          )}
          <ul>
            {menu.subList.map((navLinks, index) => (
              <li key={index}>
                {navLinks.href && (
                  <Link
                    href={`/admin/${navLinks.href}`}
                    className={`menu-item group ${
                      path === navLinks.href
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    {isExpanded || isMobileOpen || isHovered ? (
                      <>
                        <span
                          className={
                            path === navLinks.href
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }
                        >
                          <navLinks.icon className="w-5 h-5 text-white" />
                        </span>
                        <span className="menu-item-text text-black dark:text-white">
                          {navLinks.title}
                        </span>
                      </>
                    ) : (
                      <span
                        className={
                          path === navLinks.href
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }
                      >
                        <navLinks.icon className="w-5 h-5" />
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default SidebarData;
