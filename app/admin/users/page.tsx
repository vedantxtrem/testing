"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaEye, FaUserPlus } from "react-icons/fa";
import AddUserModal from "@/components/admin/AddUserModal";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "pending";
  photo?: string;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const ITEMS_PER_PAGE = 9;

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const statusClass = (status: string) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "inactive") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full flex flex-col justify-center items-center ">
      {/* Header */}
      <div className=" w-[70%] flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>

        <div className="flex gap-3">
          <input
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-amber-500 text-gray-700"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-600"
          >
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-[70%] overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="hidden md:table-cell px-4 py-3">Email</th>
              <th className="hidden lg:table-cell px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 "
              >
                <td
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3"
                >
                  <img
                    src={user.photo || "https://i.pravatar.cc/40"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-700">{user.name}</span>
                </td>

                <td className="hidden md:table-cell px-4 py-3 text-gray-600">
                  {user.email}
                </td>

                <td className="hidden lg:table-cell px-4 py-3 uppercase text-gray-700">
                  {user.role}
                </td>

                {/* <td className="hidden lg:table-cell px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold text-gray-700 ${statusClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td> */}

                <td className="px-4 py-3">
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        router.push(`/admin/users/${user._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!paginatedUsers.length && (
          <p className="py-10 text-center text-gray-500">
            No users found
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`rounded px-3 py-1 ${
              page === i + 1
                ? "bg-amber-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}