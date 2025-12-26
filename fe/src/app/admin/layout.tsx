"use client";

import ChatModal from "@/components/example/ModalExample/ChatModal";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { getUserData } from "@/handlers/userHandler";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import adminStore from "@/store/adminStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isChat, setUser } = adminStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData();

      setUser(response);
    };
    fetchUserData();
  }, [setUser]);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex" suppressHydrationWarning={true}>
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
        {isChat && <ChatModal />}
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutInner>
        {children}
        <Toaster />
      </AdminLayoutInner>
    </SidebarProvider>
  );
}
