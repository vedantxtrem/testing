import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/order";
import mongoose from "mongoose";

interface SearchParams {
  page?: string;
  q?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 🔐 Protect Admin Route
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  await connectDB();

  /* ---------------- PAGINATION ---------------- */
  const page = Math.max(Number(searchParams.page) || 1, 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  /* ---------------- SEARCH ---------------- */
  const searchQuery = searchParams.q?.trim() || "";

  const query: any = {};

  if (searchQuery) {
    query.$or = [
      { status: { $regex: searchQuery, $options: "i" } },
      { paymentStatus: { $regex: searchQuery, $options: "i" } },
      { paymentMethod: { $regex: searchQuery, $options: "i" } },
    ];
  }

  /* ---------------- DATABASE ---------------- */
  const totalOrders = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(totalOrders / limit);

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-6 text-gray-800 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">📦 Manage Orders</h1>

        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search status / payment / method"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg">
            Search
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Order Status</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}

            {orders.map((order: any) => (
              <tr key={order._id.toString()} className="border-t hover:bg-gray-50">
                {/* Order ID */}
                <td className="p-3 text-sm font-mono">
                  {order._id.toString().slice(-6)}
                </td>

                {/* User */}
                <td className="p-3">
                  <div className="font-medium">
                    {order.user?.name || "Deleted User"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user?.email}
                  </div>
                </td>

                {/* Items */}
                <td className="p-3">{order.items?.length || 0}</td>

                {/* Payment */}
                <td className="p-3 space-y-1">
                  <div className="text-sm">{order.paymentMethod}</div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold
                    ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                {/* Order Status */}
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold
                    ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "confirmed"
                        ? "bg-purple-100 text-purple-700"
                        : order.status === "placed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Total */}
                <td className="p-3 font-semibold">
                  ₹{order.totalAmount?.toFixed(2)}
                </td>

                {/* Date */}
                <td className="p-3 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="p-3 flex gap-2">
                  <a
                    href={`/admin/orders/${order._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    View
                  </a>

                  <form
                    action={`/api/admin/orders/${order._id}`}
                    method="POST"
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/orders?page=${p}${
                searchQuery ? `&q=${searchQuery}` : ""
              }`}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}