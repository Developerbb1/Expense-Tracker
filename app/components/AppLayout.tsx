"use client";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  return (
    <div className="app-layout">
      <Header sidebarOpen={sidebarOpen} onMenuClick={toggleSidebar} />

      <Sidebar sidebarOpen={sidebarOpen} onMenuClick={toggleSidebar} />

      <main className="main-content">{children}</main>
    </div>
  );
}
