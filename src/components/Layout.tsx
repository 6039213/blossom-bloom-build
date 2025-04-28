
import { ReactNode } from "react";
import MainNavbar from "./layout/MainNavbar";
import Footer from "./layout/Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
