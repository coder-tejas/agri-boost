"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "../_components/AppSidebar";

function DashboardProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* <AppHeader /> */}
        {/* <SidebarTrigger /> */}
        <div className="">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardProvider;
