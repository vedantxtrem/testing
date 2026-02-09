"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiMenu } from "react-icons/bi";
import { FaUserCircle, FaWallet, FaVideo, FaBoxOpen } from "react-icons/fa";
import { TbHomeFilled } from "react-icons/tb";

const menuItems = [
  { name: "Dashboard", icon: <TbHomeFilled />, path: "/" },
  { name: "Users", icon: <FaUserCircle />, path: "/admin/users" },
  { name: "Products", icon: <FaBoxOpen />, path: "/admin/products" },
  { name: "Orders", icon: <FaWallet />, path: "/admin/orders" },
  { name: "Meetings", icon: <FaVideo />, path: "/admin/meetings" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Delay text appearance
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowText(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`fixed z-50 bg-gray-700 text-white transition-all duration-200
        ${isOpen ? "w-56" : "w-16"}
        h-[70%] top-28 left-10 rounded-3xl`}
    >
      {/* Toggle */}
      <div className={`flex ${isOpen ? "justify-end" : "justify-center"} p-3`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl text-gray-400 hover:text-white"
        >
          <BiMenu />
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 transition
                ${isOpen ? "justify-start" : "justify-center"}
                ${
                  isActive
                    ? "bg-amber-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && showText && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}