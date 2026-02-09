"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm({
  onSuccess,
  switchToRegister,
}: {
  onSuccess: () => void;
  switchToRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // 🔥 VERY IMPORTANT
    });

    console.log("LOGIN RESPONSE:", res);

    if (!res || res.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess(); // close modal
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 text-black">
      <h2 className="text-center text-2xl font-bold text-amber-900">
        Welcome Back 🐝
      </h2>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      <p className="text-center text-sm text-gray-600">
        New here?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          className="font-semibold text-amber-700 hover:underline"
        >
          Create an account
        </button>
      </p>
    </form>
  );
}