"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle, FaWallet, FaVideo, FaBoxOpen } from "react-icons/fa";
import { TbHomeFilled } from "react-icons/tb";

const menuItems = [
  { name: "Dashboard", icon: <TbHomeFilled />, path: "/admin/dashboard" },
  { name: "Users", icon: <FaUserCircle />, path: "/admin/users" },
  { name: "Products", icon: <FaBoxOpen />, path: "/admin/products" },
  { name: "Orders", icon: <FaWallet />, path: "/admin/orders" },
  { name: "Meetings", icon: <FaVideo />, path: "/admin/meetings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed top-[70px] left-0 h-screen w-64 bg-gray-900 text-white shadow-lg">
      {/* Logo / Title */}
      <div className="px-6 py-6 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-2 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-amber-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}