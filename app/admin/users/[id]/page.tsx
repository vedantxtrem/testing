import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/order";
import UserEditForm from "@/components/admin/UserEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  await connectDB();

  const user = await User.findById(id).select("-password");
  if (!user) redirect("/admin/users");

  const orders = await Order.find({ user: user._id }).sort({
    createdAt: -1,
  });

  return (
    <div className="p-6 space-y-6 w-[70%] text-black md:ml-16">
      <h1 className="text-2xl font-bold">👤 User Details</h1>

      {/* USER INFO */}
      <div className="bg-white shadow rounded p-4 space-y-1">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Joined:</b> {new Date(user.createdAt).toDateString()}</p>
      </div>

      {/* USER ADDRESSES */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-3">🏠 Saved Addresses</h2>

        {user.addresses?.length === 0 ? (
          <p>No saved addresses</p>
        ) : (
          <div className="space-y-4">
            {user.addresses.map((addr: any) => (
              <div
                key={addr._id}
                className="border rounded p-3 bg-gray-50"
              >
                <p className="font-semibold">
                  {addr.fullName} {addr.isDefault && "(Default)"}
                </p>
                <p>{addr.phone}</p>
                <p>
                  {addr.addressLine1}, {addr.addressLine2}
                </p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p>{addr.country}</p>
              </div>
            ))}
          </div>
        )}
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
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-t">
                  <td className="p-2">{order._id}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.orderStatus}</td> {/* ✅ updated */}
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