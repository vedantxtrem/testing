import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // 🔐 Admin protection
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="p-10 w-screen h-screen bg-white">
      <h1 className="text-3xl font-bold">🐝 Honey Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, {session.user.email}
      </p>
    </div>
  );
}