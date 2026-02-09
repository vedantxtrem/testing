import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/order";

interface SearchParams {
  page?: string;
  q?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);

  // 🔐 Admin protection
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  await connectDB();

  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const query = searchParams.q
    ? {
        $or: [
          { status: { $regex: searchParams.q, $options: "i" } },
          { paymentStatus: { $regex: searchParams.q, $options: "i" } },
        ],
      }
    : {};

  const totalOrders = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="p-6 space-y-6 text-gray-800 w-[80%] ml-20">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">📦 Manage Orders</h1>

        <form>
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search status / payment"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
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
            </tr>
          </thead>

          <tbody>
            {orders.map((order: any) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 text-sm">{order._id}</td>

                <td className="p-3">
                  <div className="font-medium">
                    {order.user?.name || "Deleted User"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user?.email}
                  </div>
                </td>

                <td className="p-3">
                  {order.items.length}
                </td>

                <td className="p-3">
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

                <td className="p-3 font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="p-3 text-sm">
                  {new Date(order.createdAt).toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (p) => (
            <a
              key={p}
              href={`/admin/orders?page=${p}`}
              className={`px-3 py-1 rounded ${
                p === page
                  ? "bg-amber-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {p}
            </a>
          )
        )}
      </div>
    </div>
  );
}