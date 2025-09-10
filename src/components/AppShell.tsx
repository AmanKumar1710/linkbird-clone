"use client";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
