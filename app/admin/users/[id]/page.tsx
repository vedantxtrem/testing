import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import UserEditForm from "@/components/admin/UserEditForm";
import Order from "@/lib/models/order";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params; // ✅ IMPORTANT

  await connectDB();

  const user = await User.findById(id).select("-password");
  if (!user) redirect("/admin/users");

  const orders = await Order.find({ user: user._id }).sort({
    createdAt: -1,
  });

  return (
    <div className="p-6 space-y-6 w-[70%] text-black md:ml-16 ">
      <h1 className="text-2xl font-bold">👤 User Details</h1>

      {/* USER INFO */}
      <div className="bg-white shadow rounded p-4">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Joined:</b> {new Date(user.createdAt).toDateString()}</p>
      </div>

      {/* EDIT USER */}
      <UserEditForm user={JSON.parse(JSON.stringify(user))} />

      {/* ORDERS */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-3">📦 Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-t">
                  <td className="p-2">{order._id}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}