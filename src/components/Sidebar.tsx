"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const router = useRouter();

  // Replace with Zustand/global state if you want persisted selection/collapse in the future
  const sidebarCollapsed = false;
  const menuItems = [
    { icon: <span>🏠</span>, label: "Dashboard", href: "/dashboard" },
    { icon: <span>📇</span>, label: "Leads", href: "/leads" },
    { icon: <span>📊</span>, label: "Campaigns", href: "/campaigns" },
  ];

  return (
    <aside className={`bg-white border-r h-screen flex flex-col w-64`}>
      {/* Top Logo */}
      <div className="flex items-center px-6 py-4 mb-2">
        <span className="font-bold text-xl text-blue-700 pr-2"> {/* Replace with your logo if any */}
          <span className="bg-blue-600 px-2 py-1 rounded text-white mr-2">✉️</span>
          LinkBird
        </span>
      </div>
      {/* Main Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map(({ icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      {/* User profile and Logout at bottom */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
            U
          </div>
          <div>
            <p className="font-semibold">User</p>
            <p className="text-xs text-gray-400">user@email.com</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition text-sm font-medium"
          onClick={() => signOut()}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
