import React from "react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar />
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 ml-[205px] p-[20px] bg-sd-grey-1/50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
