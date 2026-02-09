"use client";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({
  open,
  onClose,
  mode,
  setMode,
}: {
  open: boolean;
  onClose: () => void;
  mode: "login" | "register";
  setMode: (m: "login" | "register") => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {mode === "login" ? (
          <LoginForm
            onSuccess={onClose}
            switchToRegister={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={onClose}
            switchToLogin={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}