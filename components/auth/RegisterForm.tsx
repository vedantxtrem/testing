"use client";

import { useState } from "react";

export default function RegisterForm({
  onSuccess,
  switchToLogin,
}: {
  onSuccess: () => void;
  switchToLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    onSuccess(); // close modal
  };

  return (
    <div className="space-y-4 text-black">
      <h2 className="text-center text-2xl font-bold text-amber-900">
        Create Account 🐝
      </h2>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <input
        placeholder="Full name"
        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        onClick={handleRegister}
        disabled={loading}
        className="w-full rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Register"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="font-semibold text-amber-700 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}