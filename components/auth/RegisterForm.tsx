"use client";

import { useState } from "react";

export default function RegisterForm({
  onSuccess,
  switchToLogin,
}: {
  onSuccess: () => void;
  switchToLogin: () => void;
}) {
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 (Address)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!name || !email || !password) {
      setError("Please fill all user details");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRegister = async () => {
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      setError("Please fill complete address");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        address: {
          fullName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          country: "India",
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <div className="space-y-4 text-black">
      <h2 className="text-center text-2xl font-bold text-amber-900">
        Create Account 🐝
      </h2>

      {/* Step Indicator */}
      <div className="flex justify-center gap-2 text-sm">
        <span className={step === 1 ? "font-bold text-amber-700" : "text-gray-400"}>
          1. Details
        </span>
        <span>→</span>
        <span className={step === 2 ? "font-bold text-amber-700" : "text-gray-400"}>
          2. Address
        </span>
      </div>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <>
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
            onClick={handleNext}
            className="w-full rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700"
          >
            Next →
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            placeholder="Full Name (Receiver)"
            className="w-full rounded-lg border px-4 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            placeholder="Phone Number"
            className="w-full rounded-lg border px-4 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Address Line 1"
            className="w-full rounded-lg border px-4 py-2"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />

          <input
            placeholder="Address Line 2 (Optional)"
            className="w-full rounded-lg border px-4 py-2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />

          <input
            placeholder="City"
            className="w-full rounded-lg border px-4 py-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            placeholder="State"
            className="w-full rounded-lg border px-4 py-2"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          <input
            placeholder="Pincode"
            className="w-full rounded-lg border px-4 py-2"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/2 rounded-lg bg-gray-300 py-2 font-semibold"
            >
              ← Back
            </button>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-1/2 rounded-lg bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </div>
        </>
      )}

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