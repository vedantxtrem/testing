"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserEditForm({ user }: any) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);

    await fetch(`/api/admin/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });

    setLoading(false);
    router.refresh();
  }

  async function resetPassword() {
    if (!confirm("Reset password to default?")) return;

    await fetch(`/api/admin/users/${user._id}/resetpassword`, {
      method: "POST",
    });

    alert("Password reset to madhuras@123");
  }

  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <h2 className="text-xl font-semibold">✏️ Edit User</h2>

      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <select
        className="border p-2 w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <div className="flex gap-3">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

        <button
          onClick={resetPassword}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}