
import React from 'react';
import MainNavbar from './MainNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
