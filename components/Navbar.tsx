"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="border-b border-amber-100 bg-white/70 backdrop-blur-xl shadow-sm">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-lg text-white shadow-md">
                🍯
              </div>
              <span className="text-2xl font-bold text-amber-900">
                मधुRas
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-10 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-medium text-amber-900 transition hover:text-amber-600"
                >
                  {link.name}
                </Link>
              ))}

              {/* Auth Section */}
              {!session ? (
                <button
                  onClick={() => {
                    setMode("login");
                    setAuthOpen(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 font-semibold text-white shadow-md transition hover:from-amber-500 hover:to-yellow-600"
                >
                  Login
                </button>
              ) : (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="font-semibold text-amber-900 hover:text-amber-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 rounded-full bg-red-50 px-5 py-2 font-semibold text-red-600 hover:bg-red-100"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="text-amber-900 md:hidden"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </nav>

          {/* Mobile Menu */}
          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-5 border-t border-amber-100 bg-white/90 px-6 py-6 backdrop-blur-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-center font-medium text-amber-900 hover:text-amber-600"
                >
                  {link.name}
                </Link>
              ))}

              {!session ? (
                <button
                  onClick={() => {
                    setMode("login");
                    setAuthOpen(true);
                    setOpen(false);
                  }}
                  className="block w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 text-center font-semibold text-white shadow-md"
                >
                  Login
                </button>
              ) : (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="block text-center font-semibold text-amber-900"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full rounded-full bg-red-50 px-5 py-3 text-center font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Popup */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={mode}
        setMode={setMode}
      />
    </>
  );
}