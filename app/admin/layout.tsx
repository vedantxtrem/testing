import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if needed
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔐 Admin protection
  if (!session || session.user.role !== "admin") {
    redirect("/login"); // or "/" if you prefer
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Optional: Admin Navbar */}
      <header className="bg-amber-700 text-white px-6 py-4 font-bold">
        Admin Dashboard
      </header>
      <AdminSidebar/>

      <main className="p-6">{children}</main>
    </div>
  );
}