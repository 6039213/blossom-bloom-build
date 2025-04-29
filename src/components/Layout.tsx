
import { ReactNode } from "react";
import MainNavbar from "./layout/MainNavbar";
import Footer from "./layout/Footer";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { state } = useSidebar();
  
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <SidebarInset className="flex-1 transition-all duration-200">
        {children}
      </SidebarInset>
      <Footer />
    </div>
  );
}
