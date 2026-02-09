"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddUserModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let photoUrl = "";

      if (photo) {
        const fd = new FormData();
        fd.append("file", photo);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photo: photoUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to add user");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 text-black">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-center text-xl font-bold text-gray-800">
          Add User
        </h2>

        {error && (
          <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo */}
          {/* <div className="flex justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
              <div className="h-24 w-24 rounded-full border flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">
                    Upload Photo
                  </span>
                )}
              </div>
            </label>
          </div> */}

          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
          />

          {/* Skills */}
          {/* <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
          /> */}

          {/* Bio */}
          {/* <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            rows={3}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500"
          /> */}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}