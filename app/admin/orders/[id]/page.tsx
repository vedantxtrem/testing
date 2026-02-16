import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/order";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminSingleOrder({ params }: Props) {
  const session = await getServerSession(authOptions);

  // 🔐 Admin protection
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  // ✅ IMPORTANT: await params
  const { id } = await params;

  // ✅ Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    redirect("/admin/orders");
  }

  await connectDB();

  const order = await Order.findById(id)
    .populate("user", "name email")
    .lean();

  if (!order) {
    redirect("/admin/orders");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-black">
      <h1 className="text-2xl font-bold">🧾 Order Details</h1>

      {/* USER INFO */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">User Info</h2>
        <p><b>Name:</b> {order.user?.name || "Deleted User"}</p>
        <p><b>Email:</b> {order.user?.email || "-"}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Items</h2>

        {order.items?.map((item: any, index: number) => (
          <div
            key={index}
            className="flex justify-between border-b py-2"
          >
            <div>
              <p>{item.name}</p>
              <p className="text-sm text-gray-500">
                ₹{item.price}
              </p>
            </div>
            <div>Qty: {item.quantity}</div>
          </div>
        ))}
      </div>

      {/* UPDATE FORM */}
      <form
        // action={`/api/admin/order/${order._id}`}
        // method="PUT"
        className="bg-white p-4 rounded shadow space-y-4"
      >
        <input type="hidden" name="_method" value="PUT" />

        {/* ORDER STATUS */}
        <div>
          <label className="block mb-1">Order Status</label>
          <select
            name="status"
            defaultValue={order.status}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* PAYMENT STATUS */}
        <div>
          <label className="block mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            defaultValue={order.paymentStatus}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Update Order
        </button>
      </form>
    </div>
  );
}